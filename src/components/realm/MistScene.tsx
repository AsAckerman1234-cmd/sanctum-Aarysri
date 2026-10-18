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
const rnd = seeded(2027);

function Defs({ p }: { p: string }) {
  const g = (id: string, stops: [number, string, number?][], o: Record<string, string | number> = {}) => (
    <linearGradient id={`${p}${id}`} x1="0" x2="0" y1="0" y2="1" {...o}>
      {stops.map(([off, c, a], k) => (
        <stop key={k} offset={off} stopColor={c} stopOpacity={a ?? 1} />
      ))}
    </linearGradient>
  );
  return (
    <defs>
      {g("stone", [[0, "#fffaf0"], [0.55, "#efe6df"], [1, "#b8adc6"]], { x2: 1, y2: 0 })}
      {g("stoneV", [[0, "#fff7e6"], [1, "#c6bccf"]])}
      {g("dome", [[0, "#ffd3ea"], [0.35, "#fff0c4"], [0.7, "#bff2e6"], [1, "#e0c4ff"]], { x2: 1, y2: 1 })}
      {g("cA", [[0, "#fff6dc"], [0.5, "#ffe19a"], [1, "#ffa83c"]])}
      {g("cB", [[0, "#ffd27a"], [0.55, "#f29a2a"], [1, "#c8620f"]])}
      {g("fall", [[0, "#ffffff", 0.95], [0.6, "#e4f4ff", 0.55], [1, "#ffffff", 0]])}
      {g("rock", [[0, "#10241a"], [0.6, "#173a26"], [1, "#0b1a12"]], { x2: 1, y2: 0 })}
      {g("rockR", [[0, "#173a26"], [0.6, "#10241a"], [1, "#0b1a12"]], { x2: 1, y2: 0 })}
      {g("rockV", [[0, "#183c28"], [1, "#09150e"]])}
      {g("path", [[0, "#fff4d8"], [0.5, "#ffd9ec"], [1, "#bfeadf"]], { x2: 1, y2: 0 })}
      {g("side", [[0, "#8f86a6"], [1, "#3b3550"]])}
      {g("far", [[0, "#9bb9ad", 0.55], [1, "#32514a", 0.35]])}
      <radialGradient id={`${p}win`}>
        <stop offset="0" stopColor="#fff6cc" />
        <stop offset="1" stopColor="#ffc15e" />
      </radialGradient>
      <radialGradient id={`${p}moss`}>
        <stop offset="0" stopColor="#b9ffa8" stopOpacity="0.9" />
        <stop offset="1" stopColor="#59ff8a" stopOpacity="0" />
      </radialGradient>
    </defs>
  );
}

/** One hexagonal-prism crystal: light left facet, deep amber right facet, bright edge. */
function Crystal({ p, x, y, w, h, t = 0 }: { p: string; x: number; y: number; w: number; h: number; t?: number }) {
  const l = x - w / 2, r = x + w / 2, sh = y - h * 0.72, tx = x + t;
  return (
    <g>
      <path d={`M${l} ${y}V${sh}L${tx} ${y - h}V${y}Z`} fill={`url(#${p}cA)`} />
      <path d={`M${tx} ${y}V${y - h}L${r} ${sh}V${y}Z`} fill={`url(#${p}cB)`} />
      <path d={`M${tx} ${y - h}V${y}`} stroke="#fffbe8" strokeOpacity=".75" strokeWidth="1.4" />
    </g>
  );
}
type CS = [number, number, number, number][]; // dx, width, height, tilt
function Cluster({ p, x, y, s = 1, items }: { p: string; x: number; y: number; s?: number; items: CS }) {
  return (
    <g>
      {items.map(([dx, w, h, t], i) => (
        <Crystal key={i} p={p} x={x + dx * s} y={y} w={w * s} h={h * s} t={t * s} />
      ))}
    </g>
  );
}
const CROWN: CS = [[-62, 26, 120, -8], [-40, 30, 168, -6], [-14, 36, 214, 2], [12, 34, 190, 4], [38, 28, 150, 8], [60, 24, 104, 10], [-4, 22, 96, -10]];
const BIG_L: CS = [[0, 70, 300, -14], [52, 48, 190, 8], [-46, 40, 150, -10], [28, 36, 110, 14]];
const BIG_R: CS = [[0, 54, 190, 10], [-44, 38, 120, -6], [40, 34, 100, 12]];
const SMALL: CS = [[0, 20, 64, -3], [16, 16, 44, 4], [-14, 14, 36, -4]];

