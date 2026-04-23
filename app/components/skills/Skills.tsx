'use client';

import { useMemo, useState } from 'react';
import { orbitron, colors } from '../../lib/theme';

type SkillCard = {
  num: string;
  title: string;
  desc: string;
  tech: string[];
};

type SkillPanel = {
  id: string;
  label: string;
  cards: SkillCard[];
};

const SKILL_PANELS: SkillPanel[] = [
  {
    id: 'frontend',
    label: 'FRONTEND',
    cards: [
      {
        num: '01',
        title: 'UI FRAMEWORKS',
        desc: 'Building scalable component architectures with modern reactive frameworks for high-performance interfaces.',
        tech: ['React', 'Next.js', 'Vue 3', 'Nuxt'],
      },
      {
        num: '02',
        title: 'STYLING & ANIMATION',
        desc: 'Crafting immersive visual experiences with advanced CSS, GSAP timelines and shader-based effects.',
        tech: ['Tailwind', 'GSAP', 'Framer Motion', 'CSS Modules'],
      },
      {
        num: '03',
        title: '3D & WEBGL',
        desc: 'Creating real-time 3D scenes, custom shaders and WebGL pipelines for immersive web experiences.',
        tech: ['Three.js', 'WebGL', 'GLSL', 'R3F', 'Shaders'],
      },
      {
        num: '04',
        title: 'TYPED LANGUAGES',
        desc: 'TypeScript-first development with strict typing, advanced generics and scalable code architecture.',
        tech: ['TypeScript', 'JavaScript ES2024', 'JSDoc'],
      },
    ],
  },
  {
    id: 'backend',
    label: 'BACKEND',
    cards: [
      {
        num: '01',
        title: 'RUNTIME & SERVERS',
        desc: 'Building APIs and server-side logic with Node.js, handling real-time connections and data streams.',
        tech: ['Node.js', 'Express', 'Fastify', 'Bun'],
      },
      {
        num: '02',
        title: 'DATA LAYER',
        desc: 'Designing schemas, managing migrations and optimizing queries for relational and document stores.',
        tech: ['PostgreSQL', 'MongoDB', 'Prisma', 'Redis'],
      },
      {
        num: '03',
        title: 'API DESIGN',
        desc: 'REST and GraphQL API architecture with real-time subscriptions, batching and schema federation.',
        tech: ['GraphQL', 'REST', 'Apollo', 'WebSockets'],
      },
    ],
  },
  {
    id: 'smartcontracts',
    label: 'SMART CONTRACTS',
    cards: [
      {
        num: '01',
        title: 'SOLIDITY CONTRACTS',
        desc: 'Writing, testing and deploying ERC-20, ERC-721 and custom smart contracts on EVM-compatible chains.',
        tech: ['Solidity', 'ERC-20', 'ERC-721', 'OpenZeppelin'],
      },
      {
        num: '02',
        title: 'DEV TOOLING',
        desc: 'Full smart contract development lifecycle with testing frameworks, local nodes and security analysis.',
        tech: ['Hardhat', 'Foundry', 'Remix', 'Slither'],
      },
      {
        num: '03',
        title: 'DEPLOYMENT & OPS',
        desc: 'Mainnet and testnet deployments, contract verification, upgradeable proxies and multi-sig governance.',
        tech: ['Ethereum', 'Polygon', 'Arbitrum', 'IPFS'],
      },
    ],
  },
  {
    id: 'web3',
    label: 'WEB3',
    cards: [
      {
        num: '01',
        title: 'WALLET INTEGRATION',
        desc: 'Seamless wallet connection flows, multi-chain support and transaction signing with UX-first approach.',
        tech: ['Wagmi', 'Viem', 'RainbowKit', 'WalletConnect'],
      },
      {
        num: '02',
        title: 'BLOCKCHAIN DATA',
        desc: 'Indexing on-chain data, building subgraphs and querying decentralized protocols with The Graph.',
        tech: ['The Graph', 'Ethers.js', 'Web3.js', 'Alchemy'],
      },
      {
        num: '03',
        title: 'DEFI PROTOCOLS',
        desc: 'Integrating DEX swaps, liquidity pools, yield strategies and DAO governance interfaces.',
        tech: ['Uniswap SDK', 'Aave', 'DAOs', 'Aragon'],
      },
    ],
  },
  {
    id: 'otros',
    label: 'OTROS',
    cards: [
      {
        num: '01',
        title: 'DESIGN & 3D TOOLS',
        desc: 'Herramientas complementarias para diseño, colaboración y visualización 3D.',
        tech: ['Git', 'Figma', 'Blender', 'Shaders', '3D Assets'],
      },
      {
        num: '02',
        title: 'DEVOPS & CLOUD',
        desc: 'CI/CD pipelines, containerized deployments and cloud infrastructure for scalable web apps.',
        tech: ['Docker', 'GitHub Actions', 'Vercel', 'AWS'],
      },
    ],
  },
];

