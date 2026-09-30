import { SacredGeometry } from "./SacredGeometry";

// Deterministic pseudo-random so server and client render identical markup.
function seeded(seed: number) {
  let s = seed;
  return () => ((s = (s * 1664525 + 1013904223) % 4294967296) / 4294967296);
}

/** A curvilinear Nagara shikhara: ridged tapering tower, cornice, amalaka and kalasha. */
function Shikhara({ cx, base, h, w, cls, subs = true, ribs = true }: { cx: number; base: number; h: number; w: number; cls: string; subs?: boolean; ribs?: boolean }) {
  const yWall = base - h * 0.2;
  const yTop = base - h;
  const yBody = yTop + h * 0.1;
  const N = 40;
  const hw = (t: number) => (w / 2) * (0.06 + 0.94 * Math.pow(1 - Math.pow(t, 1.7), 0.75)) * (1 + 0.03 * Math.sin(t * 38));
  const yAt = (t: number) => yWall - (yWall - yBody) * t;
  const L: string[] = [];
  const R: string[] = [];
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    L.push(`${(cx - hw(t)).toFixed(1)} ${yAt(t).toFixed(1)}`);
    R.push(`${(cx + hw(t)).toFixed(1)} ${yAt(t).toFixed(1)}`);
  }
  const d = `M${cx - w * 0.43} ${base} L${cx - w * 0.43} ${yWall} L${L.join(" L")} L${R.reverse().join(" L")} L${cx + w * 0.43} ${yWall} L${cx + w * 0.43} ${base}Z`;
  return (
    <g>
      {subs &&
        [-1, 1].map((s) => (
          <Shikhara key={s} cx={cx + s * w * 0.4} base={yWall + h * 0.03} h={h * 0.42} w={w * 0.4} cls={cls} subs={false} ribs={false} />
        ))}
      <path d={d} className={cls} />
      <rect x={cx - w * 0.53} y={yWall - h * 0.012} width={w * 1.06} height={h * 0.024} className={cls} />
      {ribs &&
        Array.from({ length: 8 }, (_, k) => {
          const t = (k + 1) / 9;
          const y = yAt(t);
          const x = hw(t) * 0.97;
          return <path key={k} d={`M${cx - x} ${y} L${cx + x} ${y}`} className="ts-rib" />;
        })}
      <ellipse cx={cx} cy={yBody - h * 0.012} rx={w * 0.11} ry={h * 0.022} className={cls} />
      <ellipse cx={cx} cy={yTop + h * 0.045} rx={w * 0.04} ry={h * 0.035} className={cls} />
      <path d={`M${cx - 2} ${yTop + h * 0.03} L${cx} ${yTop} L${cx + 2} ${yTop + h * 0.03}Z`} className={cls} />
    </g>
  );
}

/** A domed chhatri (open pavilion on four columns). */
function Chhatri({ cx, base, s, cls }: { cx: number; base: number; s: number; cls: string }) {
  return (
    <g transform={`translate(${cx} ${base}) scale(${s})`}>
      <rect x="-52" y="-14" width="104" height="14" className="ts-dark" />
      <rect x="-38" y="-62" width="76" height="48" className="ts-void" />
      {[-34, -12, 12, 34].map((x) => (
        <rect key={x} x={x - 3.5} y="-62" width="7" height="48" className={cls} />
      ))}
      <rect x="-56" y="-72" width="112" height="10" className={cls} />
      <path d="M-42 -72 Q-46 -122 0 -134 Q46 -122 42 -72Z" className={cls} />
      <path d="M-28 -74 Q-30 -112 0 -128 M28 -74 Q30 -112 0 -128 M0 -74 L0 -130" className="ts-rib" />
      <rect x="-5" y="-142" width="10" height="9" className={cls} />
      <ellipse cx="0" cy="-146" rx="6" ry="7" className={cls} />
      <path d="M-1.5 -152 L0 -172 L1.5 -152Z" className={cls} />
    </g>
  );
}

const FAR = [
  { cx: 150, h: 150, w: 70 }, { cx: 300, h: 210, w: 96 }, { cx: 470, h: 170, w: 80 }, { cx: 640, h: 250, w: 104 },
  { cx: 770, h: 190, w: 84 }, { cx: 1120, h: 330, w: 128 }, { cx: 1290, h: 240, w: 100 }, { cx: 1420, h: 280, w: 110 },
  { cx: 1540, h: 200, w: 86 },
];

