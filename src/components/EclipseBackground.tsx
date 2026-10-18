import { useMemo } from "react";

// Deterministic pseudo-random: server and client render identical markup (no hydration mismatch).
function seeded(seed: number) {
  let s = seed;
  return () => ((s = (s * 1664525 + 1013904223) % 4294967296) / 4294967296);
}
const r = seeded(11);

export function EclipseBackground() {
  const particles = useMemo(
    () =>
      Array.from({ length: 24 }).map(() => ({
        left: r() * 100,
        duration: 14 + r() * 22,
        delay: -r() * 30,
        size: 1 + r() * 3,
        dx: (r() - 0.5) * 200,
        opacity: 0.3 + r() * 0.5,
      })),
    [],
  );
  return (
    <div className="eclipse-scene" aria-hidden>
      <div className="fog" />
      <div className="eclipse-rays" />
      <div className="mandala" />
      <div className="eclipse-orb" />
      <div className="particles">
        {particles.map((p, i) => (
          <span
            key={i}
            className="particle"
            style={{
              left: `${p.left}%`,
              width: p.size,
              height: p.size,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
              opacity: p.opacity,
              // @ts-expect-error css var
              "--dx": `${p.dx}px`,
            }}
          />
        ))}
      </div>
    </div>
  );
}