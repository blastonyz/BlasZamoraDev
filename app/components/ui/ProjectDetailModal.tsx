'use client';

import { useEffect, useState } from 'react';
import type { Project3DItem } from './types';
import { colors, orbitron } from '../../lib/theme';

type ProjectDetailModalProps = {
  project: Project3DItem | null;
  projects: Project3DItem[];
  currentIndex: number | null;
  onClose: () => void;
  onSelectProject: (index: number | null) => void;
};

export default function ProjectDetailModal({
  project,
  projects,
  currentIndex,
  onClose,
  onSelectProject,
}: ProjectDetailModalProps) {
  const [showProjectImage, setShowProjectImage] = useState(false);

  useEffect(() => {
    if (!project) return;

    const previousOverflow = document.body.style.overflow;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (currentIndex === null || projects.length === 0) return;
      if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
        onSelectProject((currentIndex + 1) % projects.length);
      }
      if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
        onSelectProject((currentIndex - 1 + projects.length) % projects.length);
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [project, onClose, currentIndex, projects, onSelectProject]);

  useEffect(() => {
    if (!project) return;

    setShowProjectImage(false);
    const timeoutId = window.setTimeout(() => {
      setShowProjectImage(true);
    }, 560);

    return () => window.clearTimeout(timeoutId);
  }, [project]);

  if (!project) return null;

  const [red, green, blue] = project.colorCard;
  const glyph = project.title.charAt(0).toUpperCase();
  const category = project.type.split('·')[0]?.trim() || project.type;
  const status = project.status ?? 'DEPLOYED';
  const year = project.year ?? '2024 — 2025';
  const role = project.role ?? 'Lead Frontend Engineer';
  const pathName = project.title.toLowerCase().replace(/[^a-z0-9]+/g, '');
  const canNavigate = currentIndex !== null && projects.length > 1;

  const selectPrev = () => {
    if (currentIndex === null || projects.length === 0) return;
    onSelectProject((currentIndex - 1 + projects.length) % projects.length);
  };

  const selectNext = () => {
    if (currentIndex === null || projects.length === 0) return;
    onSelectProject((currentIndex + 1) % projects.length);
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex bg-[rgba(3,13,10,0.95)] backdrop-blur-md mt-9 md:mt-14"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      role="presentation"
    >
      <div
        className="relative flex h-full w-full flex-col overflow-hidden md:flex-row"
        style={{
          boxShadow: `0 0 42px rgba(${red},${green},${blue},0.16), 0 28px 80px rgba(0,0,0,0.56)`,
        }}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-detail-title"
      >
        <div className="relative flex min-h-[38vh] flex-[1.1] flex-col justify-end overflow-hidden bg-[rgba(10,31,25,0.95)] px-8 py-10 md:min-h-full md:px-12 md:py-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.04),transparent_56%)]" />
          <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_3px,rgba(0,255,157,0.018)_3px,rgba(0,255,157,0.018)_6px)]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,157,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,157,0.04)_1px,transparent_1px)] bg-[size:40px_40px]" />
          <div
            className="absolute inset-0 transition-all duration-700 ease-out"
            style={{
              opacity: showProjectImage ? 0.52 : 0,
              filter: showProjectImage ? 'blur(0px)' : 'blur(12px)',
              transform: showProjectImage ? 'scale(1)' : 'scale(1.06)',
            }}
          >
            <img src={project.image} alt={project.title} className="h-full w-full object-cover object-top mix-blend-screen" draggable={false} />
          </div>

          <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
            <div className="relative h-[340px] w-[340px]">
              <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                <div
                  className={`text-[clamp(80px,18vw,200px)] font-black leading-none transition-all duration-700 ease-out ${orbitron.className}`}
                  style={{
                    color: `rgba(${red},${green},${blue},${showProjectImage ? '0.015' : '0.09'})`,
                    transform: showProjectImage ? 'scale(0.94)' : 'scale(1)',
                    opacity: showProjectImage ? 0.18 : 1,
                  }}
                >
                  {glyph}
                </div>
              </div>

              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: showProjectImage ? 170 : 205,
                    height: showProjectImage ? 170 : 205,
                    opacity: showProjectImage ? 0 : 1,
                    background: `radial-gradient(circle at 35% 35%, rgba(255,255,255,0.55), rgba(${red},${green},${blue},0.42) 34%, rgba(${red},${green},${blue},0.14) 62%, rgba(3,13,10,0) 100%)`,
                    boxShadow: `0 0 42px rgba(${red},${green},${blue},0.34), inset 0 0 24px rgba(255,255,255,0.18)`,
                    filter: showProjectImage ? 'blur(6px)' : 'blur(0px)',
                    transform: showProjectImage ? 'scale(1.08)' : 'scale(1)',
                  }}
                />
              </div>

              <div
                className="absolute inset-0 m-auto h-[220px] w-[220px] rounded-full border transition-all duration-700 ease-out"
                style={{
                  borderColor: `rgba(${red},${green},${blue},0.55)`,
                  opacity: showProjectImage ? 0 : 0.92,
                  transform: `scale(${showProjectImage ? 1.03 : 1})`,
                }}
              />
              <div
                className="absolute inset-0 m-auto h-[280px] w-[280px] rounded-full border border-dashed transition-all duration-700 ease-out"
                style={{
                  borderColor: `rgba(${red},${green},${blue},0.36)`,
                  opacity: showProjectImage ? 0 : 0.8,
                  transform: `rotate(${showProjectImage ? '18deg' : '0deg'}) scale(${showProjectImage ? 1.01 : 1})`,
                }}
              />
              <div
                className="absolute inset-0 m-auto h-[340px] w-[340px] rounded-full border transition-all duration-700 ease-out"
                style={{
                  borderColor: `rgba(${red},${green},${blue},0.18)`,
                  opacity: showProjectImage ? 0 : 0.6,
                  transform: `scale(${showProjectImage ? 1.05 : 1})`,
                }}
              />
            </div>
          </div>

          {canNavigate && (
            <div className="absolute right-0 top-1/2 z-10 flex -translate-y-1/2 flex-col gap-1">
              <button
                type="button"
                onClick={selectPrev}
                className="flex h-8 w-8 items-center justify-center border bg-[rgba(3,13,10,0.8)] text-xs text-white/70 transition hover:text-white"
                style={{ borderColor: `rgba(${red},${green},${blue},0.3)` }}
                aria-label="Previous project"
              >
                ▲
              </button>
              <button
                type="button"
                onClick={selectNext}
                className="flex h-8 w-8 items-center justify-center border bg-[rgba(3,13,10,0.8)] text-xs text-white/70 transition hover:text-white"
                style={{ borderColor: `rgba(${red},${green},${blue},0.3)` }}
                aria-label="Next project"
              >
                ▼
              </button>
            </div>
          )}

          {canNavigate && (
            <div className="absolute bottom-10 right-8 z-10 flex flex-col gap-2 md:right-10">
              {projects.map((item, index) => {
                const active = index === currentIndex;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onSelectProject(index)}
                    aria-label={`Open ${item.title}`}
                    className="w-[6px] transition-all duration-200"
                    style={{
                      height: active ? 48 : 32,
                      background: active ? `rgb(${red},${green},${blue})` : `rgba(${red},${green},${blue},0.2)`,
                    }}
                  />
                );
              })}
            </div>
          )}

          <div className="absolute inset-x-0 bottom-0 z-[2] bg-gradient-to-t from-[rgba(3,13,10,0.95)] to-transparent px-8 pb-10 pt-20 md:px-12 md:pb-12">
            <span className="mb-2 block font-mono text-[10px] tracking-[0.35em]" style={{ color: colors.cyan }}>
              {project.type}
            </span>
            <h2
              id="project-detail-title"
              className={`text-[clamp(32px,5vw,56px)] font-black leading-none text-white ${orbitron.className}`}
              style={{
                textShadow: '0 0 12px rgba(0,255,157,0.38), 0 0 28px rgba(0,255,157,0.2), 0 6px 20px rgba(0,0,0,0.55)',
              }}
            >
              {project.title}
            </h2>
          </div>
        </div>

        <div
          className="flex w-full min-h-0 flex-col bg-[rgba(7,20,16,0.98)] md:w-[480px] md:flex-shrink-0 md:border-l"
          style={{ borderColor: `rgba(${red},${green},${blue},0.28)` }}
        >
          <div className="flex h-11 items-center justify-between border-b bg-[rgba(10,31,25,0.95)] px-6" style={{ borderColor: `rgba(${red},${green},${blue},0.16)` }}>
            <div className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: colors.green }} />
            </div>
            <div className="font-mono text-[10px] tracking-[0.18em] text-white/35">
              {`~/blasz/projects/${pathName}`}
            </div>
            <button
              type="button"
              aria-label="Close project details"
              onClick={onClose}
              className="flex h-[26px] w-[26px] items-center justify-center border text-[13px] text-white/60 transition hover:text-white"
              style={{ borderColor: `rgba(${red},${green},${blue},0.22)` }}
            >
              ✕
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-7 py-8 [scrollbar-color:rgba(255,255,255,0.16)_transparent] [scrollbar-width:thin]">
            <div className="mb-7">
              <div className="mb-2 flex items-center gap-2 font-mono text-[9px] tracking-[0.36em]" style={{ color: colors.cyan }}>
                <span>// OVERVIEW</span>
                <span className="h-px flex-1 bg-white/10" />
              </div>
              <p className="text-[15px] leading-[1.75] text-white/58">{project.description}</p>
            </div>

            <div className="mb-7">
              <div className="mb-3 flex items-center gap-2 font-mono text-[9px] tracking-[0.36em]" style={{ color: colors.cyan }}>
                <span>// KEY FEATURES</span>
                <span className="h-px flex-1 bg-white/10" />
              </div>
              <div className="grid gap-2.5 sm:grid-cols-2">
                {project.features.map((feature) => (
                  <div
                    key={feature.title}
                    className="border border-t-2 bg-[rgba(10,31,25,0.95)] px-3.5 py-3.5"
                    style={{
                      borderColor: `rgba(${red},${green},${blue},0.18)`,
                      borderTopColor: `rgb(${red},${green},${blue})`,
                    }}
                  >
                    <strong className={`mb-1.5 block text-[9px] tracking-[0.2em] ${orbitron.className}`} style={{ color: colors.cyan }}>
                      {feature.title}
                    </strong>
                    <div className="text-[12px] leading-[1.5] text-white/56">{feature.text}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-7">
              <div className="mb-3 flex items-center gap-2 font-mono text-[9px] tracking-[0.36em]" style={{ color: colors.cyan }}>
                <span>// TECH STACK</span>
                <span className="h-px flex-1 bg-white/10" />
              </div>
              <div className="flex flex-wrap gap-2">
                {project.tech.map((item) => (
                  <span
                    key={item}
                    className="border bg-[rgba(10,31,25,0.95)] px-3 py-1.5 font-mono text-[10px] tracking-[0.1em] text-white/56"
                    style={{
                      borderColor: `rgba(${red},${green},${blue},0.18)`,
                    }}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <div className="mb-3 flex items-center gap-2 font-mono text-[9px] tracking-[0.36em]" style={{ color: colors.cyan }}>
                <span>// METADATA</span>
                <span className="h-px flex-1 bg-white/10" />
              </div>
              <div className="font-mono text-[11px] leading-8 text-white/38">
                <div><span className="mr-4 text-white/58">STATUS</span><span style={{ color: colors.cyan }}>{status}</span></div>
                <div><span className="mr-4 text-white/58">CATEGORY</span><span>{category}</span></div>
                <div><span className="mr-4 text-white/58">YEAR</span><span>{year}</span></div>
                <div><span className="mr-4 text-white/58">ROLE</span><span>{role}</span></div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 border-t bg-[rgba(10,31,25,0.95)] px-7 py-5" style={{ borderColor: `rgba(${red},${green},${blue},0.16)` }}>
            <a
              href={project.live}
              target="_blank"
              rel="noreferrer"
              className={`flex flex-1 items-center justify-center px-4 py-3 text-[10px] font-bold tracking-[0.28em] text-[#030d0a] transition ${orbitron.className}`}
              style={{
                background: `rgb(${red},${green},${blue})`,
                clipPath: 'polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%)',
              }}
            >
              LIVE DEMO ↗
            </a>
            <a
              href={project.repo}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center border px-5 py-3 font-mono text-[10px] tracking-[0.2em] text-white/72 transition hover:text-white"
              style={{ borderColor: `rgba(${red},${green},${blue},0.28)` }}
            >
              REPO
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}