'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useResponsive } from '../../contexts/ResponsiveContext';
import { orbitron, gradientStyle } from '../../lib/theme';
import ConcaveBezierCarousel from '../ui/ConcaveBezierCarousel';
import ProjectDetailModal from '../ui/ProjectDetailModal';
import type { Project3DItem } from '../ui/types';
import ProjectsMobile from './ProjectsMobile';

// ─── Project data ──────────────────────────────────────────────────────────

const PROJECTS: Project3DItem[] = [
  {
    id: 0,
    title: 'DeFiar',
    image: '/defiar.png',
    url: 'defiar.xyz',
    colorCard: [142, 249, 252],
    type: 'WEB3 · DEFI',
    description: 'Implementation of DeFi with GMX perpetuals, with account abstraction, session keys, and AI asistence recomendations. The product is designed to make DeFi more accessible and user-friendly, while also providing advanced features for experienced users.',
    features: [
      { title: 'MANUAL TRANSACTIONS', text: 'You can operate in the same way as in any dApp by signing each transaction.' },
      { title: 'SESSION KEYS', text: "By activating session keys, along with account abstraction, you won't need to sign each transaction, allowing for smooth operation." },
      { title: 'AUTO MODE', text: 'An AI agent is hydrated with OHLC data and will recommend an operation based on this data.' }
    ],
    tech: ['Next.js', 'TypeScript', 'Solidity', 'Wagmi', 'Tailwind', 'GSAP'],
    live: 'https://defiar.vercel.app/',
    repo: 'https://github.com/blastonyz/DefIA-Aleph2026',
  },
  {
    id: 1,
    title: 'Greenhouse',
    image: '/greenhouse.png',
    url: 'greenhouse.app',
    colorCard: [142, 252, 157],
    type: 'WEB3 · CARBON CREDITS',
    description: 'Tokenization platform for verified carbon projects. Users can purchase tokenized credits to mitigate their environmental impact while issuers and verifiers manage standards, inventory and traceability through a clean operational interface.',
    features: [
      { title: 'TOKENIZATION', text: 'ERC-20 carbon credits verified by recognized environmental standards.' },
      { title: 'MARKETPLACE', text: 'Streamlined purchase and sale flow for available credit inventory.' },
      { title: 'ROLES', text: 'Company, verifier and project issuer roles with tailored permissions.' },
      { title: 'STANDARDS', text: 'Support for multiple carbon verification frameworks and reporting layers.' },
    ],
    tech: ['React', 'Solidity', 'ERC-721', 'IPFS', 'ERC-20','ERC-1167', 'Hardhat', 'Tailwind', 'ethers'],
    live: 'https://hedera-hackathon-ten.vercel.app/',
    repo: 'https://github.com/blastonyz/Hedera-Hackathon',
  },
  {
    id: 2,
    title: 'MultiDAO',
    image: '/multidao.png',
    url: 'multidao.io',
    colorCard: [142, 202, 252],
    type: 'WEB3 · GOVERNANCE',
    description: 'Institutional governance platform for decentralized organizations. Built to create, manage and scale DAOs with proposal workflows, treasury controls and a structure that feels robust enough for serious onchain coordination.',
    features: [
      { title: 'DAO FACTORY', text: 'Deploy and configure new organizations with reusable governance presets.' },
      { title: 'PROPOSALS', text: 'Voting flows with quorum rules and execution-ready decisions.' },
      { title: 'TREASURY', text: 'Asset visibility and control surfaces for collective capital management.' },
      { title: 'COORDINATION', text: 'Participant tooling aimed at clarity across growing communities.' },
    ],
    tech: ['Next.js', 'Solidity', 'GraphQL', 'TypeScript', 'Wagmi', 'Tailwind'],
    live: 'https://avalanche-two.vercel.app/',
    repo: 'https://github.com/blastonyz/Avalanche',
  },
  {
    id: 3,
    title: 'Road to Pro',
    image: '/roadtopro.png',
    url: 'roadtopro.dev',
    colorCard: [215, 252, 142],
    type: 'PLATFORM · E-SPORTS',
    description: 'Competitive gaming talent pipeline platform. Players form teams, improve through structured progression and get discovered by organizations through performance-driven scouting and communication tools.',
    features: [
      { title: 'MATCHMAKING', text: 'Skill-based team formation and competitive alignment.' },
      { title: 'SCOUTING', text: 'Visibility tools for organizations tracking emerging talent.' },
      { title: 'STATS', text: 'Performance metrics and progression tracking across sessions.' },
      { title: 'GLOBAL PLAY', text: 'Support for distributed players, teams and competitive flows.' },
    ],
    tech: ['React', 'Node.js', 'PostgreSQL', 'WebSockets', 'Redis', 'GSAP'],
    live: 'https://road-to-pro.vercel.app/',
    repo: 'https://github.com/blastonyz/RoadToPro',
  },
  {
    id: 4,
    title: 'Sanar',
    image: '/sanar.png',
    url: 'sanar.ong',
    colorCard: [142, 252, 204],
    type: 'HEALTH · WEB PLATFORM',
    description: 'Holistic wellness platform integrating alternative healing methods with natural approaches. The product balances editorial content, guided experiences and membership flows around a calm but structured digital environment.',
    features: [
      { title: 'MEDITATION', text: 'Guided sessions and routines designed for ongoing practice.' },
      { title: 'FLORAL THERAPY', text: 'Specialized Bach flower content and counseling pathways.' },
      { title: 'MEMBERSHIP', text: 'Tiered access model for premium resources and experiences.' },
      { title: 'DONATIONS', text: 'Community support system for sustaining the initiative.' },
    ],
    tech: ['Next.js', 'Tailwind', 'TypeScript', 'NextAuth'],
    live: 'https://fundacion-sanar.vercel.app/',
    repo: 'https://github.com/blastonyz/Fundacion-Sanar',
  },
  {
    id: 5,
    title: 'TuAgro',
    image: '/tuagro.png',
    url: 'tuagro.com.ar',
    colorCard: [252, 208, 142],
    type: 'AGTECH · E-COMMERCE',
    description: 'Agricultural technology platform for fertilizers and soil improvement products. A focused marketplace that connects producers with catalog navigation, quoting workflows and direct commercial contact.',
    features: [
      { title: 'CATALOG', text: 'Structured product browsing with filters for agricultural needs.' },
      { title: 'ORDERS', text: 'Quote and order management flow for commercial follow-up.' },
      { title: 'BRANDS', text: 'Multi-brand administration across product families.' },
      { title: 'CONTACT', text: 'Direct channel to sales representatives and technical support.' },
    ],
    tech: ['React', 'Node.js', 'MongoDB', 'REST API', 'Tailwind'],
    live: 'https://www.tuagro.com.ar/',
    repo: 'https://github.com/blastonyz/TuAgro',
  },
];

