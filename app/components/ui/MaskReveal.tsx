'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, useTexture } from '@react-three/drei';
import { useRef, useState, Suspense, useMemo, useCallback, memo } from 'react';
import * as THREE from 'three';

// Precargar el modelo con DracoLoader
useGLTF.preload('/mask.glb');

// Constantes configurables para el efecto
const SCROLL_SPEED = 0.08; // Velocidad del barrido (menor = más lento)
const CHUNK_SIZE = 0.8; // Tamaño de la banda de revelación (0-1)
const HOVER_INTENSITY_SPEED = 3.0; // Velocidad de fade in del hover
const HOVER_FADE_OUT_SPEED = 2.0; // Velocidad de fade out del hover
const PULSE_SPEED = 2.0; // Velocidad de pulsación
const BASE_REVEAL_INTENSITY = 0.75; // Intensidad base cuando no hay hover (0-1) - AUMENTADO para más profundidad


const MaskModel = memo(({ mouseXRef, isHoveringRef }: { mouseXRef: React.RefObject<number>; isHoveringRef: React.RefObject<boolean> }) => {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const revealIntensity = useRef(0);
  
  // Cargar el modelo GLB con useGLTF (tiene soporte automático para Draco)
  const { scene } = useGLTF('/mask2.glb', true);
  
  // Encontrar la geometría y material original con textura
  let geometry: THREE.BufferGeometry | null = null;
  let originalTexture: THREE.Texture | null = null;
  
  scene.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      if (!geometry) {
        geometry = (child as THREE.Mesh).geometry;
      }
      
      // Intentar extraer la textura del material original
      const material = (child as THREE.Mesh).material;
      if (material && !originalTexture) {
        if (Array.isArray(material)) {
          const mat = material[0] as THREE.MeshStandardMaterial;
          if (mat.map) originalTexture = mat.map;
        } else {
          const mat = material as THREE.MeshStandardMaterial;
          if (mat.map) originalTexture = mat.map;
        }
      }
    }
  });
  
  useFrame((state, delta) => {
    if (materialRef.current && mouseXRef.current !== undefined && isHoveringRef.current !== undefined) {
      // Animar la intensidad del reveal
      if (isHoveringRef.current) {
        revealIntensity.current = Math.min(1, revealIntensity.current + delta * HOVER_INTENSITY_SPEED);
      } else {
        revealIntensity.current = Math.max(0, revealIntensity.current - delta * HOVER_FADE_OUT_SPEED);
      }
      
      // Siempre pasar el tiempo para mantener la animación continua
      materialRef.current.uniforms.uMouseX.value = mouseXRef.current;
      materialRef.current.uniforms.uRevealIntensity.value = isHoveringRef.current ? revealIntensity.current : BASE_REVEAL_INTENSITY;
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });
  
  // Shaders memorizados para evitar recreación en cada render
  const vertexShader = useMemo(() => `
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;
    
    void main() {
      vUv = uv;
      vPosition = position;
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `, []);
  
  const fragmentShader = useMemo(() => `
    uniform float uMouseX;
    uniform float uRevealIntensity;
    uniform float uTime;
    uniform sampler2D uTexture;
    uniform bool hasTexture;
    uniform float uScrollSpeed;
    uniform float uChunkSize;
    uniform float uPulseSpeed;
    
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;
    
    // Función de ruido para crear patrón orgánico
    float noise(vec2 p) {
      return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
    }
    
    void main() {
      // Obtener color base de la textura o usar color por defecto
      vec4 textureColor = hasTexture ? texture2D(uTexture, vUv) : vec4(0.8, 0.8, 0.8, 1.0);
      
      // Colores para el efecto
      vec3 glowColor = vec3(0.0, 1.0, 0.8); // Cyan brillante
      vec3 baseColor = textureColor.rgb;
      
      // Normalizar posición X del vértice (-1 a 1) -> (0 a 1)
      float vertexX = (vPosition.x + 1.0) / 2.0;
      
      // DESPLAZAMIENTO ANIMADO: Un solo recorrido lento de derecha a izquierda
      float scrollSpeed = uTime * uScrollSpeed;
      float animatedVertexX = fract(vertexX + scrollSpeed); // Se desplaza y repite
      
      // Un solo chunk/banda que recorre toda la superficie
      float chunkSize = uChunkSize;
      float chunkIndex = floor(animatedVertexX / chunkSize);
      
      // Normalizar mouseX para que funcione en el mismo espacio
      float normalizedMouseX = uMouseX;
      float mouseChunkIndex = floor(normalizedMouseX / chunkSize);
      
      // Distancia del chunk actual al chunk del mouse
      float chunkDistance = abs(chunkIndex - mouseChunkIndex);
      
      // Revelación basada en la posición animada (barrido continuo INDEPENDIENTE)
      float revealWave = smoothstep(0.3, 0.7, animatedVertexX);
      
      // Base reveal que SIEMPRE está activo y animado
      float revealAmount = revealWave * 0.7;
      
      // Efecto hover SEPARADO que solo afecta el brillo, no el movimiento
      float mouseProximity = smoothstep(0.4, 0.0, abs(vertexX - normalizedMouseX)); // Radio más amplio
      float hoverBoost = mouseProximity * uRevealIntensity * 0.7; // AUMENTADO de 0.3 a 0.7
      
      // Efecto fresnel para bordes brillantes
      vec3 viewDirection = normalize(vec3(0.0, 0.0, 1.0));
      float fresnel = pow(1.0 - abs(dot(normalize(vNormal), viewDirection)), 3.0);
      
      // Brillo en los bordes de los chunks (líneas verticales brillantes que se mueven)
      float chunkEdge = fract(animatedVertexX / chunkSize);
      float edgeHighlight = smoothstep(0.92, 1.0, chunkEdge) + smoothstep(0.08, 0.0, chunkEdge);
      vec3 edgeGlow = glowColor * edgeHighlight * (revealAmount + 0.5 + hoverBoost * 0.8) * 1.5; // AUMENTADO
      
      // Fresnel glow que aumenta con el reveal
      vec3 fresnelGlow = glowColor * fresnel * revealAmount * 0.7; // AUMENTADO
      vec3 hoverFresnel = glowColor * fresnel * hoverBoost * 1.0; // AUMENTADO
      
      // Partículas animadas en los chunks activos
      float particleNoise = noise(vec2(chunkIndex * 15.0 + uTime * 2.0, vPosition.y * 8.0 + uTime));
      float particles = particleNoise * step(0.75, particleNoise) * revealAmount;
      vec3 particleGlow = glowColor * particles * 0.4;
      
      // Pulso suave general
      float pulse = sin(uTime * uPulseSpeed) * 0.25 + 0.85;
      revealAmount *= pulse;
      
      // Combinar efectos de brillo (hover es ADITIVO, no reemplaza)
      vec3 glowEffects = edgeGlow + fresnelGlow + hoverFresnel + particleGlow;
      vec3 finalColor = baseColor + glowEffects;
      
      // OPACITY/TRANSPARENCY: Los chunks activos se vuelven más transparentes
      // revelando la imagen de fondo detrás
      float baseOpacity = 0.65; // Opacidad base REDUCIDA para más transparencia
      float revealTransparency = revealAmount * 0.9; // AUMENTADO para más transparencia en reveal
      float hoverTransparency = hoverBoost * 0.3; // Transparencia adicional en hover
      float finalAlpha = baseOpacity - revealTransparency - hoverTransparency;
      
      // Hacer que los bordes de los chunks sean más visibles
      finalAlpha += edgeHighlight * 0.15;
      
      // Clamp alpha entre valores razonables
      finalAlpha = clamp(finalAlpha, 0.15, 1.0);
      
      gl_FragColor = vec4(finalColor, finalAlpha);
    }
  `, []);

  return (
    <group ref={groupRef} rotation={[Math.PI / 2.2, 0, 0]} position={[0,-1.5,0.8]} scale={[1.6,1.4,0.95]}>
      {geometry && (
        <mesh
          ref={meshRef}
          geometry={geometry}
          scale={3}
        >
          <shaderMaterial
            ref={materialRef}
            vertexShader={vertexShader}
            fragmentShader={fragmentShader}
            uniforms={{
              uMouseX: { value: 0.5 },
              uRevealIntensity: { value: 0 },
              uTime: { value: 0 },
              uTexture: { value: originalTexture },
              hasTexture: { value: originalTexture !== null },
              uScrollSpeed: { value: SCROLL_SPEED },
              uChunkSize: { value: CHUNK_SIZE },
              uPulseSpeed: { value: PULSE_SPEED }
            }}
            transparent={true}
            side={THREE.DoubleSide}
            depthWrite={true}
            blending={THREE.NormalBlending}
          />
        </mesh>
      )}
    </group>
  );
});

