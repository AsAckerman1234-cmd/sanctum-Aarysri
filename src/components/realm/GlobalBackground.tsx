import { SacredGeometry } from "./SacredGeometry";
import { GoldenMist, Shikhara, Chhatri, Lotus, PAD_DATA, padPath } from "./MistScene";

// Deterministic pseudo-random so server and client render identical markup.
function seeded(seed: number) {
  let s = seed;
  return () => ((s = (s * 1664525 + 1013904223) % 4294967296) / 4294967296);
}

const PARTICLES = (() => {
  const r = seeded(7);
  return Array.from({ length: 26 }, () => ({
    left: r() * 100,
    bottom: r() * 46,
    size: 1.4 + r() * 2.4,
    dur: 24 + r() * 26,
    delay: -r() * 40,
    dx: (r() - 0.5) * 120,
    op: 0.35 + r() * 0.5,
  }));
})();

export function CelestialParticles() {
  return (
    <div className="r-particles">
      {PARTICLES.map((p, i) => (
        <span
          key={i}
          className="r-particle"
          style={{
            left: `${p.left}%`,
            bottom: `${p.bottom}%`,
            width: p.size,
            height: p.size,
            animationDuration: `${p.dur}s`,
            animationDelay: `${p.delay}s`,
            opacity: p.op,
            ["--dx" as string]: `${p.dx}px`,
          }}
        />
      ))}
    </div>
  );
}

type RibbonPath = { d: string; o: number };

/** Two mirrored drifting ribbons. Each is its own layer, so it moves on the GPU. */
function Ribbons({ paths }: { paths: RibbonPath[] }) {
  return (
    <>
      {(["l", "r"] as const).map((side) => (
        <div key={side} className={`r-ribbon ${side}`}>
          <svg viewBox="0 0 600 420" preserveAspectRatio="xMidYMid slice" fill="none">
            {paths.map((p, i) => (
              <path key={i} d={p.d} stroke="var(--r-bright)" strokeWidth="0.9" opacity={p.o} />
            ))}
          </svg>
        </div>
      ))}
    </>
  );
}

const WATER_RIBBONS: RibbonPath[] = Array.from({ length: 9 }, (_, i) => ({
  d: `M -80 ${330 + i * 8} C 90 ${170 + i * 10}, 250 ${350 - i * 6}, 440 ${262 + i * 5}`,
  o: 0.55 - i * 0.04,
}));

/** A classical stone column: base, fluted shaft, capital and abacus. */
function Column({ cx, base, h, w = 18 }: { cx: number; base: number; h: number; w?: number }) {
  const top = base - h;
  return (
    <g>
      <rect x={cx - w * 0.95} y={base - 10} width={w * 1.9} height="10" className="wt-stone" />
      <rect x={cx - w / 2} y={top + 16} width={w} height={h - 26} className="wt-stone" />
      {[-0.22, 0.22].map((f) => (
        <path key={f} d={`M${cx + w * f} ${top + 20} V${base - 12}`} className="ts-rib" />
      ))}
      <rect x={cx - w * 0.8} y={top + 9} width={w * 1.6} height="8" className="wt-stone" />
      <path d={`M${cx - w * 1.15} ${top + 9} Q${cx} ${top - 5} ${cx + w * 1.15} ${top + 9}Z`} className="wt-stone" />
      <rect x={cx - w * 1.25} y={top} width={w * 2.5} height="6" className="wt-stone" />
    </g>
  );
}

const WATER_PADS = PAD_DATA.slice(0, 16);
const WATER_LOTUS = [
  { x: 9, y: 66, w: 5, d: 0 }, { x: 24, y: 40, w: 3, d: -2 }, { x: 47, y: 78, w: 5.2, d: -4 },
  { x: 71, y: 52, w: 3.4, d: -1 }, { x: 86, y: 74, w: 4.6, d: -3 }, { x: 60, y: 30, w: 2.4, d: -2.5 },
];

function WaterTemples() {
  return (
    <g id="wt-all">
      {[false, true].map((m) => (
        <g key={String(m)} transform={m ? "translate(1600 0) scale(-1 1)" : undefined}>
          <Chhatri cx={90} base={380} s={1.05} cls="wt-stone" />
          <Shikhara cx={250} base={380} h={262} w={112} cls="wt-stone" />
          <Shikhara cx={430} base={380} h={178} w={86} cls="wt-stone" ribs={false} />
          <Chhatri cx={560} base={380} s={0.8} cls="wt-stone" />
          <Column cx={550} base={380} h={150} w={14} />
          <Column cx={470} base={380} h={196} w={17} />
        </g>
      ))}
      <rect x="0" y="372" width="1600" height="8" className="wt-stone" />
    </g>
  );
}

