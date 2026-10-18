import { useEffect, useRef, type CSSProperties, type RefObject } from "react";
import ghat from "@/assets/realm/dawn-ghat-hd.webp";

/* =====================================================================
   GOLDEN DAWN — a ghat waking up as the sun rises over the river.
   Layers, bottom to top:
   1. the painted plate (HD image)
   2. a WebGL pass that moves the painting itself: river flow + sun glitter, boats rocking,
      people swaying, diyas flickering, clouds drifting, fireworks twinkling
   3. CSS life: pulsing sun + slow rays, drifting mist, floating diyas, gliding boats,
      people crossing the bridge, sky lanterns, birds
   4. one canvas: fireworks and embers
   Everything is positioned in % of the image, so it stays glued to the picture.
   ===================================================================== */

function seeded(seed: number) {
  let s = seed;
  return () => ((s = (s * 1664525 + 1013904223) % 4294967296) / 4294967296);
}

// diyas drifting on the river (bottom of the picture)
const FLOATERS = (() => {
  const r = seeded(31);
  return Array.from({ length: 9 }, (_, i) => {
    const y = 86 + r() * 11;
    return { x: 4 + (i / 9) * 92 + r() * 6, y, w: 1.0 + ((y - 86) / 11) * 1.1, dur: 18 + r() * 14, dl: -r() * 24, dx: (r() > 0.5 ? 1 : -1) * (1.4 + r() * 2.4) };
  });
})();

// sky lanterns rising over the ghat
const LANTERNS = (() => {
  const r = seeded(47);
  return Array.from({ length: 7 }, () => ({
    x: 10 + r() * 78, w: 1.1 + r() * 0.8, dur: 34 + r() * 26, dl: -r() * 55, dx: (r() - 0.5) * 14, sw: 4 + r() * 4,
  }));
})();

// birds crossing the dawn sky
const FLOCKS = [
  { top: 9, dur: 58, dl: -10, s: 1, n: 6 },
  { top: 21, dur: 78, dl: -48, s: 0.7, n: 4 },
  { top: 33, dur: 96, dl: -20, s: 0.5, n: 5 },
];

// tiny figures crossing the stone bridge on the right
const WALKERS = (() => {
  const r = seeded(63);
  return Array.from({ length: 6 }, (_, i) => ({ x: 84 + i * 1.5 + r(), dur: 10 + r() * 8, dl: -r() * 14, dir: i % 2 ? "reverse" : "normal" }));
})();

// small far boats gliding across the river (near the sun's path)
const FAR_BOATS = [
  { x: 60, y: 73.6, w: 2.3, dur: 140, dl: -30, dx: 9 },
  { x: 78, y: 73.3, w: 1.8, dur: 170, dl: -90, dx: -8 },
];

