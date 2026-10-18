import { useEffect, useRef, type CSSProperties, type RefObject } from "react";
import ghat from "@/assets/realm/dawn-ghat-hd.webp";

/* =====================================================================
   GOLDEN DAWN — a ghat awake before sunrise.
   One painted plate (the ghat) + living layers on top of it:
   fireworks + rising embers (one canvas), flickering diyas and windows,
   drifting diyas on the river, sky lanterns, a flock of birds, shimmering
   water, drifting haze, a slowly breathing dawn glow and rotating god rays.
   Everything CSS-driven moves with transform/opacity only (GPU friendly).
   Overlays are positioned in % of the image, so they stay glued to it.
   ===================================================================== */

function seeded(seed: number) {
  let s = seed;
  return () => ((s = (s * 1664525 + 1013904223) % 4294967296) / 4294967296);
}

type Lamp = { x: number; y: number; w: number; d: number; dl: number; kind: "diya" | "win" | "far" };

// Deterministic so server and client render identical markup.
const LAMPS: Lamp[] = (() => {
  const r = seeded(11);
  const out: Lamp[] = [];
  // diyas on the stepped ghat
  for (let i = 0; i < 46; i++)
    out.push({ x: 2 + r() * 54, y: 53 + r() * 17, w: 0.34 + r() * 0.42, d: 1.3 + r() * 2.2, dl: -r() * 4, kind: "diya" });
  // lit windows in the tall buildings (left)
  for (let i = 0; i < 16; i++)
    out.push({ x: 4 + r() * 34, y: 14 + r() * 32, w: 0.4 + r() * 0.4, d: 3 + r() * 4, dl: -r() * 6, kind: "win" });
  // far shore lights (right)
  for (let i = 0; i < 18; i++)
    out.push({ x: 58 + r() * 34, y: 40 + r() * 18, w: 0.22 + r() * 0.24, d: 2 + r() * 3, dl: -r() * 5, kind: "far" });
  return out;
})();

// little diyas drifting on the river
const FLOATERS = (() => {
  const r = seeded(31);
  return Array.from({ length: 11 }, (_, i) => {
    const y = 78 + r() * 17;
    return { x: 4 + (i / 11) * 92 + r() * 5, y, w: 0.55 + ((y - 78) / 17) * 0.55, dur: 16 + r() * 14, dl: -r() * 20, dx: (r() > 0.5 ? 1 : -1) * (2 + r() * 3) };
  });
})();

// sky lanterns rising over the ghat
const LANTERNS = (() => {
  const r = seeded(47);
  return Array.from({ length: 9 }, () => ({
    x: 8 + r() * 80, w: 1.1 + r() * 0.9, dur: 30 + r() * 26, dl: -r() * 50, dx: (r() - 0.5) * 16, sw: 4 + r() * 4,
  }));
})();

const FLOCKS = [
  { top: 8, dur: 52, dl: -8, s: 1, n: 5 },
  { top: 17, dur: 68, dl: -41, s: 0.7, n: 4 },
];

const SHOW = [
  "255,214,130", // gold
  "255,170,70", // amber
  "255,238,196", // pale
  "255,122,64", // ember
  "255,184,206", // faint rose
];