/** Golden Water: dark celestial ocean, glowing tiers, pillars of light, golden ribbons. */
export function WaterReflection() {
  const tiers = Array.from({ length: 8 }, (_, i) => i);
  return (
    <div className="r-layer r-water">
      <div className="w-sky" />
      <div className="w-nebula" />
      <div className="w-stars" />
      <div className="w-stars s2" />
      <div className="w-beam" />
      <div className="w-pillars">
        {[33, 36.5, 40, 60, 63.5, 67].map((l, i) => (
          <span key={i} style={{ left: `${l}%`, animationDelay: `${-i * 1.3}s`, height: `${38 + (i % 3) * 6}vh` }} />
        ))}
      </div>
      <Ribbons paths={WATER_RIBBONS} />
      <svg className="w-temples" viewBox="0 0 1600 380" fill="none" preserveAspectRatio="xMidYMax meet">
        <defs>
          <linearGradient id="wt-body" x1="0" x2="1">
            <stop offset="0" stopColor="#081a30" />
            <stop offset=".6" stopColor="#123a5c" />
            <stop offset="1" stopColor="#2a6a8a" />
          </linearGradient>
        </defs>
        <WaterTemples />
      </svg>
      <svg className="w-temples-ref" viewBox="0 0 1600 380" fill="none" preserveAspectRatio="xMidYMax meet">
        <use href="#wt-all" />
      </svg>
      <svg className="w-stairs" viewBox="0 0 1200 260" fill="none">
        <defs>
          <linearGradient id="rw-tier" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#0f3350" />
            <stop offset="1" stopColor="#050812" />
          </linearGradient>
          <radialGradient id="rw-core" cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor="#ffffff" stopOpacity=".95" />
            <stop offset=".35" stopColor="#63E6FF" stopOpacity=".5" />
            <stop offset="1" stopColor="#63E6FF" stopOpacity="0" />
          </radialGradient>
        </defs>
        <g id="rw-stairs">
          {tiers.map((i) => (
            <ellipse
              key={i}
              cx="600"
              cy={214 - i * 14}
              rx={560 - i * 62}
              ry={30 - i * 3.1}
              fill="url(#rw-tier)"
              stroke={i % 2 ? "#63E6FF" : "#F4D47C"}
              strokeWidth="1.4"
              opacity={0.95 - i * 0.05}
            />
          ))}
          {tiers.map((i) => (
            <ellipse key={`h${i}`} cx="600" cy={212.5 - i * 14} rx={556 - i * 62} ry={28 - i * 3.1} fill="none" stroke="#fff" strokeOpacity=".22" strokeWidth=".7" />
          ))}
          <ellipse cx="600" cy="112" rx="120" ry="34" fill="url(#rw-core)" />
        </g>
      </svg>
      <svg className="w-stairs-ref" viewBox="0 0 1200 260" fill="none">
        <use href="#rw-stairs" />
      </svg>
      <div className="w-floor">
        <svg className="w-pads" viewBox="0 0 1600 340" preserveAspectRatio="xMidYMax slice" aria-hidden>
          <defs>
            <linearGradient id="pad-w" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0" stopColor="#134a5a" />
              <stop offset="1" stopColor="#06202c" />
            </linearGradient>
            <linearGradient id="wl-b" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="#d9ecff" />
              <stop offset="1" stopColor="#6f9fd6" />
            </linearGradient>
            <linearGradient id="wl-f" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="#f6fbff" />
              <stop offset="1" stopColor="#a9d0f0" />
            </linearGradient>
          </defs>
          {WATER_PADS.map((p, i) => (
            <path key={i} d={padPath(p.rx, p.ry, p.a0)} transform={`translate(${p.x.toFixed(0)} ${p.y.toFixed(0)}) rotate(${p.rot.toFixed(1)})`} fill="url(#pad-w)" stroke="rgba(244,212,124,.5)" strokeWidth=".8" />
          ))}
        </svg>
        {WATER_LOTUS.map((l, i) => (
          <Lotus key={i} {...l} gb="wl-b" gf="wl-f" cls="wl" />
        ))}
        <div className="w-grid" />
        <div className="w-shimmer" />
        <div className="w-glint" />
        <div className="w-sparks" />
        <div className="w-ring">
          <SacredGeometry className="spin" />
        </div>
        <i className="w-ripple" />
        <i className="w-ripple" style={{ animationDelay: "-3s" }} />
        <i className="w-ripple" style={{ animationDelay: "-6s" }} />
      </div>
    </div>
  );
}

export function GlobalBackground() {
  return (
    <div className="r-env" aria-hidden>
      <WaterReflection />
      <GoldenMist />
      <div className="r-geo">
        <SacredGeometry className="spin" />
      </div>
      <div className="r-geo r-geo-2">
        <SacredGeometry className="spin-rev" variant="mini" />
      </div>
      <CelestialParticles />
      <div className="r-vignette" />
      <div className="r-grain" />
      <div className="r-cursor" />
    </div>
  );
}