// ─── Main ──────────────────────────────────────────────────────────────────

interface ProjectsProps {
  contentRef: React.RefObject<HTMLDivElement | null>;
}

export default function Projects({ contentRef }: ProjectsProps) {
  const titleRef = useRef<HTMLDivElement>(null);
  const { isMobile } = useResponsive();
  const [selectedProjectIndex, setSelectedProjectIndex] = useState<number | null>(null);

  const selectedProject = selectedProjectIndex === null ? null : PROJECTS[selectedProjectIndex];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
      );
    });
    return () => ctx.revert();
  }, []);

  // Mobile view
  if (isMobile) {
    return (
      <div className="projects-container relative w-full bg-transparent mb-[5px]">
        <section id="projects" className="relative z-10 flex items-start justify-center pt-0 px-4 sm:px-8">
          <div className="w-full max-w-3xl mt-4">
            <ProjectsMobile
              projects={PROJECTS}
              onOpenProject={(project) => {
                const index = PROJECTS.findIndex((item) => item.id === project.id);
                setSelectedProjectIndex(index >= 0 ? index : null);
              }}
            />
          </div>
        </section>
        <ProjectDetailModal
          project={selectedProject}
          projects={PROJECTS}
          currentIndex={selectedProjectIndex}
          onClose={() => setSelectedProjectIndex(null)}
          onSelectProject={setSelectedProjectIndex}
        />
      </div>
    );
  }

  // Desktop view
  return (
    <div className="projects-container relative w-full min-h-[1100px]">
      <section id="projects" className="relative z-10 min-h-[1100px] flex items-start justify-center md:pt-6">
        <div ref={contentRef} className="mx-auto w-full max-w-[1600px] px-6 sm:px-8 lg:px-14 xl:px-20">
          <div ref={titleRef} className="text-center mb-10">
            <h2
              className={`text-5xl md:text-7xl font-bold mb-6 ${orbitron.className}`}
              style={{
                backgroundImage: gradientStyle,
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                color: 'transparent',
              }}
            >
              PROJECTS
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Featured work and recent developments
            </p>
          </div>

          <div className="mt-8">
            <ConcaveBezierCarousel
              projects={PROJECTS}
              onOpenProject={(project) => {
                const index = PROJECTS.findIndex((item) => item.id === project.id);
                setSelectedProjectIndex(index >= 0 ? index : null);
              }}
            />
          </div>
        </div>
      </section>
      <ProjectDetailModal
        project={selectedProject}
        projects={PROJECTS}
        currentIndex={selectedProjectIndex}
        onClose={() => setSelectedProjectIndex(null)}
        onSelectProject={setSelectedProjectIndex}
      />
    </div>
  );
}