/** Domed pavilion: drum with glowing arched windows, iridescent dome, finial. */
function Pavilion({ p, cx, base, w, open = false }: { p: string; cx: number; base: number; w: number; open?: boolean }) {
  const l = cx - w / 2, r = cx + w / 2, dh = w * 0.42, dr = w * 0.34, top = base - dr, n = Math.max(3, Math.round(w / 34));
  const aw = (w / n) * 0.52;
  return (
    <g>
      <rect x={l - 6} y={base - 4} width={w + 12} height="8" fill={`url(#${p}stone)`} />
      <rect x={l} y={top} width={w} height={dr} fill={`url(#${p}stoneV)`} />
      {Array.from({ length: n }, (_, i) => {
        const ax = l + (i + 0.5) * (w / n) - aw / 2;
        return <path key={i} d={`M${ax} ${base - 2}V${top + 16 + aw / 2}A${aw / 2} ${aw / 2} 0 0 1 ${ax + aw} ${top + 16 + aw / 2}V${base - 2}Z`} fill={`url(#${p}win)`} opacity={open ? 1 : 0.92} />;
      })}
      {open && Array.from({ length: n + 1 }, (_, i) => <rect key={i} x={l + i * (w / n) - 2.5} y={top} width="5" height={dr} fill={`url(#${p}stone)`} />)}
      <rect x={l - 8} y={top - 8} width={w + 16} height="9" fill={`url(#${p}stone)`} />
      <path d={`M${l} ${top - 8}A${w / 2} ${dh} 0 0 1 ${r} ${top - 8}Z`} fill={`url(#${p}dome)`} />
      <path d={`M${cx - w * 0.3} ${top - 8 - dh * 0.55}Q${cx - w * 0.2} ${top - 8 - dh * 0.92} ${cx} ${top - 8 - dh * 0.97}`} stroke="#fff" strokeOpacity=".7" strokeWidth="3" fill="none" strokeLinecap="round" />
      <rect x={cx - 2.5} y={top - 8 - dh - 18} width="5" height="20" fill="#f6d77c" />
    </g>
  );
}

/** A robed monk seen from behind, walking. */
function Monk({ x, y, h }: { x: number; y: number; h: number }) {
  const w = h * 0.44;
  return (
    <g>
      <path d={`M${x - w / 2} ${y}L${x - w * 0.3} ${y - h * 0.66}Q${x} ${y - h * 0.76} ${x + w * 0.3} ${y - h * 0.66}L${x + w / 2} ${y}Z`} fill="#d98a2b" />
      <path d={`M${x + w * 0.05} ${y}L${x + w * 0.04} ${y - h * 0.72}Q${x + w * 0.2} ${y - h * 0.7} ${x + w * 0.3} ${y - h * 0.66}L${x + w / 2} ${y}Z`} fill="#8f4f12" opacity=".55" />
      <circle cx={x} cy={y - h * 0.82} r={h * 0.1} fill="#3a2414" />
    </g>
  );
}

// Bioluminescent moss: deterministic specks scattered along the cliff edges.
const MOSS_ZONES: [number, number, number, number, number][] = [
  [0, 0, 340, 120, 26], [0, 120, 330, 330, 30], [20, 420, 310, 640, 30], [230, 760, 560, 900, 26],
  [1290, 0, 1600, 130, 26], [1290, 130, 1590, 400, 32], [1320, 500, 1600, 760, 24], [1020, 800, 1340, 900, 22],
  [380, 640, 1230, 800, 34],
];
const MOSS = MOSS_ZONES.flatMap(([x0, y0, x1, y1, n]) =>
  Array.from({ length: n }, () => ({ x: x0 + rnd() * (x1 - x0), y: y0 + rnd() * (y1 - y0), r: 1.3 + rnd() * 2.3, o: 0.45 + rnd() * 0.55 })),
);
const MOSS_GLOW = MOSS.filter((_, i) => i % 3 === 0);

const FALLS: { x: number; y: number; w: number; h: number }[] = [
  { x: 506, y: 668, w: 70, h: 130 }, { x: 808, y: 650, w: 64, h: 150 }, { x: 1012, y: 662, w: 58, h: 140 }, { x: 1152, y: 668, w: 40, h: 120 },
];
const HALOS = [
  { x: 800, y: 270, s: 36 }, { x: 150, y: 420, s: 24 }, { x: 1470, y: 650, s: 20 }, { x: 600, y: 440, s: 12 }, { x: 960, y: 470, s: 14 },
];
const MONKS = Array.from({ length: 8 }, (_, i) => {
  const x = 640 + i * 112, yt = 806 - (x - 560) * 0.0654, yb = 900 - (x - 350) * 0.0704;
  return { x, y: (yt + yb) / 2 + 12, h: 24 + i * 6 };
});

