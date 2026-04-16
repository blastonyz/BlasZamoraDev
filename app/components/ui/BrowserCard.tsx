'use client';

import type { Project3DItem } from './types';

export default function BrowserCard({ title, image, url, colorCard, disableShadow = false }: Project3DItem & { disableShadow?: boolean }) {
  const [r, g, b] = colorCard;

  return (
    <div
      className="h-full w-full select-none overflow-hidden rounded-xl"
      style={{
        background: 'rgba(10,10,16,0.9)',
        border: `1.5px solid rgba(${r},${g},${b},0.55)`,
        boxShadow: disableShadow ? 'none' : `0 0 28px rgba(${r},${g},${b},0.18), 0 32px 64px rgba(0,0,0,0.6)`,
      }}
    >
      <div
        className="flex items-end justify-between px-2 pt-2"
        style={{
          background: 'rgba(6,6,12,0.98)',
          borderBottom: `1px solid rgba(${r},${g},${b},0.15)`,
        }}
      >
        <div
          className="flex items-center gap-1.5 rounded-t-lg px-3 py-1 text-[10px] text-white/80"
          style={{ background: `rgba(${r},${g},${b},0.14)` }}
        >
          <div className="h-2.5 w-2.5 flex-shrink-0 rounded-full" style={{ background: `rgba(${r},${g},${b},0.9)` }} />
          <span className="max-w-[90px] truncate font-mono font-semibold tracking-tight">{title}</span>
          <span className="ml-0.5 text-[9px] text-white/25">✕</span>
        </div>

        <div className="flex items-center gap-1 pb-1.5 pr-1.5">
          <div className="h-2.5 w-2.5 rounded-full" style={{ background: '#ff5f57' }} />
          <div className="h-2.5 w-2.5 rounded-full" style={{ background: '#ffbd2e' }} />
          <div className="h-2.5 w-2.5 rounded-full" style={{ background: '#27c93f' }} />
        </div>
      </div>

      <div
        className="flex items-center gap-1.5 px-2 py-1.5"
        style={{
          background: 'rgba(4,4,8,0.98)',
          borderBottom: `1px solid rgba(${r},${g},${b},0.08)`,
        }}
      >
        <button className="text-xs leading-none text-white/25">←</button>
        <button disabled className="text-xs leading-none text-white/12 opacity-30">→</button>
        <div className="flex flex-1 items-center gap-1 rounded-full px-2.5 py-0.5" style={{ background: 'rgba(255,255,255,0.06)' }}>
          <span className="text-[8px] leading-none" style={{ color: `rgba(${r},${g},${b},0.8)` }}>
            🔒
          </span>
          <span className="overflow-hidden whitespace-nowrap font-mono text-[9px] text-white/50">{url}</span>
        </div>
        <button className="text-xs leading-none text-white/20">⋮</button>
        <button className="text-[11px] leading-none" style={{ color: `rgba(${r},${g},${b},0.65)` }}>
          ✰
        </button>
      </div>

      <div className="h-[calc(100%_-_57px)] overflow-hidden" style={{ background: 'rgba(0,0,0,0.5)' }}>
        <img src={image} alt={title} className="h-full w-full object-cover object-top" draggable={false} />
      </div>
    </div>
  );
}