function Loader() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="hotpink" wireframe />
    </mesh>
  );
}

export default function MaskReveal() {
  const mouseXRef = useRef<number>(0.5);
  const isHoveringRef = useRef<boolean>(false);
  const [showMask, setShowMask] = useState(false);
  
  // Delay de 2 segundos antes de mostrar la máscara
  useState(() => {
    const timer = setTimeout(() => {
      setShowMask(true);
    }, 2000); // 2 segundos de delay
    return () => clearTimeout(timer);
  });
  
  return (
    <div className="w-full h-full relative">
      {/* Imagen de fondo en HTML */}
      <div 
        className="absolute inset-0" 
        style={{
          backgroundImage: 'url(/yo-vin.png)',
          backgroundSize: '80%',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          pointerEvents: 'none'
        }}
      />
      
      {/* Canvas 3D con transparencia */}
      <div 
        className="absolute inset-0"
        onPointerMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          mouseXRef.current = (e.clientX - rect.left) / rect.width;
          isHoveringRef.current = true;
        }}
        onPointerLeave={() => {
          isHoveringRef.current = false;
        }}
      >
        <Canvas 
          camera={{ position: [0, 0, 5], fov: 50 }}
          gl={{ alpha: true }}
          style={{ background: 'transparent', width: '100%', height: '100%'}}
        >
          <ambientLight intensity={1} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00ffcc" />
          <spotLight position={[0, 10, 0]} angle={0.3} intensity={1} />
          
          <Suspense fallback={<Loader />}>
            {showMask && <MaskModel mouseXRef={mouseXRef} isHoveringRef={isHoveringRef} />}
          </Suspense>
          
          <OrbitControls
            enableRotate={false}
            enableZoom={false}
            enablePan={false}
            minDistance={3}
            maxDistance={10}
          />
        </Canvas>
        
      </div>
    </div>
  );
}