export function GoldenMist() {
  const B = "b-", F = "f-";
  return (
    <div className="r-layer r-mist">
      <div className="m-base" />
      <div className="m-sky" />
      <div className="m-aurora" />
      <div className="m-scene">
        <svg className="m-art" viewBox="0 0 1600 900" preserveAspectRatio="none" aria-hidden>
          <Defs p={B} />
          {/* far misty ridges */}
          <path d="M0 520C120 470 220 500 330 440S520 430 640 480 860 420 980 470 1220 430 1340 480 1500 450 1600 470V900H0Z" fill={`url(#${B}far)`} />
          <path d="M0 590C140 540 260 580 400 520S640 540 780 560 1040 500 1200 550 1480 520 1600 560V900H0Z" fill={`url(#${B}far)`} opacity=".8" />
          {/* hazy far domes */}
          <g opacity=".5"><Pavilion p={B} cx={430} base={640} w={130} /><Pavilion p={B} cx={1130} base={640} w={120} /></g>
          {/* mossy rock plateau the palace stands on */}
          <path d="M360 640H1250C1262 700 1230 760 1210 800 1100 830 1000 806 900 826 780 800 660 830 560 808 470 826 400 790 380 740 366 700 356 670 360 640Z" fill={`url(#${B}rockV)`} />
          <path d="M360 640C356 670 366 700 380 740 400 790 470 826 560 808" stroke="#7dff9d" strokeOpacity=".3" strokeWidth="2" fill="none" />
          <path d="M370 700C430 690 470 720 540 706M640 730C700 716 760 744 830 730M920 740C990 726 1060 748 1130 734" stroke="#2f6b43" strokeOpacity=".45" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          {/* terrace wall */}
          <rect x="380" y="618" width="860" height="48" fill={`url(#${B}stoneV)`} />
          {Array.from({ length: 18 }, (_, i) => (
            <path key={i} d={`M${402 + i * 47} 664V640A14 14 0 0 1 ${430 + i * 47} 640V664Z`} fill={`url(#${B}win)`} opacity=".55" />
          ))}
          <rect x="372" y="610" width="876" height="10" fill={`url(#${B}stone)`} />
          {/* waterfalls (static body) */}
          {FALLS.map((f, i) => <path key={i} d={`M${f.x} ${f.y}H${f.x + f.w}L${f.x + f.w + 8} ${f.y + f.h}H${f.x - 8}Z`} fill={`url(#${B}fall)`} opacity=".9" />)}
          {/* central monolith + crystal crown */}
          <path d="M742 640 L770 40 Q800 24 830 40 L858 640Z" fill={`url(#${B}stone)`} />
          <path d="M800 30 L830 40 L858 640 L800 640Z" fill="#a89cb8" opacity=".28" />
          <rect x="712" y="326" width="176" height="22" fill={`url(#${B}stone)`} />
          <rect x="722" y="348" width="156" height="118" fill={`url(#${B}stoneV)`} />
          {[0, 1, 2].map((i) => (
            <path key={i} d={`M${748 + i * 44} 462V400A15 15 0 0 1 ${778 + i * 44} 400V462Z`} fill={`url(#${B}win)`} />
          ))}
          <Cluster p={B} x={800} y={328} items={CROWN} />
          {/* left slim tower with crystal spire */}
          <rect x="578" y="440" width="46" height="190" fill={`url(#${B}stone)`} />
          <rect x="572" y="434" width="58" height="8" fill={`url(#${B}stone)`} />
          <path d="M578 434A23 24 0 0 1 624 434Z" fill={`url(#${B}dome)`} />
          <Cluster p={B} x={601} y={414} s={0.8} items={[[0, 22, 74, 2], [-14, 14, 46, -3], [14, 14, 40, 4]]} />
          {/* pavilions */}
          <Pavilion p={B} cx={735} base={622} w={190} />
          <Pavilion p={B} cx={965} base={626} w={190} open />
          <Cluster p={B} x={1062} y={632} s={0.7} items={SMALL} />
        </svg>

        <div className="m-halos">
          {HALOS.map((h, i) => (
            <i key={i} style={{ left: `${((h.x - h.s * 8) / 1600) * 100}%`, top: `${((h.y - h.s * 8) / 900) * 100}%`, width: `${((h.s * 16) / 1600) * 100}%`, height: `${((h.s * 16) / 900) * 100}%` }} />
          ))}
        </div>
        <div className="m-beam b1" /><div className="m-beam b2" />
        {FALLS.map((f, i) => (
          <div key={i} className="m-fall" style={{ left: `${(f.x / 1600) * 100}%`, top: `${(f.y / 900) * 100}%`, width: `${(f.w / 1600) * 100}%`, height: `${(f.h / 900) * 100}%` }}><i /></div>
        ))}
        <div className="m-haze" />
        <div className="m-fog fa" />

        <svg className="m-art m-front" viewBox="0 0 1600 900" preserveAspectRatio="none" aria-hidden>
          <Defs p={F} />
          {/* mid ledges */}
          <path d="M240 900C300 820 420 790 560 800S800 830 900 800 1180 790 1340 840L1360 900Z" fill={`url(#${F}rockV)`} />
          <path d="M240 900C300 820 420 790 560 800S800 830 900 800 1180 790 1340 840" fill="none" stroke="#7dff9d" strokeOpacity=".22" strokeWidth="2" />
          {/* luminous path + monks */}
          <path d="M200 900L520 806L1600 738V812L1600 900Z" fill={`url(#${F}side)`} />
          <path d="M200 900L520 806L1600 738V792L1600 812L260 900Z" fill={`url(#${F}path)`} />
          <path d="M520 806L1600 738" stroke="#fff" strokeOpacity=".8" strokeWidth="2.4" />
          {MONKS.map((m, i) => <Monk key={i} x={m.x} y={m.y} h={m.h} />)}
          <Cluster p={F} x={445} y={705} s={0.9} items={SMALL} />
          <Cluster p={F} x={1160} y={820} s={0.8} items={SMALL} />
          {/* cliffs */}
          <path d="M0 0H340C372 90 300 170 322 270 344 380 262 450 300 560 330 650 250 730 286 820 300 860 250 890 240 900H0Z" fill={`url(#${F}rock)`} />
          <path d="M1600 0H1300C1272 100 1340 190 1320 300 1300 410 1380 480 1340 590 1315 670 1390 740 1356 840L1340 900H1600Z" fill={`url(#${F}rockR)`} />
          <path d="M340 0C372 90 300 170 322 270 344 380 262 450 300 560" fill="none" stroke="#7dff9d" strokeOpacity=".3" strokeWidth="2" />
          <path d="M1300 0C1272 100 1340 190 1320 300 1300 410 1380 480 1340 590" fill="none" stroke="#7dff9d" strokeOpacity=".3" strokeWidth="2" />
          {/* cliff crystals */}
          <Cluster p={F} x={150} y={560} items={BIG_L} />
          <Cluster p={F} x={1470} y={700} items={BIG_R} />
          {/* rock crevices */}
          {["M40 300C110 330 130 380 90 440", "M180 120C230 170 220 230 250 280", "M60 560C120 600 150 640 120 700", "M1500 260C1450 300 1440 350 1470 410", "M1400 120C1360 170 1380 220 1350 270", "M1520 520C1470 560 1450 610 1480 660"].map((d, i) => (
            <path key={i} d={d} stroke="#06120b" strokeOpacity=".6" strokeWidth="3" fill="none" strokeLinecap="round" />
          ))}
          {/* hanging vines */}
          {["M60 0C72 90 40 150 60 250", "M150 0C140 70 170 120 150 190", "M270 0C282 60 252 120 270 170", "M1340 0C1330 80 1360 140 1340 230", "M1450 0C1462 70 1432 130 1450 200", "M1540 0C1530 60 1560 110 1540 160"].map((d, i) => (
            <path key={i} d={d} fill="none" stroke="#14301c" strokeWidth="4" strokeLinecap="round" />
          ))}
          {MOSS.map((m, i) => <circle key={i} cx={m.x.toFixed(0)} cy={m.y.toFixed(0)} r={m.r.toFixed(1)} fill="#b9ffa8" opacity={m.o.toFixed(2)} />)}
          {/* foreground rocks */}
          <path d="M0 900V820C70 800 150 830 210 900Z" fill="#07110b" />
          <path d="M1600 900V830C1530 810 1450 840 1400 900Z" fill="#07110b" />
        </svg>

        <svg className="m-moss" viewBox="0 0 1600 900" preserveAspectRatio="none" aria-hidden>
          <Defs p="g-" />
          {MOSS_GLOW.map((m, i) => <circle key={i} cx={m.x.toFixed(0)} cy={m.y.toFixed(0)} r={(m.r * 3.6).toFixed(0)} fill="url(#g-moss)" />)}
        </svg>
        <div className="m-fog fb" />
      </div>
    </div>
  );
}