/** Fireworks over the sky and embers lifting off the ghat. One canvas, one rAF loop. */
function Sparks() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const lite = matchMedia("(max-width: 720px), (hover: none), (pointer: coarse)").matches;

    let w = 0;
    let h = 0;
    let k = 1;
    const fit = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, lite ? 1 : 1.5);
      w = cv.clientWidth;
      h = cv.clientHeight;
      k = Math.max(0.6, w / 1400);
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(cv);

    type P = { x: number; y: number; vx: number; vy: number; life: number; max: number; size: number; c: string; tw: number };
    type Rocket = { x: number; y: number; tx: number; ty: number; vy: number; c: string };
    type Flash = { x: number; y: number; life: number; c: string };
    type Ember = { x: number; y: number; vx: number; vy: number; life: number; max: number; size: number; ph: number };

    const parts: P[] = [];
    const rockets: Rocket[] = [];
    const flashes: Flash[] = [];
    const rnd = Math.random;
    const pick = () => SHOW[(rnd() * SHOW.length) | 0];

    const burst = (x: number, y: number, c: string) => {
      const n = lite ? 46 : 92;
      const ring = rnd() > 0.45;
      const sp = (150 + rnd() * 90) * k;
      const c2 = rnd() > 0.5 ? pick() : c;
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2 + rnd() * 0.15;
        const v = ring ? sp : sp * (0.25 + rnd() * 0.85);
        parts.push({
          x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v,
          life: 1.5 + rnd() * 0.9, max: 2.4, size: (1 + rnd() * 1.1) * Math.max(0.8, k),
          c: i % 3 === 0 ? c2 : c, tw: rnd() * 6,
        });
      }
      flashes.push({ x, y, life: 0.55, c });
    };

    const launch = () => {
      const tx = w * (0.4 + rnd() * 0.52);
      rockets.push({ x: w * (0.42 + rnd() * 0.46), y: h * (0.58 + rnd() * 0.08), tx, ty: h * (0.1 + rnd() * 0.26), vy: -(h * (0.5 + rnd() * 0.18)), c: pick() });
    };

    // embers drifting up off the lit steps
    const embers: Ember[] = [];
    const spawnEmber = (e?: Ember): Ember => {
      const o = e ?? ({} as Ember);
      o.x = w * (0.03 + rnd() * 0.56);
      o.y = h * (0.58 + rnd() * 0.14);
      o.vx = (6 + rnd() * 16) * k;
      o.vy = -(14 + rnd() * 34) * k;
      o.max = o.life = 4 + rnd() * 6;
      o.size = (0.7 + rnd() * 1.5) * Math.max(0.8, k);
      o.ph = rnd() * 6.28;
      return o;
    };
    for (let i = 0; i < (lite ? 16 : 38); i++) {
      const e = spawnEmber();
      e.life = rnd() * e.max;
      embers.push(e);
    }

    let last = performance.now();
    let next = last + 900;
    let raf = 0;
    const queue: number[] = [];

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      if (now > next) {
        launch();
        if (rnd() < 0.35) {
          queue.push(now + 260, now + 560);
        }
        next = now + 2400 + rnd() * 2800;
      }
      while (queue.length && queue[0] <= now) {
        queue.shift();
        launch();
      }

      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      ctx.lineCap = "round";

      // rockets
      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        r.vy *= 1 - 0.55 * dt;
        r.y += r.vy * dt;
        const t = Math.min(1, (h * 0.8 - r.y) / (h * 0.8 - r.ty));
        r.x += (r.tx - r.x) * Math.min(1, dt * 1.2) * (0.4 + t);
        ctx.strokeStyle = `rgba(${r.c},.9)`;
        ctx.lineWidth = 1.6 * Math.max(0.8, k);
        ctx.beginPath();
        ctx.moveTo(r.x - (r.tx - r.x) * 0.02, r.y + 16 * k);
        ctx.lineTo(r.x, r.y);
        ctx.stroke();
        if (r.y <= r.ty || r.vy > -30) {
          burst(r.x, r.y, r.c);
          rockets.splice(i, 1);
        }
      }

      // flashes (soft glow in the clouds)
      for (let i = flashes.length - 1; i >= 0; i--) {
        const f = flashes[i];
        f.life -= dt;
        if (f.life <= 0) {
          flashes.splice(i, 1);
          continue;
        }
        const rad = w * 0.2;
        const g = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, rad);
        g.addColorStop(0, `rgba(${f.c},${(f.life / 0.55) * 0.2})`);
        g.addColorStop(1, `rgba(${f.c},0)`);
        ctx.fillStyle = g;
        ctx.fillRect(f.x - rad, f.y - rad, rad * 2, rad * 2);
      }

      // burst particles
      const grav = 70 * k;
      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i];
        p.life -= dt;
        if (p.life <= 0) {
          parts.splice(i, 1);
          continue;
        }
        const drag = 1 - 1.7 * dt;
        p.vx *= drag;
        p.vy = p.vy * drag + grav * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        const a = Math.pow(Math.min(1, p.life / p.max * 1.6), 1.3) * (0.7 + 0.3 * Math.sin(now / 70 + p.tw));
        ctx.strokeStyle = `rgba(${p.c},${a})`;
        ctx.lineWidth = p.size;
        ctx.beginPath();
        ctx.moveTo(p.x - p.vx * 0.045, p.y - p.vy * 0.045);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
      }

      // embers
      for (const e of embers) {
        e.life -= dt;
        if (e.life <= 0) {
          spawnEmber(e);
          continue;
        }
        e.x += (e.vx + Math.sin(now / 900 + e.ph) * 10 * k) * dt;
        e.y += e.vy * dt;
        const t = e.life / e.max;
        const a = Math.sin(Math.PI * (1 - t)) * 0.85;
        ctx.fillStyle = `rgba(255,${150 + ((e.ph * 20) | 0)},70,${a})`;
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.size, 0, 6.283);
        ctx.fill();
      }
    };

    const start = () => {
      cancelAnimationFrame(raf);
      last = performance.now();
      raf = requestAnimationFrame(tick);
    };
    const onVis = () => (document.hidden ? cancelAnimationFrame(raf) : start());
    document.addEventListener("visibilitychange", onVis);
    start();

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVis);
      ro.disconnect();
    };
  }, []);

  return <canvas ref={ref} className="d-sparks" />;
}


