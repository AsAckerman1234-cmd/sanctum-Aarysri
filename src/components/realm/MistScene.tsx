import "./palace.css";

/* GOLDEN MIST — "Luminous Palace" scene.
   Static art lives in a few SVG layers that share one viewBox, so everything lines up on any screen.
   Motion lives in separate layers (opacity / transform only) so it stays light on phones. */

function seeded(seed: number) {
  let s = seed;
  return () => ((s = (s * 1664525 + 1013904223) % 4294967296) / 4294967296);
}
const FLIES = (() => {
  const r = seeded(21);
  return Array.from({ length: 22 }, (_, i) => ({
    left: r() * 100,
    bottom: 4 + r() * 56,
    size: 2 + r() * 3.2,
    dur: 16 + r() * 18,
    delay: -r() * 30,
    dx: (r() - 0.5) * 90,
    green: i % 3 !== 0,
  }));
})();

/** One amber crystal, base-centred at (x, y). */
function Crystal({ x, y, w, h, t = 0 }: { x: number; y: number; w: number; h: number; t?: number }) {
  const hw = w / 2;
  return (
    <g transform={`translate(${x} ${y}) rotate(${t})`}>
      <polygon points={`${-hw},0 ${-hw},${-h * 0.72} 0,${-h} ${hw},${-h * 0.72} ${hw},0`} fill="url(#pl-amber)" />
      <polygon points={`${-hw * 0.1},0 ${-hw * 0.1},${-h * 0.97} 0,${-h} ${hw},${-h * 0.72} ${hw},0`} fill="url(#pl-amber-hi)" />
      <path d={`M${-hw * 0.55} ${-h * 0.1}V${-h * 0.62}`} stroke="#fff8dc" strokeOpacity=".7" strokeWidth="1.6" strokeLinecap="round" />
    </g>
  );
}
type Item = [dx: number, w: number, h: number, t: number];
function Cluster({ x, y, items }: { x: number; y: number; items: Item[] }) {
  return (
    <>
      {items.map(([dx, w, h, t], i) => (
        <Crystal key={i} x={x + dx} y={y} w={w} h={h} t={t} />
      ))}
    </>
  );
}

const FALLS = [
  { id: "a", d: "M470 570H505L515 720H455Z", xs: [464, 474, 484, 494, 504] },
  { id: "b", d: "M640 570H670L676 720H634Z", xs: [646, 654, 662, 670] },
  { id: "c", d: "M1000 570H1050L1062 720H988Z", xs: [1008, 1018, 1028, 1038, 1048, 1056] },
];

const MONKS = [650, 740, 830, 905, 990, 1080, 1170, 1270, 1375];
const walkY = (x: number) => 852 - (x - 470) * 0.0602;

function Monk({ x, i }: { x: number; i: number }) {
  const s = 0.72 + ((x - 650) / 725) * 0.5;
  const robe = i % 2 ? "#b8651f" : "#c47a2e";
  return (
    <g transform={`translate(${x} ${walkY(x)}) scale(${s})`}>
      <ellipse cx="0" cy="4" rx="17" ry="3.6" fill="#ffe3a0" opacity=".38" />
      <path d="M-8 -50Q0 -57 8 -50L15 0H-15Z" fill={robe} />
      <path d="M1 -50Q9 -48 8 -50L15 0H3Z" fill="#e8a850" opacity=".45" />
      <path d="M-9 -44L12 -30" stroke="#8a4a14" strokeWidth="2" opacity=".6" />
      <circle cx="0" cy="-58" r="6.5" fill="#7a4a2c" />
    </g>
  );
}