export default function Skills() {
  const [activeId, setActiveId] = useState(SKILL_PANELS[0].id);

  const activePanel = useMemo(
    () => SKILL_PANELS.find((panel) => panel.id === activeId) ?? SKILL_PANELS[0],
    [activeId],
  );

  return (
    <section id="skills" className="relative w-full overflow-hidden px-8 py-2 md:px-20">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, #030D0A 0%, #071410 100%)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1200px]">
        <div className="mb-16 text-center">
          <span className="mb-3 block font-mono text-[11px] tracking-[0.35em]" style={{ color: colors.green }}>
            // 02 · TECH_STACK
          </span>
          <h2 className={`text-3xl font-bold md:text-5xl ${orbitron.className}`}>
            FrontEnd <span style={{ color: colors.green }}>Web3</span> & Smart Contracts
          </h2>
          <div
            className="mx-auto mt-5 h-[2px] w-20"
            style={{ background: `linear-gradient(90deg, transparent, ${colors.green}, transparent)` }}
          />
        </div>

        <div className="mb-12 flex flex-wrap justify-center gap-1">
          {SKILL_PANELS.map((panel) => {
            const active = panel.id === activeId;
            return (
              <button
                key={panel.id}
                type="button"
                onClick={() => setActiveId(panel.id)}
                className={`border px-5 py-2 text-[10px] tracking-[0.2em] transition-colors ${orbitron.className}`}
                style={{
                  borderColor: active ? colors.green : 'rgba(0,255,178,0.12)',
                  background: active ? colors.green : 'transparent',
                  color: active ? '#030D0A' : '#5A8A7A',
                }}
              >
                {panel.label}
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap justify-center gap-5">
          {activePanel.cards.map((card) => (
            <article
              key={`${activePanel.id}-${card.num}`}
              className="relative w-[280px] overflow-hidden border p-7 transition-transform duration-200 hover:-translate-y-1"
              style={{
                background: '#0A1F19',
                borderColor: 'rgba(0,255,178,0.12)',
              }}
            >
              <div
                className="absolute left-0 top-0 h-[2px] w-full"
                style={{ background: `linear-gradient(90deg, transparent, ${colors.green}, transparent)` }}
              />

              <div
                className={`pointer-events-none absolute right-5 top-4 text-4xl leading-none ${orbitron.className}`}
                style={{ color: 'rgba(0,255,178,0.05)' }}
              >
                {card.num}
              </div>

              <h3 className={`mb-4 text-xs tracking-[0.18em] ${orbitron.className}`} style={{ color: colors.green }}>
                {card.title}
              </h3>

              <p className="mb-5 text-sm leading-relaxed text-[#5A8A7A]">{card.desc}</p>

              <div className="flex flex-wrap gap-2">
                {card.tech.map((tech) => (
                  <span
                    key={tech}
                    className="border px-3 py-1 font-mono text-[10px]"
                    style={{
                      borderColor: 'rgba(0,255,178,0.12)',
                      background: 'rgba(0,255,178,0.03)',
                      color: '#5A8A7A',
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
