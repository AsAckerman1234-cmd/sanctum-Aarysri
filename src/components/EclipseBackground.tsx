import { useMemo } from "react";

export function EclipseBackground() {
  const particles = useMemo(
    () =>
      Array.from({ length: 40 }).map((_, i) => ({
        left: Math.random() * 100,
        duration: 14 + Math.random() * 22,
        delay: -Math.random() * 30,
        size: 1 + Math.random() * 3,
        dx: (Math.random() - 0.5) * 200,
        opacity: 0.3 + Math.random() * 0.5,
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