/* ---------------------------------------------------------------------
   The painting itself moves. A WebGL shader re-draws the ghat image every frame:
   - river: the lit reflections ripple and glint, dark boats barely move
   - sky:   clouds and smoke drift and their light slowly shifts
   - lamps: every warm bright spot flickers on its own rhythm, with a soft bloom
   - HD:    unsharp pass + fine film grain
   Falls back to the plain image if WebGL is missing or reduced-motion is on.
   --------------------------------------------------------------------- */
const VERT = `attribute vec2 p; varying vec2 vUv;
void main(){ vUv = vec2(p.x*.5+.5, 1.-(p.y*.5+.5)); gl_Position = vec4(p,0.,1.); }`;

const FRAG = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
varying vec2 vUv;
uniform sampler2D uTex;
uniform float uTime;
uniform vec2 uPx;
uniform float uQ;

float h21(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
float vn(vec2 p){
  vec2 i = floor(p), f = fract(p); f = f*f*(3.-2.*f);
  return mix(mix(h21(i), h21(i+vec2(1.,0.)), f.x), mix(h21(i+vec2(0.,1.)), h21(i+vec2(1.,1.)), f.x), f.y);
}
float fbm(vec2 p){
  float a = .5, s = 0.;
  for(int i=0;i<4;i++){ s += a*vn(p); p = p*2.03 + vec2(17.1,9.3); a *= .5; }
  return s;
}
float lum(vec3 c){ return dot(c, vec3(.299,.587,.114)); }
vec3 ring(vec2 c, float r){
  vec2 d = uPx * r;
  vec3 s = texture2D(uTex, c + vec2( d.x, 0.)).rgb;
  s += texture2D(uTex, c + vec2(-d.x, 0.)).rgb;
  s += texture2D(uTex, c + vec2(0.,  d.y)).rgb;
  s += texture2D(uTex, c + vec2(0., -d.y)).rgb;
  s += texture2D(uTex, c + d*.7071).rgb;
  s += texture2D(uTex, c - d*.7071).rgb;
  s += texture2D(uTex, c + vec2( d.x,-d.y)*.7071).rgb;
  s += texture2D(uTex, c + vec2(-d.x, d.y)*.7071).rgb;
  return s*.125;
}

void main(){
  vec2 uv = vUv;
  float t = uTime;

  // ---- river ----
  float wm = smoothstep(.735, .79, uv.y);
  float depth = clamp((uv.y-.735)/.265, 0., 1.);
  vec3 c0 = texture2D(uTex, uv).rgb;
  float refl = smoothstep(.12, .5, lum(c0));
  vec2 q = vec2(uv.x*34., uv.y*(110.+depth*60.));
  float n1 = fbm(q + vec2(t*.30, t*.55));
  float n2 = fbm(q*1.8 + vec2(-t*.24, t*.42) + 7.);
  vec2 off = vec2((n1-.5)*.0075, (n2-.5)*.0030) * wm * (.35+depth*1.1) * (.3+.7*refl);
  off.x += sin(uv.y*170. + t*1.4 + uv.x*9.) * .0007 * wm * (.4+depth);

  // ---- sky: clouds and smoke ----
  float sm = smoothstep(.46, .62, uv.x) * (1.-smoothstep(.30, .46, uv.y));
  vec2 so = (vec2(fbm(uv*3.+vec2(t*.02,0.)), fbm(uv*3.+vec2(0.,t*.015)+5.)) - .5) * .006 * sm;

  vec2 u2 = uv + off + so;
  vec3 col = texture2D(uTex, u2).rgb;

  // ---- HD: unsharp ----
  vec3 tight = ring(u2, 3.);
  col += (col - tight) * .55;

  // ---- lamps flicker ----
  float L = lum(col);
  float warm = smoothstep(0., .25, col.r - col.b);
  float lamp = smoothstep(.55, .9, L) * warm;
  float f = h21(floor(uv*vec2(190.,115.)));
  float fl = .80 + .30*sin(t*(1.6+f*4.5)+f*60.) + .12*sin(t*9.+f*13.);
  col *= mix(1., fl, lamp*.75);

  // ---- bloom ----
  vec3 g = max(ring(u2, 9.) - .36, 0.) * .55;
  if(uQ > .5) g += max(ring(u2, 26.) - .30, 0.) * .65;
  col += g * vec3(1., .74, .42) * mix(1., fl, .6);

  // ---- water glints ----
  float a = vn(vec2(uv.x*230., uv.y*340.) + vec2(t*.6, t*.2));
  float b = vn(vec2(uv.x*410., uv.y*620.) - vec2(t*.4, 0.));
  col += vec3(1., .78, .42) * smoothstep(.80, .97, a*b*1.6) * wm * smoothstep(.2, .55, L) * .55;

  // ---- cloud light shifts ----
  float cl = fbm(uv*vec2(3., 2.2) + vec2(t*.03, t*.01));
  col *= 1. + (cl-.5) * .5 * sm;

  // ---- grade + grain ----
  col = mix(vec3(lum(col)), col, 1.08);
  col += (h21(gl_FragCoord.xy + fract(t)*97.) - .5) * .022;
  gl_FragColor = vec4(clamp(col, 0., 1.), 1.);
}`;

function DawnGL({ imgRef }: { imgRef: RefObject<HTMLImageElement | null> }) {
  const cvRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = cvRef.current;
    const im = imgRef.current;
    if (!cv || !im) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lite = matchMedia("(max-width: 720px), (hover: none), (pointer: coarse)").matches;
    const gl = cv.getContext("webgl", { alpha: false, antialias: false, powerPreference: "high-performance" });
    if (!gl) return;

    const sh = (type: number, src: string) => {
      const o = gl.createShader(type)!;
      gl.shaderSource(o, src);
      gl.compileShader(o);
      return gl.getShaderParameter(o, gl.COMPILE_STATUS) ? o : null;
    };
    const vs = sh(gl.VERTEX_SHADER, VERT);
    const fs = sh(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;
    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, "uTime");
    const uPx = gl.getUniformLocation(prog, "uPx");
    const uQ = gl.getUniformLocation(prog, "uQ");
    const root = cv.closest(".d-root");

    let raf = 0;
    let t0 = performance.now();
    let alive = true;

    const fit = () => {
      const cssW = cv.clientWidth || 1280;
      const maxW = lite ? 1280 : 2200;
      const scale = Math.min(window.devicePixelRatio || 1, maxW / cssW);
      cv.width = Math.round(cssW * scale);
      cv.height = Math.round((cv.clientHeight || cssW * 0.603) * scale);
      gl.viewport(0, 0, cv.width, cv.height);
    };

    const draw = (now: number) => {
      raf = requestAnimationFrame(draw);
      gl.uniform1f(uTime, (now - t0) / 1000);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    const init = () => {
      if (!alive || !im.naturalWidth) return;
      if (im.naturalWidth > (gl.getParameter(gl.MAX_TEXTURE_SIZE) as number)) return;
      const tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, im);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.uniform1i(gl.getUniformLocation(prog, "uTex"), 0);
      gl.uniform2f(uPx, 1 / im.naturalWidth, 1 / im.naturalHeight);
      gl.uniform1f(uQ, lite ? 0 : 1);
      fit();
      t0 = performance.now();
      raf = requestAnimationFrame(draw);
      cv.classList.add("on");
      root?.classList.add("d-gl");
    };

    const ro = new ResizeObserver(() => alive && fit());
    ro.observe(cv);
    const onVis = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden && cv.classList.contains("on")) raf = requestAnimationFrame(draw);
    };
    document.addEventListener("visibilitychange", onVis);
    const onLost = (e: Event) => {
      e.preventDefault();
      cancelAnimationFrame(raf);
      cv.classList.remove("on");
      root?.classList.remove("d-gl");
    };
    cv.addEventListener("webglcontextlost", onLost);

    if (im.complete && im.naturalWidth) init();
    else im.addEventListener("load", init, { once: true });

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      im.removeEventListener("load", init);
      document.removeEventListener("visibilitychange", onVis);
      cv.removeEventListener("webglcontextlost", onLost);
      ro.disconnect();
      root?.classList.remove("d-gl");
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [imgRef]);

  return <canvas ref={cvRef} className="d-gl-canvas" />;
}

export function GoldenDawn() {
  const imgRef = useRef<HTMLImageElement>(null);
  return (
    <div className="r-layer r-mist d-root">
      <div className="d-frame">
        <div className="d-stage">
          <img ref={imgRef} className="d-img" src={ghat} alt="" decoding="async" draggable={false} />
          <DawnGL imgRef={imgRef} />

          {/* the sky wakes: a breathing dawn glow + slow god rays */}
          <div className="d-sun" />
          <div className="d-rays" />

          {/* drifting smoke and haze */}
          <div className="d-haze" />
          <div className="d-haze d-haze-b" />

          {/* lights that breathe */}
          <div className="d-lamps">
            {LAMPS.map((l, i) => (
              <i
                key={i}
                className={`d-lamp ${l.kind}`}
                style={{ left: `${l.x}%`, top: `${l.y}%`, ["--w" as string]: `${l.w}%`, ["--d" as string]: `${l.d}s`, ["--dl" as string]: `${l.dl}s` } as CSSProperties}
              />
            ))}
          </div>

          {/* river */}
          <div className="d-water">
            <i style={{ ["--tile" as string]: "520px" } as CSSProperties} />
            <i className="b" style={{ ["--tile" as string]: "780px" } as CSSProperties} />
          </div>
          <div className="d-group d-floaters">
          {FLOATERS.map((f, i) => (
            <span
              key={i}
              className="d-float"
              style={{ left: `${f.x}%`, top: `${f.y}%`, ["--w" as string]: `${f.w}%`, ["--dur" as string]: `${f.dur}s`, ["--dl" as string]: `${f.dl}s`, ["--dx" as string]: `${f.dx}cqw` } as CSSProperties}
            >
              <i />
            </span>
          ))}
          </div>

          {/* sky lanterns */}
          <div className="d-group d-lanterns">
          {LANTERNS.map((l, i) => (
            <span
              key={i}
              className="d-lantern"
              style={{ left: `${l.x}%`, ["--w" as string]: `${l.w}%`, ["--dur" as string]: `${l.dur}s`, ["--dl" as string]: `${l.dl}s`, ["--dx" as string]: `${l.dx}cqw`, ["--sw" as string]: `${l.sw}s` } as CSSProperties}
            >
              <i />
            </span>
          ))}
          </div>

          {/* birds crossing the dawn */}
          <div className="d-group d-flocks">
          {FLOCKS.map((f, i) => (
            <div key={i} className="d-flock" style={{ top: `${f.top}%`, ["--dur" as string]: `${f.dur}s`, ["--dl" as string]: `${f.dl}s`, ["--s" as string]: f.s } as CSSProperties}>
              {Array.from({ length: f.n }, (_, j) => (
                <svg key={j} className="d-bird" viewBox="0 0 24 10" style={{ left: `${j * 3.2}cqw`, top: `${(j % 2) * 1.6 + j * 0.4}cqw`, animationDelay: `${-j * 0.17}s` }}>
                  <path d="M1 8 Q6 0 12 6 Q18 0 23 8" fill="none" strokeWidth="1.7" strokeLinecap="round" />
                </svg>
              ))}
            </div>
          ))}
          </div>

          <Sparks />
        </div>
      </div>

      {/* fixed cinematic grade: keeps text readable while the scene moves beneath it */}
      <div className="d-grade" />
    </div>
  );
}
