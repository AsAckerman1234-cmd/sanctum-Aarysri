import ghat from "../../assets/realm/ghat.webp";
// Deterministic pseudo-random so server and client render identical markup.
function seeded(seed: number) {
  let s = seed;
  return () => ((s = (s * 1664525 + 1013904223) % 4294967296) / 4294967296);
}

/** A curvilinear Nagara shikhara: ridged tapering tower, cornice, amalaka and kalasha. */
export function Shikhara({ cx, base, h, w, cls, subs = true, ribs = true }: { cx: number; base: number; h: number; w: number; cls: string; subs?: boolean; ribs?: boolean }) {
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
export function Chhatri({ cx, base, s, cls }: { cx: number; base: number; s: number; cls: string }) {
  return (
    <g transform={`translate(${cx} ${base}) scale(${s})`}>
      <rect x="-52" y="-14" width="104" height="14" className="ts-dark" />
      <rect x="-38" y="-62" width="76" height="48" className="ts-void" />
      {[-34, -12, 12, 34].map((x) => (
        <rect key={x} x={x - 3.5} y="-62" width="7" height="48" className={cls} />
      ))}
      <rect x="-56" y="-72" width="112" height="10" className={cls} />
      <path d="M-42 -72 Q-46 -122 0 -134 Q46 -122 42 -72Z" className={cls} />
      <path d="M-28 -74 Q-30 -112 0 -128 M28 -74 Q30 -112 0 -128 M0 -74 L0 -130 M-32 -14 V-46 A9 9 0 0 1 -14 -46 V-14 M-9 -14 V-46 A9 9 0 0 1 9 -46 V-14 M14 -14 V-46 A9 9 0 0 1 32 -46 V-14" className="ts-rib" />
      <rect x="-5" y="-142" width="10" height="9" className={cls} />
      <ellipse cx="0" cy="-146" rx="6" ry="7" className={cls} />
      <path d="M-1.5 -152 L0 -172 L1.5 -152Z" className={cls} />
    </g>
  );
}

export const PAD_DATA = (() => {
  const r = seeded(21);
  return Array.from({ length: 24 }, () => {
    const y = 18 + Math.pow(r(), 0.85) * 300;
    const rx = 20 + (y / 340) * 70 + r() * 16;
    return { x: r() * 1600, y, rx, ry: rx * 0.22, rot: (r() - 0.5) * 30, a0: 0.2 + r() * 0.3 };
  });
})();

export const padPath = (rx: number, ry: number, a0: number) => {
  const p = (a: number) => `${(rx * Math.cos(a)).toFixed(1)} ${(ry * Math.sin(a)).toFixed(1)}`;
  return `M0 0 L${p(a0)} A${rx} ${ry} 0 1 1 ${p(-a0)}Z`;
};

const PETALS = [-66, 66, -44, 44, -22, 22, 0];

export function Lotus({ x, y, w, d, gb = "lotus-b", gf = "lotus-f", cls = "" }: { x: number; y: number; w: number; d: number; gb?: string; gf?: string; cls?: string }) {
  return (
    <div className={`ms-lotus ${cls}`} style={{ left: `${x}%`, top: `${y}%`, width: `${w}%`, animationDelay: `${d}s` }}>
      <svg viewBox="0 0 120 90" fill="none">
        <ellipse cx="60" cy="80" rx="46" ry="7" fill="rgba(20,10,2,.35)" />
        {PETALS.map((a, i) => (
          <path
            key={a}
            d="M60 78 C34 70 30 38 60 8 C90 38 86 70 60 78Z"
            transform={`rotate(${a} 60 78)`}
            fill={i < 4 ? `url(#${gb})` : `url(#${gf})`}
            stroke="rgba(255,240,220,.45)"
            strokeWidth=".6"
          />
        ))}
        <ellipse cx="60" cy="64" rx="9" ry="5" fill="#ffd57a" opacity=".85" />
      </svg>
    </div>
  );
}


/* =====================================================================
   GOLDEN MIST — "Crystal Sanctum"
   A white-stone palace of iridescent domes and glowing amber crystals, set among
   mossy cliffs, waterfalls and a luminous path, lit through drifting golden mist.
   Static art lives in two SVG layers (rasterised once). Only four cheap layers move:
   fog (transform), waterfalls (transform), halos + aurora + moss glow (opacity).
   ===================================================================== */

/* ---------- Golden Mist: Ghat of Lamps ---------- */
type Dot = { x: number; y: number; s: number; dur: number; delay: number; dx: number };
function dots(seed: number, n: number, x0: number, xw: number, y0: number, yh: number, s0: number, sw: number, d0: number, dw: number): Dot[] {
  const r = seeded(seed);
  return Array.from({ length: n }, () => ({
    x: x0 + r() * xw,
    y: y0 + r() * yh,
    s: s0 + r() * sw,
    dur: d0 + r() * dw,
    delay: -r() * 30,
    dx: (r() - 0.5) * 60,
  }));
}
// positions are % of the painting
const DIYAS = dots(11, 36, 9, 70, 57, 9, 3, 3.6, 2.4, 3.2); //   lamps along the ghat steps
const WINDOWS = dots(23, 15, 11, 30, 27, 27, 20, 16, 4, 5); //     glowing windows of the temples
const LANTERNS = dots(37, 14, 14, 56, 12, 28, 6, 5, 18, 16); //    lanterns floating up the sky
const SPARKS = dots(53, 42, 7, 86, 72, 26, 2, 2.2, 2.2, 3.4); //   glitter on the river

const lamp = (d: Dot, i: number, extra = "") => (
  <i
    key={i}
    className={`gh-dot ${extra}`}
    style={{
      left: `${d.x}%`,
      top: `${d.y}%`,
      width: d.s,
      height: d.s,
      animationDuration: `${d.dur}s`,
      animationDelay: `${d.delay}s`,
      ["--dx" as string]: `${d.dx}px`,
    }}
  />
);

const STREAKS = [29, 33, 38, 42, 46, 51, 56, 61];

export function GoldenMist() {
  return (
    <div className="r-layer r-mist">
      {/* wide screens: the same painting, blurred, so the glow continues past the edges */}
      <img className="gh-back" src={ghat} alt="" aria-hidden />
      <div className="gh-tint" />

      <div className="gh-stage">
        <img className="gh-img" src={ghat} alt="" width={735} height={976} decoding="async" />
        <div className="gh-bloom a" />
        <div className="gh-bloom b" />
        <div className="gh-mist high" />

        <div className="gh-group windows">{WINDOWS.map((d, i) => lamp(d, i, "win"))}</div>
        <div className="gh-group lanterns">{LANTERNS.map((d, i) => lamp(d, i, "lan"))}</div>
        <div className="gh-group diyas">{DIYAS.map((d, i) => lamp(d, i, "diya"))}</div>

        <div className="gh-mist low" />

        {/* the river: shimmering reflections, glitter, ripples around the boat, mist flowing across the water */}
        <div className="gh-group streaks">
          {STREAKS.map((x, i) => (
            <b key={x} className="gh-streak" style={{ left: `${x}%`, height: `${12 + (i % 4) * 4}%`, animationDelay: `${-i * 0.9}s` }} />
          ))}
        </div>
        <div className="gh-group sparks">{SPARKS.map((d, i) => lamp(d, i, "spk"))}</div>
        <i className="gh-boatglow" />
        <i className="gh-ripple" />
        <i className="gh-ripple" style={{ animationDelay: "-2s" }} />
        <i className="gh-ripple" style={{ animationDelay: "-4s" }} />
        <div className="gh-mist river" />
        <div className="gh-mist river r2" />
      </div>

      {/* golden fog over the whole screen */}
      <div className="gh-fog a" />
      <div className="gh-fog b" />
      <div className="gh-dim" />
    </div>
  );
}
