import { SacredGeometry } from "./SacredGeometry";

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
const MIST_RIBBONS: RibbonPath[] = Array.from({ length: 8 }, (_, i) => ({
  d: `M -80 ${350 + i * 7} C 80 ${270 - i * 8}, 250 ${150 + i * 10}, 470 ${80 + i * 7}`,
  o: 0.42 - i * 0.035,
}));

/** Golden Water: dark celestial ocean, glowing tiers, pillars of light, golden ribbons. */
export function WaterReflection() {
  const tiers = Array.from({ length: 7 }, (_, i) => i);
  return (
    <div className="r-layer r-water">
      <div className="w-sky" />
      <div className="w-stars" />
      <div className="w-beam" />
      <div className="w-pillars">
        {[33, 36.5, 40, 60, 63.5, 67].map((l, i) => (
          <span key={i} style={{ left: `${l}%`, animationDelay: `${-i * 1.3}s`, height: `${38 + (i % 3) * 6}vh` }} />
        ))}
      </div>
      <Ribbons paths={WATER_RIBBONS} />
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
              cy={214 - i * 15}
              rx={560 - i * 66}
              ry={30 - i * 3.2}
              fill="url(#rw-tier)"
              stroke={i % 2 ? "#63E6FF" : "#F4D47C"}
              strokeWidth="1.4"
              opacity={0.95 - i * 0.05}
            />
          ))}
          <ellipse cx="600" cy="112" rx="120" ry="34" fill="url(#rw-core)" />
        </g>
      </svg>
      <svg className="w-stairs-ref" viewBox="0 0 1200 260" fill="none">
        <use href="#rw-stairs" />
      </svg>
      <div className="w-floor">
        <div className="w-grid" />
        <div className="w-glint" />
        <div className="w-sparks" />
        <i className="w-ripple" />
        <i className="w-ripple" style={{ animationDelay: "-3s" }} />
        <i className="w-ripple" style={{ animationDelay: "-6s" }} />
      </div>
    </div>
  );
}

/* ---------- Golden Mist scene: a stepped celestial temple rising out of the mist ---------- */

const stack = (cx: number, ws: number[], hs: number[], base = 478) => {
  let y = base;
  return ws.map((w, i) => {
    y -= hs[i];
    return { x: cx - w / 2, y, w, h: hs[i] };
  });
};

function Tiers({ tiers, windows = true }: { tiers: ReturnType<typeof stack>; windows?: boolean }) {
  return (
    <>
      {tiers.map((t, i) => (
        <g key={i}>
          <rect x={t.x} y={t.y} width={t.w} height={t.h} className="mt-body" />
          <rect x={t.x - 8} y={t.y - 4} width={t.w + 16} height="5" className="mt-ledge" />
          {windows &&
            i > 0 &&
            [-1, 0, 1].map((k) => (
              <rect key={k} x={t.x + t.w / 2 + (k * t.w) / 4 - 4} y={t.y + t.h / 2 - 7} width="8" height="14" rx="4" className="mt-win" />
            ))}
        </g>
      ))}
    </>
  );
}

const Spire = ({ cx, top, h }: { cx: number; top: number; h: number }) => (
  <>
    <path d={`M${cx - 14} ${top} Q${cx} ${top - h * 0.5} ${cx} ${top - h} Q${cx} ${top - h * 0.5} ${cx + 14} ${top}Z`} className="mt-body" />
    <circle cx={cx} cy={top - h - 3} r="4" className="mt-bead" />
  </>
);

const MAIN = stack(500, [300, 262, 226, 192, 160, 130], [72, 40, 38, 36, 34, 32]);
const MAIN_TOP = MAIN[MAIN.length - 1].y;
const SIDE = stack(190, [120, 100, 82, 64, 48], [46, 38, 34, 30, 28]);
const OUTER = stack(72, [72, 56, 42], [40, 34, 30]);

const SKYLINE = (() => {
  const r = seeded(11);
  return Array.from({ length: 22 }, (_, i) => {
    const x = 40 + i * 72 + r() * 30;
    const centre = 1 - Math.min(1, Math.abs(x - 800) / 420);
    return { x, w: 16 + r() * 20, h: 70 + r() * 120 - centre * 40 };
  });
})();

const MIST_COLS = [30, 35, 41, 59, 65, 70];