const PAD_DATA = (() => {
  const r = seeded(21);
  return Array.from({ length: 24 }, () => {
    const y = 18 + Math.pow(r(), 0.85) * 300;
    const rx = 20 + (y / 340) * 70 + r() * 16;
    return { x: r() * 1600, y, rx, ry: rx * 0.22, rot: (r() - 0.5) * 30, a0: 0.2 + r() * 0.3 };
  });
})();

const padPath = (rx: number, ry: number, a0: number) => {
  const p = (a: number) => `${(rx * Math.cos(a)).toFixed(1)} ${(ry * Math.sin(a)).toFixed(1)}`;
  return `M0 0 L${p(a0)} A${rx} ${ry} 0 1 1 ${p(-a0)}Z`;
};

const LOTUS = [
  { x: 7, y: 84, w: 5.2, d: 0 }, { x: 21, y: 75, w: 3.2, d: -2 }, { x: 45, y: 90, w: 5.6, d: -4 }, { x: 63, y: 72, w: 2.6, d: -1 },
  { x: 75, y: 85, w: 4.6, d: -3 }, { x: 90, y: 77, w: 3.6, d: -5 }, { x: 33, y: 68, w: 2.2, d: -2.5 }, { x: 55, y: 67, w: 2, d: -1.5 },
];

const PETALS = [-66, 66, -44, 44, -22, 22, 0];

function Lotus({ x, y, w, d }: { x: number; y: number; w: number; d: number }) {
  return (
    <div className="ms-lotus" style={{ left: `${x}%`, top: `${y}%`, width: `${w}%`, animationDelay: `${d}s` }}>
      <svg viewBox="0 0 120 90" fill="none">
        <ellipse cx="60" cy="80" rx="46" ry="7" fill="rgba(20,10,2,.35)" />
        {PETALS.map((a, i) => (
          <path
            key={a}
            d="M60 78 C34 70 30 38 60 8 C90 38 86 70 60 78Z"
            transform={`rotate(${a} 60 78)`}
            fill={i < 4 ? "url(#lotus-b)" : "url(#lotus-f)"}
            stroke="rgba(255,240,220,.45)"
            strokeWidth=".6"
          />
        ))}
        <ellipse cx="60" cy="64" rx="9" ry="5" fill="#ffd57a" opacity=".85" />
      </svg>
    </div>
  );
}

const BIRDS = [
  { top: 22, s: 1.0, dur: 95, delay: -10 },
  { top: 28, s: 0.7, dur: 120, delay: -55 },
  { top: 17, s: 0.85, dur: 105, delay: -80 },
  { top: 33, s: 0.6, dur: 130, delay: -30 },
];

/**
 * Golden Mist: a golden-hour ghat. Shikhara towers and domed chhatris rise from a hazy,
 * sunlit sky over a still lake with reflections and lotus. Every moving part is its own
 * compositor layer (transform / opacity only) so the scene stays alive and smooth.
 */
