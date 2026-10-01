import { useEffect, useRef, useState } from "react";

export function Slideshow({
  images,
  interval = 3800,
  className = "",
  children,
}: {
  images: string[];
  interval?: number;
  className?: string;
  children?: React.ReactNode;
}) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(true);
  const [seen, setSeen] = useState<Set<number>>(() => new Set([0]));
  const ref = useRef<HTMLDivElement>(null);
  // Only mount the current + next image (saves bandwidth/decoding on phones).
  useEffect(() => {
    setSeen((prev) => (prev.has(i) && prev.has((i + 1) % images.length) ? prev : new Set(prev).add(i).add((i + 1) % images.length)));
  }, [i, images.length]);
  // Pause when scrolled off-screen or when the tab is hidden.
  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.05 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (paused || !inView) return;
    const t = setInterval(() => setI((v) => (v + 1) % images.length), interval);
    return () => clearInterval(t);
  }, [images.length, interval, paused, inView]);

  const go = (dir: number) => setI((v) => (v + dir + images.length) % images.length);

  return (
    <div
      ref={ref}
      className={`slide-stage group relative overflow-hidden rounded-3xl ${className}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {images.map((src, idx) => (
        <div
          key={src}
          className={`slide absolute inset-0 transition-all duration-[900ms] ease-out ${
            idx === i ? "active opacity-100 scale-100" : "opacity-0 scale-105"
          }`}
          style={{ zIndex: idx === i ? 1 : 0 }}
        >
          {(seen.has(idx) || idx === i) && <img
            src={src}
            alt=""
            decoding="async"
            loading={idx === 0 ? "eager" : "lazy"}
            className={`h-full w-full object-cover ${idx === i ? "animate-[kenburns_4.5s_ease-out_forwards]" : ""}`}
          />}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/40" />
        </div>
      ))}

      {/* moving light sheen */}
      <div className="lit-frame absolute inset-0 z-[6] pointer-events-none" />

      {children && <div className="relative z-10 h-full w-full">{children}</div>}

      {/* Prev / next */}
      <button
        onClick={() => go(-1)}
        aria-label="Previous slide"
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 h-10 w-10 grid place-items-center rounded-full bg-black/40 backdrop-blur border border-white/15 text-white/90 opacity-0 group-hover:opacity-100 transition hover:bg-black/60"
      >
        ‹
      </button>
      <button
        onClick={() => go(1)}
        aria-label="Next slide"
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 h-10 w-10 grid place-items-center rounded-full bg-black/40 backdrop-blur border border-white/15 text-white/90 opacity-0 group-hover:opacity-100 transition hover:bg-black/60"
      >
        ›
      </button>

      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setI(idx)}
            aria-label={`Slide ${idx + 1}`}
            className="h-1.5 rounded-full transition-all"
            style={{
              width: idx === i ? 32 : 10,
              background: idx === i ? "var(--accent-c)" : "rgba(255,255,255,0.35)",
              boxShadow: idx === i ? "0 0 14px var(--accent-c)" : "none",
            }}
          />
        ))}
      </div>
    </div>
  );
}

export function TextSlideshow({ words, interval = 2400 }: { words: string[]; interval?: number }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % words.length), interval);
    return () => clearInterval(t);
  }, [words.length, interval]);
  return (
    <div className="h-32 grid place-items-center">
      <div key={i} className="gold-text font-serif text-5xl sm:text-7xl tracking-widest animate-in fade-in zoom-in duration-700">
        {words[i]}
      </div>
    </div>
  );
}