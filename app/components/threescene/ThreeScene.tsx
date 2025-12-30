'use client';

import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

interface SphereProps {
  scrollProgress: number;
  isMobile: boolean;
}

function Sphere({ scrollProgress, isMobile }: SphereProps) {
  const meshRef = useRef<THREE.Group>(null);
  const gltf = useLoader(GLTFLoader, '/sphere2.glb');

  // Animación de oscilación combinada con scroll
  useFrame((state) => {
    if (meshRef.current) {
      // Oscilación suave en Y + posición basada en scroll
      const baseY = isMobile?(scrollProgress - 1) *3 : (scrollProgress - 0.5) * 3; // Se mueve según el scroll
      meshRef.current.position.y = baseY + Math.sin(state.clock.elapsedTime) * 0.3;
      meshRef.current.position.x = isMobile? 0 : 1.5
      // Rotación suave
      meshRef.current.rotation.y += 0.005;
      
      // Escala según scroll - más pequeña
      const scale = 0.8 + scrollProgress * 0.1;
      meshRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <primitive 
      ref={meshRef} 
      object={gltf.scene} 
      position={[0, 0, 0]}
    />
  );
}

interface CameraControllerProps {
  scrollProgress: number;
}

function CameraController({ scrollProgress }: CameraControllerProps) {
  const { camera } = useThree();
  
  useFrame((state) => {
    // Posición Z de la cámara atada al scroll + oscilación sutil
    const baseZ = 5 - scrollProgress * 2; // Se acerca según el scroll
    camera.position.z = baseZ + Math.sin(state.clock.elapsedTime * 0.3) * 0.15;
    
    // Ligero movimiento en Y según scroll
    camera.position.y = scrollProgress * 1.5;
  });

  return null;
}

interface SceneProps {
  scrollProgress: number;
  isMobile: boolean;
}

function Scene({ scrollProgress, isMobile }: SceneProps) {
  return (
    <>
      {/* Control de cámara */}
      <CameraController scrollProgress={scrollProgress} />

      {/* Luces principales */}
      <ambientLight intensity={20} />
      <hemisphereLight intensity={0.5} groundColor="#080820" />
      
      {/* Luz direccional principal */}
      <directionalLight 
        position={[5, 5, 5]} 
        intensity={1.5}
        castShadow
      />
      
      {/* Luces de relleno */}
      <pointLight position={[10, 0, 0]} intensity={0.8} color="#44ff44" />
      <pointLight position={[-10, 0, 0]} intensity={0.8} color="#00ff88" />
      <pointLight position={[0, -5, 3]} intensity={0.5} color="#44ff44" />
      
      {/* Spotlight frontal */}
      <spotLight 
        position={[0, 8, 5]} 
        angle={0.5} 
        penumbra={0.8} 
        intensity={1}
        castShadow
      />
      
      {/* Luz cyan en el centro de la esfera */}
      <pointLight position={[0, 0, 0]} intensity={2} color="#00ffff" distance={5} decay={2} />

      {/* Modelo 3D */}
      <Sphere scrollProgress={scrollProgress} isMobile={isMobile}/>
    </>
  );
}

interface ThreeSceneProps {
  contentRef: React.RefObject<HTMLDivElement | null>;
}

export default function ThreeScene({ contentRef }: ThreeSceneProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detectar mobile solo en el cliente
    setIsMobile(window.innerWidth < 768);
    
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      
      // Calcular progreso normalizado (0 a 1) del scroll total
      const totalScroll = docHeight - windowHeight;
      const progress = Math.min(Math.max(scrollY / totalScroll, 0), 1);
      
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Inicializar
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div ref={contentRef} className="w-full h-screen relative">
      {/* Background con scifi.jpg */}
      <div 
        className="absolute inset-0 w-full h-full z-0 mt-10"
        style={{
          backgroundImage: 'url(/scifi.jpg)',
          backgroundSize: 'cover', 
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      
      {/* Canvas con transparencia - reducido para ver background */}
      <div className="absolute inset-0 w-full h-full z-10">
        <Canvas
          camera={{ position: [0, 0, 5], fov: 75 }}
          className="w-full h-full"
          gl={{ 
            alpha: true, 
            antialias: true,
            preserveDrawingBuffer: true
          }}
        >
          <Scene scrollProgress={scrollProgress} isMobile={isMobile} />
        </Canvas>
      </div>
      
      {/* Overlay con título */}
      <div className="absolute top-20 left-10 z-20">
        <h2 className="text-6xl md:text-8xl font-bold text-white drop-shadow-lg">
          Experience
        </h2>
      </div>
    </div>
  );
}