export function GoldenMist() {
  return (
    <div className="r-layer r-mist">
      <div className="m-base" />
      <div className="m-scene">
        <div className="ms-sky" />
        <div className="ms-rays" />
        <div className="ms-halo">
          <SacredGeometry className="spin" />
        </div>
        <div className="ms-sun" />
        {[1, 2, 3].map((k) => (
          <div key={k} className={`ms-beam b${k}`} />
        ))}
        {[1, 2, 3, 4, 5, 6, 7].map((k) => (
          <div key={k} className={`ms-cloud k${k}`} />
        ))}
        {BIRDS.map((b, i) => (
          <svg key={i} className="ms-bird" viewBox="0 0 24 10" style={{ top: `${b.top}%`, width: `${1.6 * b.s}%`, animationDuration: `${b.dur}s`, animationDelay: `${b.delay}s` }}>
            <path d="M0 6 Q6 -2 12 6 Q18 -2 24 6" fill="none" stroke="#3a2410" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        ))}

        <svg className="ms-far" viewBox="0 0 1600 560" preserveAspectRatio="none" aria-hidden>
          <defs>
            <linearGradient id="ts-far" x1="0" x2="1">
              <stop offset="0" stopColor="#f6cf8e" stopOpacity=".5" />
              <stop offset="1" stopColor="#b9803f" stopOpacity=".34" />
            </linearGradient>
            <linearGradient id="ts-far2" x1="0" x2="1">
              <stop offset="0" stopColor="#efbc72" stopOpacity=".7" />
              <stop offset="1" stopColor="#8a5a28" stopOpacity=".55" />
            </linearGradient>
            <linearGradient id="ts-mid" x1="0" x2="1">
              <stop offset="0" stopColor="#f0b866" />
              <stop offset=".45" stopColor="#9a6528" />
              <stop offset="1" stopColor="#3b2510" />
            </linearGradient>
            <linearGradient id="ts-wall" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="#7a4d20" />
              <stop offset="1" stopColor="#2a190a" />
            </linearGradient>
          </defs>
          <g id="ms-far">
            {FAR.map((f, i) => (
              <Shikhara key={i} cx={f.cx} base={548} h={f.h} w={f.w} cls="ts-far" subs={f.h > 200} ribs={false} />
            ))}
          </g>
        </svg>

        <div className="ms-mist a" />

        <svg className="ms-mid" viewBox="0 0 1600 560" preserveAspectRatio="none" aria-hidden>
          <g id="ms-mid">
            <Shikhara cx={1240} base={478} h={290} w={118} cls="ts-far2" ribs={false} />
            <Chhatri cx={1345} base={508} s={1.1} cls="ts-far2" />
            <Chhatri cx={720} base={508} s={0.85} cls="ts-far2" />
            <rect x="80" y="508" width="1460" height="52" className="ts-wall" />
            {Array.from({ length: 30 }, (_, i) => (
              <path key={i} d={`M${100 + i * 48} 512 L${100 + i * 48} 558`} className="ts-rib" />
            ))}
            {/* open hall + tall shikhara */}
            <rect x="935" y="416" width="150" height="92" className="ts-void" />
            {Array.from({ length: 6 }, (_, i) => (
              <rect key={i} x={938 + i * 28} y="416" width="8" height="92" className="ts-mid" />
            ))}
            <rect x="925" y="406" width="170" height="11" className="ts-mid" />
            <Shikhara cx={1010} base={408} h={232} w={132} cls="ts-mid" />
            {[420, 370, 320, 270, 220].map((w, i) => (
              <rect key={w} x={1010 - w / 2} y={550 - i * 9.5} width={w} height="9.5" className="ts-step" />
            ))}
            <Chhatri cx={330} base={508} s={1.2} cls="ts-mid" />
            <Chhatri cx={520} base={508} s={1.0} cls="ts-mid" />
            <Chhatri cx={1560} base={508} s={2.5} cls="ts-mid" />
          </g>
        </svg>

        <div className="ms-mist b" />

        <div className="ms-water" />
        <svg className="ms-reflect" viewBox="0 0 1600 560" preserveAspectRatio="none" aria-hidden>
          <use href="#ms-far" />
          <use href="#ms-mid" />
        </svg>
        <div className="ms-glint" />
        <div className="ms-glitter" />
        {["a", "b", "c"].map((k) => (
          <div key={k} className={`ms-streak ${k}`} />
        ))}

        <svg className="ms-pads" viewBox="0 0 1600 340" preserveAspectRatio="none" aria-hidden>
          <defs>
            <linearGradient id="pad" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0" stopColor="#a4863a" />
              <stop offset="1" stopColor="#4d3d16" />
            </linearGradient>
            <linearGradient id="lotus-b" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="#f7cfae" />
              <stop offset="1" stopColor="#c8607f" />
            </linearGradient>
            <linearGradient id="lotus-f" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="#fbdcc0" />
              <stop offset="1" stopColor="#e2809b" />
            </linearGradient>
          </defs>
          {PAD_DATA.map((p, i) => (
            <path key={i} d={padPath(p.rx, p.ry, p.a0)} transform={`translate(${p.x.toFixed(0)} ${p.y.toFixed(0)}) rotate(${p.rot.toFixed(1)})`} fill="url(#pad)" stroke="rgba(255,230,160,.4)" strokeWidth=".8" />
          ))}
        </svg>
        {LOTUS.map((l, i) => (
          <Lotus key={i} {...l} />
        ))}
        <div className="ms-mist c" />
        <div className="ms-fore" />
      </div>
      <div className="m-shade" />
      <div className="m-ambient" />
    </div>
  );
}