export function GoldenMist() {
  return (
    <div className="r-layer r-mist">
      <div className="m-base" />
      <div className="m-halo" />
      <div className="m-rays" />
      <svg className="m-far" viewBox="0 0 1600 300" preserveAspectRatio="xMidYMax slice" aria-hidden>
        {SKYLINE.map((s, i) => (
          <path
            key={i}
            d={`M${s.x - s.w} 300 L${s.x - s.w * 0.4} ${300 - s.h * 0.7} L${s.x} ${300 - s.h} L${s.x + s.w * 0.4} ${300 - s.h * 0.7} L${s.x + s.w} 300Z`}
          />
        ))}
      </svg>
      <div className="m-veil v1" />
      <div className="m-veil v2" />
      <div className="m-bank b1" />
      <div className="m-shaft s1" />
      <div className="m-shaft s2" />
      <div className="m-cols">
        {MIST_COLS.map((l, i) => (
          <span key={i} style={{ left: `${l}%`, animationDelay: `${-i * 1.7}s` }} />
        ))}
      </div>
      <Ribbons paths={MIST_RIBBONS} />
      {[0, 1].map((k) => (
        <svg key={k} className={`m-const c${k}`} viewBox="0 0 240 140" fill="none">
          <polyline points="20,40 70,18 120,60 175,30 215,78 95,110" stroke="var(--r-bright)" strokeWidth="0.6" opacity=".55" />
          {[[20, 40], [70, 18], [120, 60], [175, 30], [215, 78], [95, 110]].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={i % 2 ? 2 : 1.4} fill="var(--r-bright)" />
          ))}
        </svg>
      ))}
      <div className="m-floor" />
      <div className="m-floor-mandala">
        <SacredGeometry className="spin" />
      </div>
      <svg className="m-temple" viewBox="0 90 1000 470" fill="none">
        <defs>
          <linearGradient id="mt-body" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#4a3618" />
            <stop offset="1" stopColor="#15100a" />
          </linearGradient>
          <linearGradient id="mt-door" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#FFF8E7" />
            <stop offset=".6" stopColor="#FFE7A6" />
            <stop offset="1" stopColor="#C9A85C" />
          </linearGradient>
          <linearGradient id="mt-spill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#FFE7A6" stopOpacity=".7" />
            <stop offset="1" stopColor="#FFE7A6" stopOpacity="0" />
          </linearGradient>
        </defs>
        <g id="mt-temple">
          <g opacity=".55">
            <Tiers tiers={OUTER} windows={false} />
            <Spire cx={72} top={OUTER[OUTER.length - 1].y} h={40} />
            <g transform="translate(1000 0) scale(-1 1)">
              <Tiers tiers={OUTER} windows={false} />
              <Spire cx={72} top={OUTER[OUTER.length - 1].y} h={40} />
            </g>
          </g>
          {[false, true].map((mirror) => (
            <g key={String(mirror)} transform={mirror ? "translate(1000 0) scale(-1 1)" : undefined}>
              <Tiers tiers={SIDE} />
              <Spire cx={190} top={SIDE[SIDE.length - 1].y} h={54} />
            </g>
          ))}
          <Tiers tiers={MAIN} />
          <ellipse cx="500" cy={MAIN_TOP - 10} rx="38" ry="26" className="mt-body" />
          <path d={`M494 ${MAIN_TOP - 34} L500 ${MAIN_TOP - 96} L506 ${MAIN_TOP - 34}Z`} className="mt-body" />
          <circle cx="500" cy={MAIN_TOP - 100} r="6" className="mt-bead" />
          <path d="M474 478 v-42 a26 26 0 0 1 52 0 v42z" className="mt-door" />
          {[
            [250, 516, 500, 24],
            [290, 496, 420, 20],
            [330, 478, 340, 18],
          ].map(([x, y, w, h], i) => (
            <rect key={i} x={x} y={y} width={w} height={h} className="mt-step" />
          ))}
          <path d="M470 478 L530 478 L600 540 L400 540 Z" fill="url(#mt-spill)" />
        </g>
      </svg>
      <svg className="m-temple-ref" viewBox="0 90 1000 470" fill="none">
        <use href="#mt-temple" />
      </svg>
      <div className="m-bank b2" />
      <div className="m-veil v3" />
      <div className="m-bank b3" />
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
      <div className="r-cursor" />
    </div>
  );
}
