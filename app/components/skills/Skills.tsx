

'use client';

import { useState } from 'react';
import { orbitron, colors, gradientStyle } from '../../lib/theme';

const skillsData = {
    title: "FrontEnd Web3 & Smart Contracts",
    selectors: [
        {
            id: "frontend",
            label: "FrontEnd",
            content: {
                description: "Interfaces futuristas y responsivas con React, Next.js y Tailwind. Experiencias inmersivas con shaders y diseño modular.",
                technologies: ["JavaScript", "TypeScript", "React", "Next.js", "TailwindCSS", "CSS Modules", "Shaders", "Three.js", "Gsap"]
            }
        },
        {
            id: "backend",
            label: "BackEnd",
            content: {
                description: "Automatización SaaS y APIs robustas con Node.js, Express y Nest.js. Persistencia con MongoDB y flujos OAuth.",
                technologies: ["Node.js", "Express", "Nest.js", "MongoDB", "REST APIs", "OAuth"]
            }
        },
        {
            id: "smartcontracts",
            label: "Smart Contracts",
            content: {
                description: "Contratos inteligentes seguros y modulares con Solidity y OpenZeppelin. Experimentos con ERC20, ERC721, ERC1167, ERC4337 y Governor.",
                technologies: ["Solidity", "Remix", "Foundry", "Hardhat", "OpenZeppelin", "ERC20", "ERC721", "ERC1167", "ERC4337", "Governor"],
            }
        },
        {
            id: "web3",
            label: "Web3",
            content: {
                description: "Integraciones con Ethers.js, Viem, Wagmi y RainbowKit. Wallet onboarding y experiencias descentralizadas fluidas.",
                technologies: ["Ethers.js", "Viem", "Wagmi", "RainbowKit", "IPFS"]
            }
        },
        {
            id: "otros",
            label: "Otros",
            content: {
                description: "Herramientas complementarias para diseño, colaboración y visualización 3D.",
                technologies: ["Git", "Figma", "Blender", "Shaders", "3D Assets"]
            }
        }
    ]
};

const Skills = () => {
    const [activeSkill, setActiveSkill] = useState(skillsData.selectors[0]);

    return (
        <section className="relative w-full min-h-screen overflow-hidden">
            <video
                src="/aurora.mp4"
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover z-0"
            />

            {/* Overlay oscuro */}
            <div className="absolute inset-0 bg-black/20 z-[1]"></div>

            <div className="relative z-20 max-w-7xl mx-auto px-4 py-16 min-h-screen flex flex-col justify-center">
                {/* Title */}
                <h2
                    className={`text-4xl md:text-5xl font-bold text-center mb-12 ${orbitron.className}`}
                    style={{
                        backgroundImage: gradientStyle,
                        WebkitBackgroundClip: 'text',
                        backgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        color: 'transparent'
                    }}
                >
                    {skillsData.title}
                </h2>

                {/* Selectors */}
                <div className="flex flex-wrap justify-center gap-4 mb-12">
                    {skillsData.selectors.map((skill) => (
                        <button
                            key={skill.id}
                            onClick={() => setActiveSkill(skill)}
                            className={`px-6 py-3 rounded-sm backdrop-blur-md border transition-all ${orbitron.className}`}
                            style={{
                                backgroundColor: activeSkill.id === skill.id ? `${colors.green}33` : 'rgba(255,255,255,0.1)',
                                borderColor: activeSkill.id === skill.id ? colors.green : colors.cyan + '66',
                                color: activeSkill.id === skill.id ? colors.green : '#fff',
                                boxShadow: activeSkill.id === skill.id ? `0 0 20px ${colors.green}66` : 'none'
                            }}
                        >
                            {skill.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div
                    className="flex flex-col backdrop-blur-xl bg-white/10 justify-around border rounded-lg p-8 max-w-4xl mx-auto w-full h-[380px] sm:h-[275px]"
                    style={{ borderColor: `${colors.cyan}66` }}
                >
                    <p className="text-gray-200 text-lg mb-6 leading-relaxed">
                        {activeSkill.content.description}
                    </p>

                    {/* Technologies */}
                    <div className="mb-6">
                        <h3 className={`text-sm uppercase tracking-widest mb-3 ${orbitron.className}`} style={{ color: colors.mint }}>
                            Technologies
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {activeSkill.content.technologies.map((tech, idx) => (
                                <span
                                    key={idx}
                                    className="px-3 py-1 text-sm backdrop-blur-md border rounded"
                                    style={{
                                        backgroundColor: 'rgba(255,255,255,0.1)',
                                        borderColor: colors.green + '33',
                                        color: colors.green
                                    }}
                                >
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default Skills;