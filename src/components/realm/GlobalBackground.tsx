import { SacredGeometry } from "./SacredGeometry";
import { useRealmTheme } from "@/lib/realm-theme";

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

const WAVE_PATHS = Array.from({ length: 9 }, (_, i) => ({
  d: `M -80 ${330 + i * 8} C 90 ${170 + i * 10}, 250 ${350 - i * 6}, 440 ${262 + i * 5}`,
  o: 0.55 - i * 0.04,
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
      <svg className="w-waves" viewBox="0 0 1200 420" preserveAspectRatio="xMidYMid slice" fill="none">
        <g className="w-wave-l">
          {WAVE_PATHS.map((p, i) => (
            <path key={i} d={p.d} stroke="var(--r-bright)" strokeWidth="0.9" opacity={p.o} />
          ))}
        </g>
        <g className="w-wave-r" transform="translate(1200 0) scale(-1 1)">
          {WAVE_PATHS.map((p, i) => (
            <path key={i} d={p.d} stroke="var(--r-bright)" strokeWidth="0.9" opacity={p.o} />
          ))}
        </g>
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
        {tiers.map((i) => {
          const rx = 560 - i * 66;
          const cy = 214 - i * 15;
          return (
            <g key={i}>
              <ellipse cx="600" cy={cy} rx={rx} ry={30 - i * 3.2} fill="url(#rw-tier)" stroke={i % 2 ? "#63E6FF" : "#F4D47C"} strokeWidth="1.4" opacity={0.95 - i * 0.05} />
            </g>
          );
        })}
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

/** Golden Mist: a warm heavenly veil, layered translucent light, faint constellations. */
export function GoldenMist() {
  const stars: [number, number][] = [[20, 40], [70, 18], [120, 60], [175, 30], [215, 78], [95, 110]];
  return (
    <div className="r-layer r-mist">
      <div className="m-base" />
      <div className="m-veil v1" />
      <div className="m-veil v2" />
      <div className="m-veil v3" />
      <div className="m-veil v4" />
      <div className="m-shaft s1" />
      <div className="m-shaft s2" />
      {[0, 1].map((k) => (
        <svg key={k} className={`m-const c${k}`} viewBox="0 0 240 140" fill="none">
          <polyline points={stars.map((s) => s.join(",")).join(" ")} stroke="var(--r-bright)" strokeWidth="0.6" opacity=".55" />
          {stars.map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={i % 2 ? 2 : 1.4} fill="var(--r-bright)" />
          ))}
        </svg>
      ))}
    </div>
  );
}

export function GlobalBackground() {
  const { theme, changes } = useRealmTheme();
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
      {changes > 0 && <div key={`${theme}-${changes}`} className="r-pulse" />}
    </div>
  );
}