// vibrant, not only gold: white, rose, violet, sky blue and warm gold
const SHOW = ["255,240,212", "255,160,196", "196,160,255", "255,206,120", "150,214,255"];

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
      k = Math.max(0.6, w / 1500);
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
      const n = lite ? 44 : 86;
      const ring = rnd() > 0.45;
      const sp = (140 + rnd() * 80) * k;
      const c2 = rnd() > 0.5 ? pick() : c;
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2 + rnd() * 0.15;
        const v = ring ? sp : sp * (0.25 + rnd() * 0.85);
        parts.push({
          x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v,
          life: 1.4 + rnd() * 0.9, max: 2.3, size: (0.9 + rnd() * 1.0) * Math.max(0.8, k),
          c: i % 3 === 0 ? c2 : c, tw: rnd() * 6,
        });
      }
      flashes.push({ x, y, life: 0.5, c });
    };

    const launch = () => {
      const tx = w * (0.08 + rnd() * 0.84);
      rockets.push({ x: tx + (rnd() - 0.5) * w * 0.05, y: h * (0.6 + rnd() * 0.06), tx, ty: h * (0.08 + rnd() * 0.24), vy: -(h * (0.5 + rnd() * 0.16)), c: pick() });
    };

    // embers drifting up off the lamps of the left ghat
    const embers: Ember[] = [];
    const spawnEmber = (e?: Ember): Ember => {
      const o = e ?? ({} as Ember);
      o.x = w * (0.03 + rnd() * 0.3);
      o.y = h * (0.6 + rnd() * 0.18);
      o.vx = (5 + rnd() * 14) * k;
      o.vy = -(14 + rnd() * 30) * k;
      o.max = o.life = 4 + rnd() * 6;
      o.size = (0.7 + rnd() * 1.3) * Math.max(0.8, k);
      o.ph = rnd() * 6.28;
      return o;
    };
    for (let i = 0; i < (lite ? 12 : 26); i++) {
      const e = spawnEmber();
      e.life = rnd() * e.max;
      embers.push(e);
    }

    let last = performance.now();
    let next = last + 1400;
    let raf = 0;
    const queue: number[] = [];

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      if (now > next) {
        launch();
        if (rnd() < 0.3) queue.push(now + 280, now + 600);
        next = now + 3600 + rnd() * 3600;
      }
      while (queue.length && queue[0] <= now) {
        queue.shift();
        launch();
      }

      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      ctx.lineCap = "round";

      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        r.vy *= 1 - 0.55 * dt;
        r.y += r.vy * dt;
        r.x += (r.tx - r.x) * Math.min(1, dt * 1.6);
        ctx.strokeStyle = `rgba(${r.c},.85)`;
        ctx.lineWidth = 1.5 * Math.max(0.8, k);
        ctx.beginPath();
        ctx.moveTo(r.x, r.y + 18 * k);
        ctx.lineTo(r.x, r.y);
        ctx.stroke();
        if (r.y <= r.ty || r.vy > -30) {
          burst(r.x, r.y, r.c);
          rockets.splice(i, 1);
        }
      }

      for (let i = flashes.length - 1; i >= 0; i--) {
        const f = flashes[i];
        f.life -= dt;
        if (f.life <= 0) {
          flashes.splice(i, 1);
          continue;
        }
        const rad = w * 0.16;
        const g = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, rad);
        g.addColorStop(0, `rgba(${f.c},${(f.life / 0.5) * 0.16})`);
        g.addColorStop(1, `rgba(${f.c},0)`);
        ctx.fillStyle = g;
        ctx.fillRect(f.x - rad, f.y - rad, rad * 2, rad * 2);
      }

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
        const a = Math.pow(Math.min(1, (p.life / p.max) * 1.6), 1.3) * (0.7 + 0.3 * Math.sin(now / 70 + p.tw));
        ctx.strokeStyle = `rgba(${p.c},${a})`;
        ctx.lineWidth = p.size;
        ctx.beginPath();
        ctx.moveTo(p.x - p.vx * 0.045, p.y - p.vy * 0.045);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
      }

      for (const e of embers) {
        e.life -= dt;
        if (e.life <= 0) {
          spawnEmber(e);
          continue;
        }
        e.x += (e.vx + Math.sin(now / 900 + e.ph) * 10 * k) * dt;
        e.y += e.vy * dt;
        const t = e.life / e.max;
        const a = Math.sin(Math.PI * (1 - t)) * 0.8;
        ctx.fillStyle = `rgba(255,${160 + ((e.ph * 16) | 0)},80,${a})`;
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
   The painting itself moves (WebGL). Coordinates below are fractions of the image.
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
float ell(vec2 uv, vec2 c, vec2 r){ return 1. - smoothstep(.6, 1., length((uv-c)/r)); }
// a boat rocking on the water: small bob + roll, softly masked to its box
vec2 boat(vec2 uv, vec2 c, vec2 hs, float ph, float t){
  vec2 d = (uv - c) / hs;
  float m = (1.-smoothstep(.7, 1., abs(d.x))) * (1.-smoothstep(.7, 1., abs(d.y)));
  return vec2(sin(t*.5+ph)*.0005, sin(t*.9+ph)*.0010 + d.x*sin(t*.7+ph*1.3)*.0014) * m;
}

void main(){
  vec2 uv = vUv;
  float t = uTime;
  vec3 c0 = texture2D(uTex, uv).rgb;
  float sat = max(c0.r, max(c0.g, c0.b)) - min(c0.r, min(c0.g, c0.b));

  // ---- river: flowing reflections ----
  float start = mix(.82, .735, smoothstep(.40, .46, uv.x)) + (1.-smoothstep(.12, .18, uv.x))*.05;
  float wm = smoothstep(start, start+.05, uv.y);
  float depth = clamp((uv.y-.735)/.265, 0., 1.);
  float refl = smoothstep(.12, .5, lum(c0));
  vec2 q = vec2(uv.x*34., uv.y*(110.+depth*60.));
  float n1 = fbm(q + vec2(t*.34, t*.55));
  float n2 = fbm(q*1.8 + vec2(-t*.26, t*.42) + 7.);
  vec2 off = vec2((n1-.5)*.0085, (n2-.5)*.0032) * wm * (.35+depth*1.1) * (.3+.7*refl);
  off.x += sin(uv.y*170. + t*1.4 + uv.x*9.) * .0007 * wm * (.4+depth);

  // ---- boats rock ----
  off += boat(uv, vec2(.333,.771), vec2(.085,.055), 0.0, t);
  off += boat(uv, vec2(.509,.745), vec2(.036,.026), 1.7, t);
  off += boat(uv, vec2(.707,.748), vec2(.055,.026), 3.1, t);
  off += boat(uv, vec2(.840,.746), vec2(.030,.020), 4.4, t);
  off += boat(uv, vec2(.930,.766), vec2(.056,.032), 5.6, t);

  // ---- people on the ghat sway gently (only the saturated clothes move) ----
  float cm = smoothstep(.0, .03, uv.x) * (1.-smoothstep(.30, .34, uv.x)) * smoothstep(.56, .60, uv.y) * (1.-smoothstep(.76, .80, uv.y));
  float cw = cm * smoothstep(.25, .5, sat);
  off += vec2(sin(t*1.5 + uv.x*260. + uv.y*40.)*.0008, sin(t*2.1 + uv.x*340.)*.0004) * cw;

  // ---- sky: clouds drift, their light shifts ----
  float sm = smoothstep(.14, .30, uv.x) * (1.-smoothstep(.26, .36, uv.y));
  vec2 so = (vec2(fbm(uv*3.+vec2(t*.02,0.)), fbm(uv*3.+vec2(0.,t*.015)+5.)) - .5) * .006 * sm;

  vec2 u2 = uv + off + so;
  vec3 col = texture2D(uTex, u2).rgb;

  // ---- crispness ----
  vec3 tight = ring(u2, 3.);
  if(uQ > .5) col += (col - tight) * .28; else col = mix(col, tight, .5);

  // ---- diyas, windows and garlands flicker (only small bright points, never broad glow) ----
  vec3 r9 = ring(u2, 10.);
  float L = lum(col);
  float warm = smoothstep(0., .22, col.r - col.b);
  float lampness = smoothstep(.05, .22, L - lum(r9));
  float f = h21(floor(uv*vec2(210.,118.)));
  float fl = .80 + .30*sin(t*(1.6+f*4.5)+f*60.) + .12*sin(t*9.+f*13.);
  col *= mix(1., fl, lampness * warm * .8);

  // ---- fireworks in the painting twinkle ----
  float fw = max(max(ell(uv, vec2(.175,.14), vec2(.12,.17)), ell(uv, vec2(.25,.26), vec2(.05,.07))),
                 max(ell(uv, vec2(.335,.385), vec2(.05,.07)), ell(uv, vec2(.908,.30), vec2(.09,.22))));
  float tw = .8 + .4*sin(t*(3.+f*6.) + f*50.);
  col *= mix(1., tw, fw * smoothstep(.55, .9, L) * lampness * 1.2);

  // ---- soft bloom on real highlights only ----
  vec3 g = max(r9 - .70, 0.) * .45;
  if(uQ > .5) g += max(ring(u2, 30.) - .62, 0.) * .5;
  col += g * vec3(1., .82, .6) * mix(1., fl, .4);

  // ---- sun glitter path on the water ----
  float w = .010 + depth*.035;
  float ga = exp(-pow((uv.x - .757 + (n1-.5)*.018) / w, 2.));
  float sp = smoothstep(.50, .90, vn(vec2(uv.x*300., uv.y*420.) + vec2(t*.7, t*.35)) * (.6 + .8*vn(vec2(uv.x*520., uv.y*700.) - t*.5)));
  col += vec3(1., .92, .72) * sp * ga * wm * .65;

  // ---- general water glints ----
  float a = vn(vec2(uv.x*230., uv.y*340.) + vec2(t*.6, t*.2));
  float b = vn(vec2(uv.x*410., uv.y*620.) - vec2(t*.4, 0.));
  col += vec3(1., .85, .6) * smoothstep(.80, .97, a*b*1.6) * wm * smoothstep(.25, .6, L) * .4;

  // ---- cloud light breathes ----
  float cl = fbm(uv*vec2(3., 2.2) + vec2(t*.03, t*.01));
  col *= 1. + (cl-.5) * .4 * sm;

  // ---- grade (keep the picture's vivid colour) + fine grain ----
  col = mix(vec3(lum(col)), col, 1.08);
  col += (h21(gl_FragCoord.xy + fract(t)*97.) - .5) * .012;
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
      cv.height = Math.round((cv.clientHeight || cssW * 0.563) * scale);
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

const v = (o: Record<string, string | number>) => o as unknown as CSSProperties;

export function GoldenDawn() {
  const imgRef = useRef<HTMLImageElement>(null);
  return (
    <div className="r-layer r-mist d-root">
      <div className="d-frame">
        <div className="d-stage">
          <img ref={imgRef} className="d-img" src={ghat} alt="" decoding="async" draggable={false} />
          <DawnGL imgRef={imgRef} />

          {/* the sun: breathing halo, a thin lens streak and slow rays */}
          <div className="d-rays" />
          <div className="d-sunhalo" />
          <div className="d-flare" />

          {/* low mist drifting over the river and through the ghat */}
          <div className="d-mist" />
          <div className="d-mist d-mist-b" />

          {/* river life */}
          <div className="d-group d-floaters">
            {FLOATERS.map((f, i) => (
              <span key={i} className="d-float" style={v({ left: `${f.x}%`, top: `${f.y}%`, "--w": `${f.w}%`, "--dur": `${f.dur}s`, "--dl": `${f.dl}s`, "--dx": `${f.dx}cqw` })}>
                <i />
              </span>
            ))}
          </div>
          <div className="d-group d-farboats">
            {FAR_BOATS.map((b, i) => (
              <span key={i} className="d-farboat" style={v({ left: `${b.x}%`, top: `${b.y}%`, "--w": `${b.w}%`, "--dur": `${b.dur}s`, "--dl": `${b.dl}s`, "--dx": `${b.dx}cqw` })}>
                <i />
              </span>
            ))}
          </div>

          {/* people crossing the bridge */}
          <div className="d-group d-walkers">
            {WALKERS.map((p, i) => (
              <span key={i} className="d-walker" style={v({ left: `${p.x}%`, "--dur": `${p.dur}s`, "--dl": `${p.dl}s`, animationDirection: p.dir })}>
                <i />
              </span>
            ))}
          </div>

          {/* sky lanterns */}
          <div className="d-group d-lanterns">
            {LANTERNS.map((l, i) => (
              <span key={i} className="d-lantern" style={v({ left: `${l.x}%`, "--w": `${l.w}%`, "--dur": `${l.dur}s`, "--dl": `${l.dl}s`, "--dx": `${l.dx}cqw`, "--sw": `${l.sw}s` })}>
                <i />
              </span>
            ))}
          </div>

          {/* birds */}
          <div className="d-group d-flocks">
            {FLOCKS.map((f, i) => (
              <div key={i} className="d-flock" style={v({ top: `${f.top}%`, "--dur": `${f.dur}s`, "--dl": `${f.dl}s`, "--s": f.s })}>
                {Array.from({ length: f.n }, (_, j) => (
                  <svg key={j} className="d-bird" viewBox="0 0 24 10" style={{ left: `${j * 3.1}cqw`, top: `${(j % 2) * 1.5 + j * 0.45}cqw`, animationDelay: `${-j * 0.17}s` }}>
                    <path d="M1 8 Q6 0 12 6 Q18 0 23 8" fill="none" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                ))}
              </div>
            ))}
          </div>

          <Sparks />
        </div>
      </div>

      {/* fixed grade: keeps text readable but lets the colours stay vivid */}
      <div className="d-grade" />
    </div>
  );
}