export function GoldenMist() {
  return (
    <div className="r-layer r-mist">
      <div className="pl-sky" />
      <div className="pl-aurora a" />
      <div className="pl-aurora b" />
      <div className="pl-aurora c" />
      <div className="pl-halo" />

      {/* distant ridges */}
      <svg className="pl-svg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice" aria-hidden>
        <path d="M0 600C200 520 330 570 520 500S900 440 1100 500S1450 540 1600 470V900H0Z" fill="#0b3a3a" opacity=".5" />
        <path d="M0 660C240 600 420 650 640 590S1000 560 1250 610S1500 600 1600 570V900H0Z" fill="#0a2c2a" opacity=".6" />
      </svg>

      {/* the white-stone palace */}
      <svg className="pl-svg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice" aria-hidden>
        <defs>
          <linearGradient id="pl-amber" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff6cf" />
            <stop offset=".5" stopColor="#ffd27a" />
            <stop offset="1" stopColor="#f09a2a" />
          </linearGradient>
          <linearGradient id="pl-amber-hi" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fffbe6" stopOpacity=".95" />
            <stop offset="1" stopColor="#ffe29a" stopOpacity=".6" />
          </linearGradient>
          <linearGradient id="pl-stone" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#d9d6ea" />
            <stop offset=".5" stopColor="#f7f1e2" />
            <stop offset="1" stopColor="#fbe5b4" />
          </linearGradient>
          <linearGradient id="pl-dome" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ffbfe3" />
            <stop offset=".5" stopColor="#bdf1ff" />
            <stop offset="1" stopColor="#ffe6a0" />
          </linearGradient>
          <linearGradient id="pl-fall" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff3d6" stopOpacity=".9" />
            <stop offset="1" stopColor="#bfe6ff" stopOpacity=".3" />
          </linearGradient>
        </defs>
        <g transform="translate(0 130)">
          {/* podium */}
          <path d="M350 520H1280V548H1250V574H380V548H350Z" fill="url(#pl-stone)" />
          <path d="M380 574H1250" stroke="#ffd98a" strokeWidth="3" opacity=".85" />
          {/* waterfalls */}
          {FALLS.map((f) => (
            <path key={f.id} d={f.d} fill="url(#pl-fall)" />
          ))}
          {/* central tower */}
          <path d="M744 520L772 480H948L976 520Z" fill="#ece4cf" />
          <path d="M772 520L790 70L860 18L930 70L948 520Z" fill="url(#pl-stone)" />
          <path d="M860 18L930 70L948 520H860Z" fill="#8a7a5a" opacity=".12" />
          <path d="M788 140H932M784 215H936M780 300H940M776 400H944" stroke="#b9a77a" strokeOpacity=".5" strokeWidth="2" />
          <path d="M752 215H968V190H946V150H774V190H752Z" fill="#e6dcc3" />
          <path d="M833 500V430a27 27 0 0 1 54 0V500Z" fill="#ffd98a" />
          <path d="M845 500V432a15 15 0 0 1 30 0V500Z" fill="#fff1c4" />
          <path d="M812 330v34M908 330v34M812 250v26M908 250v26" stroke="#ffdc8a" strokeWidth="6" strokeLinecap="round" />
          {/* crystals crowning the tower */}
          <Cluster
            x={860}
            y={105}
            items={[
              [0, 70, 170, 0],
              [-55, 46, 120, -14],
              [55, 50, 130, 12],
              [-95, 34, 80, -26],
              [92, 36, 90, 24],
              [22, 40, 125, 5],
            ]}
          />
          {/* dome A */}
          <rect x="626" y="440" width="128" height="80" fill="url(#pl-stone)" />
          {[640, 662, 684, 706, 728].map((x) => (
            <path key={x} d={`M${x} 520v-34a9 9 0 0 1 18 0v34Z`} fill="#ffd98a" />
          ))}
          <path d="M620 440A70 66 0 0 1 760 440Z" fill="url(#pl-dome)" />
          <path d="M655 382Q640 410 645 440M725 382Q740 410 735 440M690 374V440" stroke="#fff" strokeOpacity=".6" strokeWidth="1.4" fill="none" />
          <rect x="616" y="436" width="148" height="10" rx="3" fill="#efe6cf" />
          <Crystal x={690} y={378} w={10} h={30} />
          {/* dome B — open colonnade */}
          <rect x="1030" y="430" width="140" height="90" fill="#ffcf7a" opacity=".6" />
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <rect key={i} x={1034 + i * 26} y="430" width="10" height="90" fill="url(#pl-stone)" />
          ))}
          <path d="M1022 430A78 72 0 0 1 1178 430Z" fill="url(#pl-dome)" />
          <path d="M1060 366Q1040 400 1046 430M1140 366Q1160 400 1154 430M1100 358V430" stroke="#fff" strokeOpacity=".6" strokeWidth="1.4" fill="none" />
          <rect x="1018" y="426" width="164" height="10" rx="3" fill="#efe6cf" />
          <Crystal x={1100} y={362} w={12} h={34} />
          {/* small dome */}
          <rect x="405" y="482" width="70" height="38" fill="url(#pl-stone)" />
          <path d="M398 482A42 40 0 0 1 482 482Z" fill="url(#pl-dome)" />
          <path d="M424 520v-20a8 8 0 0 1 16 0v20ZM446 520v-20a8 8 0 0 1 16 0v20Z" fill="#ffd98a" />
          {/* crystal spire */}
          <path d="M545 520V210L560 190L575 210V520Z" fill="url(#pl-stone)" />
          <path d="M543 262H577M543 332H577" stroke="#b9a77a" strokeOpacity=".6" strokeWidth="2" />
          <rect x="555" y="300" width="10" height="40" rx="5" fill="#ffdc8a" />
          <Cluster x={560} y={200} items={[[0, 22, 70, 0], [-16, 16, 46, -16], [16, 16, 50, 14]]} />
          {/* moss + vines on the podium */}
          {[420, 520, 600, 760, 940, 1080, 1210].map((x, i) => (
            <ellipse key={x} cx={x} cy="521" rx={22 + (i % 3) * 8} ry="6" fill="#3fbf72" />
          ))}
          <path d="M440 548Q432 580 446 606M700 548Q694 570 704 596M1110 548Q1102 580 1118 612M1230 548Q1224 572 1236 598" stroke="#2f8a52" strokeWidth="2" fill="none" />
          <path d="M440 548Q432 580 446 606M700 548Q694 570 704 596M1110 548Q1102 580 1118 612M1230 548Q1224 572 1236 598" stroke="#9dffbd" strokeWidth="2.4" strokeDasharray="1 8" strokeLinecap="round" fill="none" />
        </g>
      </svg>

      <div className="pl-mist a" />

      {/* waterfalls: moving streaks, clipped to each fall */}
      <svg className="pl-svg pl-flow" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice" aria-hidden>
        <defs>
          {FALLS.map((f) => (
            <clipPath key={f.id} id={`pl-c-${f.id}`}>
              <path d={f.d} transform="translate(0 130)" />
            </clipPath>
          ))}
        </defs>
        {FALLS.map((f) => (
          <g key={f.id} clipPath={`url(#pl-c-${f.id})`}>
            {f.xs.map((x, i) => (
              <path key={x} d={`M${x} 700V850`} className="pl-streak" style={{ animationDelay: `${-i * 0.45}s` }} />
            ))}
          </g>
        ))}
      </svg>

      {/* foreground: mossy cliffs, giant crystals, the luminous bridge and its monks */}
      <svg className="pl-svg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice" aria-hidden>
        <defs>
          <linearGradient id="pl-rock" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#16352a" />
            <stop offset="1" stopColor="#07140e" />
          </linearGradient>
          <linearGradient id="pl-walk" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#ffd9ee" />
            <stop offset=".6" stopColor="#fff2cf" />
            <stop offset="1" stopColor="#ffe8b0" />
          </linearGradient>
          <linearGradient id="pl-walk-f" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#c9bfa8" />
            <stop offset="1" stopColor="#6a6454" />
          </linearGradient>
        </defs>
        {[
          ["M0 0H210C190 60 170 120 150 170C130 215 90 250 60 300C30 340 10 380 0 420Z", "M210 0C190 60 170 120 150 170C130 215 90 250 60 300C30 340 10 380 0 420"],
          ["M0 560C60 540 130 560 200 600C270 640 330 700 380 770C410 810 470 860 520 900H0Z", "M0 560C60 540 130 560 200 600C270 640 330 700 380 770C410 810 470 860 520 900"],
          ["M1600 0H1390C1410 50 1440 100 1470 150C1500 200 1540 230 1565 290C1585 330 1595 380 1600 440Z", "M1390 0C1410 50 1440 100 1470 150C1500 200 1540 230 1565 290C1585 330 1595 380 1600 440"],
          ["M1600 480C1540 490 1490 540 1440 600C1400 650 1380 700 1390 760C1400 790 1450 790 1600 770Z", "M1600 480C1540 490 1490 540 1440 600C1400 650 1380 700 1390 760C1400 790 1450 790 1600 770"],
        ].map(([fill, edge]) => (
          <g key={edge}>
            <path d={fill} fill="url(#pl-rock)" />
            <path d={edge} fill="none" stroke="#3fe08a" strokeOpacity=".18" strokeWidth="10" />
            <path d={edge} fill="none" stroke="#3fe08a" strokeOpacity=".6" strokeWidth="1.4" />
            <path d={edge} fill="none" stroke="#9dffbd" strokeWidth="2.8" strokeDasharray="2 9" strokeLinecap="round" />
          </g>
        ))}
        {/* glowing moss veins running through the rock */}
        <path d="M30 600C90 620 150 660 210 720M0 680C60 700 120 740 170 800M1450 640C1480 600 1520 570 1580 540M1420 720C1470 700 1530 690 1590 700M20 120C60 180 100 220 140 250M1500 120C1520 170 1550 210 1590 240" stroke="#7dffa6" strokeOpacity=".55" strokeWidth="2.4" strokeDasharray="1 10" strokeLinecap="round" fill="none" />
        {/* hanging vines */}
        <path d="M120 190C110 240 130 280 118 330M70 250C62 290 78 320 70 360M1500 210C1490 260 1510 300 1498 350M1550 280C1544 320 1560 350 1552 390" stroke="#2f8a52" strokeWidth="2" fill="none" />
        <path d="M120 190C110 240 130 280 118 330M70 250C62 290 78 320 70 360M1500 210C1490 260 1510 300 1498 350M1550 280C1544 320 1560 350 1552 390" stroke="#9dffbd" strokeWidth="2.6" strokeDasharray="1 7" strokeLinecap="round" fill="none" />
        {/* giant amber crystals */}
        <Cluster x={95} y={600} items={[[0, 70, 300, -4], [60, 48, 170, 10], [-40, 40, 140, -12]]} />
        <Cluster x={215} y={670} items={[[0, 36, 110, 6], [30, 26, 70, 16]]} />
        <Cluster x={1480} y={650} items={[[0, 48, 180, 6], [-34, 30, 100, -10]]} />
        <Cluster x={440} y={850} items={[[0, 22, 60, -4], [18, 16, 40, 12]]} />
        {/* the bridge */}
        <path d="M470 838L1600 770V822L430 880Z" fill="url(#pl-walk)" />
        <path d="M430 880L1600 822V900H400Z" fill="url(#pl-walk-f)" />
        <path d="M430 880L1600 822" stroke="#ffe9a8" strokeWidth="2" opacity=".9" />
        {MONKS.map((x, i) => (
          <Monk key={x} x={x} i={i} />
        ))}
      </svg>

      {/* soft light: lamps of crystal, windows, pools and bioluminescent moss */}
      <svg className="pl-svg pl-glows" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice" aria-hidden>
        <defs>
          <radialGradient id="pl-gw">
            <stop offset="0" stopColor="#ffdf9a" stopOpacity=".55" />
            <stop offset="1" stopColor="#ffdf9a" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="pl-gg">
            <stop offset="0" stopColor="#6dff9e" stopOpacity=".5" />
            <stop offset="1" stopColor="#6dff9e" stopOpacity="0" />
          </radialGradient>
        </defs>
        {[
          [860, 140, 190], [560, 300, 90], [690, 620, 100], [1100, 610, 120], [860, 640, 110], [440, 650, 70],
          [95, 450, 230], [215, 600, 100], [1480, 540, 170], [440, 800, 80], [485, 850, 100], [1025, 850, 110],
        ].map(([cx, cy, r], i) => (
          <circle key={i} cx={cx} cy={cy} r={r} fill="url(#pl-gw)" />
        ))}
        {[
          [60, 470, 190], [1510, 430, 170], [1450, 650, 150], [300, 720, 160], [620, 650, 100], [1230, 640, 100],
        ].map(([cx, cy, r], i) => (
          <circle key={i} cx={cx} cy={cy} r={r} fill="url(#pl-gg)" />
        ))}
      </svg>

      <div className="pl-mist b" />
      <div className="pl-mist c" />

      <div className="pl-flies">
        {FLIES.map((f, i) => (
          <span
            key={i}
            className={`pl-fly ${f.green ? "g" : ""}`}
            style={{
              left: `${f.left}%`,
              bottom: `${f.bottom}%`,
              width: f.size,
              height: f.size,
              animationDuration: `${f.dur}s`,
              animationDelay: `${f.delay}s`,
              ["--dx" as string]: `${f.dx}px`,
            }}
          />
        ))}
      </div>
      <div className="pl-dim" />
    </div>
  );
}
