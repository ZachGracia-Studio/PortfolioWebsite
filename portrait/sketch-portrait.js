/*
  <sketch-portrait> — drop-in web component. No dependencies.
  Usage:
    <script src="sketch-portrait.js"></script>
    <sketch-portrait src="zg-portrait.png" variant="disciplined" duration="3" trigger="view" hover="on" alt="Zach Gracia"></sketch-portrait>
  Attributes:
    variant   disciplined | expressive | hatched
    stages    optional comma-separated process images (e.g. thumbnail, gesture, line art), same framing as src.
              When set, each stage traces on in order before the final tone resolves.
    duration  seconds (default 3)
    trigger   view (on scroll into view) | load | none (call el.play())
    hover     on | off  (re-sketch on hover after first play)
  Renders graphite as transparent ink, so it sits on any light paper surface.
  Fires "sketchend" when done.

  <animation-sheets> — the same drawing presented as a stack of pegged animation sheets on a lightbox.
    <animation-sheets src="zg-portrait.webp" stages="rough.webp,tiedown.webp,line.webp" duration="6" trigger="static"
      alt="Sketch portrait of Zach Gracia on a pegged animation sheet"><img src="zg-sheet-final.png" alt="Sketch portrait of Zach Gracia on a pegged animation sheet"></animation-sheets>
    Static-first: rests on the finished tone sheet. Click, tap or Enter plays the four-sheet sequence.
    tone / crown (+ tone-sm / crown-sm for phones): pre-baked final graphite + hair cut-out. When set, nothing is
    processed on load; drawings are analysed on hover/focus/touch (idle) or on first play.
    trigger  static (default) | dwell (also auto-plays once after dwell="8" seconds in view) | view | load | none
    Light-DOM <img> child is the no-JS fallback. Margin copy comes from STORY; override with a story='[...]' JSON attribute.
    Set --hole to your page background so the peg holes read as punched through. Respects prefers-reduced-motion.
    tone should be an opaque ink-on-white image (multiplied onto the paper); crown keeps alpha.
    Fonts load from fonts="…/" (default: a fonts/ folder next to src). Analysis runs in a Web Worker when tone is baked.
    If any drawing fails to load (404, CORS), the sheet stays static and stops acting as a button.
*/
(function () {
  const S = Math.min(screen.width, screen.height) < 700 ? 480 : 640;
  const clamp = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);
  const ss = (a, b, x) => { x = clamp((x - a) / (b - a)); return x * x * (3 - 2 * x); };
  const ease = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
  const easeS = (x) => -(Math.cos(Math.PI * x) - 1) / 2;
  const seeded = (s) => () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
  const cache = {};

  // pure analysis (no DOM) — shared by the main thread and the worker
  function core(S) {
    const clamp = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);
    const ss = (a, b, x) => { x = clamp((x - a) / (b - a)); return x * x * (3 - 2 * x); };
    const easeS = (x) => -(Math.cos(Math.PI * x) - 1) / 2;
    const seeded = (s) => () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
    function boxBlur(src, R, passes) {
      let b = src.slice();
      for (let pass = 0; pass < passes; pass++) {
        const t = new Float32Array(S * S);
        for (let y = 0; y < S; y++) { let acc = 0; for (let x = -R; x < S; x++) { if (x + R < S) acc += b[y * S + x + R]; if (x - R - 1 >= 0) acc -= b[y * S + x - R - 1]; if (x >= 0) t[y * S + x] = acc / (2 * R + 1); } }
        const o = new Float32Array(S * S);
        for (let x = 0; x < S; x++) { let acc = 0; for (let y = -R; y < S; y++) { if (y + R < S) acc += t[(y + R) * S + x]; if (y - R - 1 >= 0) acc -= t[(y - R - 1) * S + x]; if (y >= 0) o[y * S + x] = acc / (2 * R + 1); } }
        b = o;
      }
      return b;
    }
    function pct(arr, p) {
      const s = [];
      for (let i = 0; i < arr.length; i += 7) s.push(arr[i]);
      s.sort((a, b) => a - b);
      return s[Math.floor(s.length * p)];
    }
    function analyzeCore(px) {
      const N = S * S, rnd = seeded(7);
      const g = new Float32Array(N);
      for (let i = 0; i < N; i++) g[i] = (px[i * 4] * 0.299 + px[i * 4 + 1] * 0.587 + px[i * 4 + 2] * 0.114) / 255;
      const white = pct(g, 0.97);
      const d = new Float32Array(N);
      for (let i = 0; i < N; i++) d[i] = clamp(((white - g[i]) / (white * 0.97) - 0.035) / 0.965);
      let b = g.slice();
      for (let pass = 0; pass < 2; pass++) {
        const o = b.slice();
        for (let y = 1; y < S - 1; y++) for (let xx = 1; xx < S - 1; xx++) {
          const i = y * S + xx;
          o[i] = (b[i - S - 1] + b[i - S] + b[i - S + 1] + b[i - 1] + b[i] + b[i + 1] + b[i + S - 1] + b[i + S] + b[i + S + 1]) / 9;
        }
        b = o;
      }
      const gx = new Float32Array(N), gy = new Float32Array(N), mag = new Float32Array(N);
      for (let y = 1; y < S - 1; y++) for (let xx = 1; xx < S - 1; xx++) {
        const i = y * S + xx;
        const ax = b[i - S + 1] + 2 * b[i + 1] + b[i + S + 1] - b[i - S - 1] - 2 * b[i - 1] - b[i + S - 1];
        const ay = b[i + S - 1] + 2 * b[i + S] + b[i + S + 1] - b[i - S - 1] - 2 * b[i - S] - b[i - S + 1];
        gx[i] = ax; gy[i] = ay; mag[i] = Math.hypot(ax, ay);
      }
      const mp = pct(mag, 0.985) || 1;
      const edge = new Float32Array(N), ink = new Float32Array(N);
      for (let i = 0; i < N; i++) {
        const X = i % S, Y = (i / S) | 0;
        if (X < 5 || Y < 5 || X >= S - 5 || Y >= S - 5) continue;
        edge[i] = clamp(mag[i] / mp); ink[i] = ss(0.16, 0.6, edge[i]) * 0.95;
      }
      const G = 18, gs = S / (G - 2), grid = new Float32Array(G * G);
      for (let i = 0; i < grid.length; i++) grid[i] = rnd();
      const noise = new Float32Array(N);
      for (let y = 0; y < S; y++) for (let xx = 0; xx < S; xx++) {
        const fx = xx / gs, fy = y / gs, ix = fx | 0, iy = fy | 0, tx = easeS(fx - ix), ty = easeS(fy - iy);
        const a = grid[iy * G + ix], bb = grid[iy * G + ix + 1], cc = grid[(iy + 1) * G + ix], dd = grid[(iy + 1) * G + ix + 1];
        noise[y * S + xx] = ((a + (bb - a) * tx) * (1 - ty) + (cc + (dd - cc) * tx) * ty) * 0.75 + rnd() * 0.25;
      }
      const vis = new Uint8Array(N), seeds = [];
      for (let i = 0; i < N; i++) if (edge[i] > 0.3) seeds.push(i);
      for (let i = seeds.length - 1; i > 0; i--) { const j = (rnd() * (i + 1)) | 0; [seeds[i], seeds[j]] = [seeds[j], seeds[i]]; }
      const walk = (x0, y0, sign) => {
        const pts = []; let X = x0, Y = y0, pX = 0, pY = 0;
        for (let k = 0; k < 80; k++) {
          const ix = X | 0, iy = Y | 0;
          if (ix < 1 || iy < 1 || ix >= S - 1 || iy >= S - 1) break;
          const i = iy * S + ix;
          if (edge[i] < 0.16 || vis[i]) break;
          let tx = -gy[i], ty = gx[i], l = Math.hypot(tx, ty);
          if (l < 1e-6) break;
          tx /= l; ty /= l;
          if (k === 0) { tx *= sign; ty *= sign; }
          else {
            if (tx * pX + ty * pY < 0) { tx = -tx; ty = -ty; }
            tx = tx * 0.6 + pX * 0.4; ty = ty * 0.6 + pY * 0.4; l = Math.hypot(tx, ty); tx /= l; ty /= l;
          }
          pts.push(X, Y);
          pX = tx; pY = ty; X += tx * 1.5; Y += ty * 1.5;
        }
        return pts;
      };
      const strokes = [];
      for (const s of seeds) {
        if (vis[s] || strokes.length > 4000) continue;
        const x0 = s % S + 0.5, y0 = ((s / S) | 0) + 0.5;
        const f = walk(x0, y0, 1), bk = walk(x0, y0, -1);
        const pts = [];
        for (let k = bk.length - 2; k >= 2; k -= 2) pts.push(bk[k], bk[k + 1]);
        for (let k = 0; k < f.length; k++) pts.push(f[k]);
        for (let k = 0; k < pts.length; k += 2) {
          const i = (pts[k + 1] | 0) * S + (pts[k] | 0);
          for (let oy = -1; oy <= 1; oy++) for (let ox = -1; ox <= 1; ox++) vis[i + oy * S + ox] = 1;
        }
        if (pts.length < 12) continue;
        let cx = 0, cy = 0;
        for (let k = 0; k < pts.length; k += 2) { cx += pts[k]; cy += pts[k + 1]; }
        strokes.push({ pts: new Float32Array(pts), cx: cx / (pts.length / 2) / S, cy: cy / (pts.length / 2) / S, r: rnd() });
      }
      return { d, ink, noise, strokes, white };
    }
    function hatchesForm(d, noise) {
      const rnd = seeded(31);
      const b = boxBlur(d, 7, 2);
      const dg = -0.8, DX = Math.cos(dg), DY = Math.sin(dg);
      const dir = (x, y, rot, mix) => {
        const ix = Math.max(1, Math.min(S - 2, x | 0)), iy = Math.max(1, Math.min(S - 2, y | 0)), i = iy * S + ix;
        let tx = -(b[i + S] - b[i - S]), ty = b[i + 1] - b[i - 1], l = Math.hypot(tx, ty);
        if (l < 1e-5) { tx = DX; ty = DY; } else { tx /= l; ty /= l; }
        const c = Math.cos(rot), sn = Math.sin(rot), rx = tx * c - ty * sn, ry = tx * sn + ty * c;
        let fx = rx, fy = ry; if (fx * DX + fy * DY < 0) { fx = -fx; fy = -fy; }
        fx = fx * (1 - mix) + DX * mix; fy = fy * (1 - mix) + DY * mix; l = Math.hypot(fx, fy);
        return [fx / l, fy / l];
      };
      const passes = [{ thr: 0.1, sp: 4.4, al: 0.5, rot: 0, mix: 0.45 }, { thr: 0.4, sp: 4.8, al: 0.4, rot: 0.95, mix: 0.35 }, { thr: 0.68, sp: 5.2, al: 0.4, rot: -0.55, mix: 0.3 }];
      const list = [];
      passes.forEach((P, pi) => {
        for (let gy = 6; gy < S - 6; gy += P.sp) for (let gx = 6; gx < S - 6; gx += P.sp) {
          const x = gx + rnd() * P.sp, y = gy + rnd() * P.sp, i = (y | 0) * S + (x | 0);
          if (d[i] + (noise[i] - 0.5) * 0.22 <= P.thr) continue;
          const len = 10 + rnd() * 16, st = len / 6, f = [], bk = [];
          let X = x, Y = y;
          for (let k = 0; k < 3; k++) { const [a, c] = dir(X, Y, P.rot, P.mix); X += a * st; Y += c * st; f.push(X, Y); }
          X = x; Y = y;
          for (let k = 0; k < 3; k++) { const [a, c] = dir(X, Y, P.rot, P.mix); X -= a * st; Y -= c * st; bk.push(X, Y); }
          const pts = [];
          for (let k = bk.length - 2; k >= 0; k -= 2) pts.push(bk[k], bk[k + 1]);
          pts.push(x, y); for (let k = 0; k < f.length; k++) pts.push(f[k]);
          list.push({ pts, p: pi, o: pi * 0.3 + (y / S * 0.55 + rnd() * 0.45) * 0.7 });
        }
      });
      list.sort((a, c) => a.o - c.o);
      return { list, passes };
    }
    return { analyzeCore, hatchesForm, boxBlur };
  }
  const C = core(S);
  const WSRC = 'const C=(' + core.toString() + ')(' + S + ');onmessage=function(e){var r=C.analyzeCore(e.data.px);if(e.data.hatch)r.hatchF=C.hatchesForm(r.d,r.noise);postMessage(r);};';
  let WURL = null;
  const cacheL = {};
  // decode on the main thread (cheap), analyse in a worker so first play never blocks scrolling or input
  function prepLite(src, hatch) {
    const key = src + (hatch ? '#h' : '');
    if (!cacheL[key]) cacheL[key] = new Promise((res, rej) => {
      const im = new Image();
      im.crossOrigin = 'anonymous'; im.decoding = 'async';
      im.onerror = rej;
      im.onload = () => {
        let px;
        try {
          const c = document.createElement('canvas'); c.width = c.height = S;
          const x = c.getContext('2d', { willReadFrequently: true }), r = Math.max(S / im.width, S / im.height);
          x.fillStyle = '#fff'; x.fillRect(0, 0, S, S);
          x.drawImage(im, (S - im.width * r) / 2, (S - im.height * r) / 2, im.width * r, im.height * r);
          px = x.getImageData(0, 0, S, S).data;
        } catch (e) { rej(e); return; }
        const local = () => { const r = C.analyzeCore(px); if (hatch) r.hatchF = C.hatchesForm(r.d, r.noise); r.keys = {}; return r; };
        let w;
        try { WURL = WURL || URL.createObjectURL(new Blob([WSRC], { type: 'text/javascript' })); w = new Worker(WURL); }
        catch (e) { try { res(local()); } catch (er) { rej(er); } return; }
        w.onmessage = (e) => { w.terminate(); e.data.keys = {}; res(e.data); };
        w.onerror = (e) => { e.preventDefault(); w.terminate(); try { res(local()); } catch (er) { rej(er); } };
        w.postMessage({ px, hatch });
      };
      im.src = src;
    }).catch((e) => { delete cacheL[key]; throw e; });
    return cacheL[key];
  }

  // top band of the drawing on a paper-coloured cut-out, so hair can break above the sheet edge on a dark page
  function crown(d, inkCanvas, M) {
    const sil = new Float32Array(S * S);
    for (let i = 0; i < sil.length; i++) sil[i] = d[i] > 0.05 ? 1 : 0;
    const b = C.boxBlur(sil, Math.round(S * 0.012), 2);
    const c = document.createElement('canvas'); c.width = c.height = S;
    const x = c.getContext('2d'), id = x.createImageData(S, S), p = id.data;
    for (let i = 0; i < S * S; i++) { p[i * 4] = 243; p[i * 4 + 1] = 241; p[i * 4 + 2] = 234; p[i * 4 + 3] = ss(0.12, 0.4, b[i]) * 255; }
    x.putImageData(id, 0, 0);
    const H = Math.round(M * 0.2), o = document.createElement('canvas'); o.width = M; o.height = H;
    const ox = o.getContext('2d');
    ox.drawImage(c, 0, 0, M, M); ox.drawImage(inkCanvas, 0, 0);
    return o.toDataURL('image/png');
  }

  function prep(src) {
    if (!cache[src]) cache[src] = new Promise((res, rej) => {
      const im = new Image();
      im.crossOrigin = 'anonymous';
      im.onload = () => res(analyze(im));
      im.onerror = rej;
      im.src = src;
    });
    return cache[src];
  }

  function analyze(im) {
    const c = document.createElement('canvas'); c.width = c.height = S;
    const x = c.getContext('2d', { willReadFrequently: true });
    const r = Math.max(S / im.width, S / im.height);
    x.fillStyle = '#fff'; x.fillRect(0, 0, S, S);
    x.drawImage(im, (S - im.width * r) / 2, (S - im.height * r) / 2, im.width * r, im.height * r);
    const A = C.analyzeCore(x.getImageData(0, 0, S, S).data), white = A.white;
    const M = Math.min(1600, Math.max(im.width, im.height)), hc = document.createElement('canvas');
    hc.width = hc.height = M;
    const hx = hc.getContext('2d'), hr = Math.max(M / im.width, M / im.height);
    hx.fillStyle = '#fff'; hx.fillRect(0, 0, M, M);
    hx.drawImage(im, (M - im.width * hr) / 2, (M - im.height * hr) / 2, im.width * hr, im.height * hr);
    const hd = hx.getImageData(0, 0, M, M), hp = hd.data;
    for (let i = 0; i < hp.length; i += 4) {
      const l = (hp[i] * 0.299 + hp[i + 1] * 0.587 + hp[i + 2] * 0.114) / 255;
      hp[i + 3] = clamp(((white - l) / (white * 0.97) - 0.035) / 0.965) * 255; hp[i] = 26; hp[i + 1] = 25; hp[i + 2] = 24;
    }
    hx.putImageData(hd, 0, 0);
    return Object.assign(A, { keys: {}, finalSrc: hc.toDataURL('image/png'), crownSrc: crown(A.d, hc, M) });
  }

  function toneKey(data, variant) {
    if (data.keys[variant]) return data.keys[variant];
    const { d, noise } = data, k = new Float32Array(S * S);
    const ca = Math.cos(-0.6), sa = Math.sin(-0.6);
    for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
      const i = y * S + x;
      if (variant === 'expressive') {
        const h = ((x * ca - y * sa) / 6 + noise[i] * 1.6) % 1, tri = Math.abs(h - 0.5) * 2;
        k[i] = d[i] * 0.55 + tri * 0.3 + noise[i] * 0.15;
      } else k[i] = d[i] * 0.75 + noise[i] * 0.25;
    }
    return (data.keys[variant] = k);
  }

  function hatches(data) {
    if (data.hatch) return data.hatch;
    const rnd = seeded(23), { d, noise } = data, out = [];
    const passes = [
      { a: -0.8, thr: 0.1, sp: 4.2, al: 0.5 },
      { a: 0.6, thr: 0.4, sp: 4.6, al: 0.4 },
      { a: -1.3, thr: 0.68, sp: 5, al: 0.4 },
    ];
    passes.forEach((P, pi) => {
      const dx = Math.cos(P.a), dy = Math.sin(P.a), nx = -dy, ny = dx, L = S * 0.75, c = S / 2;
      for (let o = -L; o < L; o += P.sp * (0.8 + rnd() * 0.4)) {
        let seg = null, target = 18 + rnd() * 40;
        const close = () => {
          if (seg && seg.len > 6) {
            const j = () => (rnd() - 0.5) * 4, bow = (rnd() - 0.5) * 2.4;
            const x0 = seg.x0 - dx * rnd() * 3, y0 = seg.y0 - dy * rnd() * 3, x1 = seg.x1 + dx * rnd() * 3, y1 = seg.y1 + dy * rnd() * 3;
            const cy0 = (y0 + y1) / 2;
            out.push({ x0, y0, mx: (x0 + x1) / 2 + nx * bow, my: cy0 + ny * bow, x1, y1, p: pi, o: pi * 0.3 + (cy0 / S * 0.55 + rnd() * 0.45) * 0.7 });
          }
          seg = null; target = 18 + rnd() * 40;
        };
        for (let t = -L; t <= L; t += 2) {
          const x = c + nx * o + dx * t, y = c + ny * o + dy * t;
          let on = false;
          if (x >= 6 && y >= 6 && x < S - 6 && y < S - 6) { const i = (y | 0) * S + (x | 0); on = d[i] + (noise[i] - 0.5) * 0.22 > P.thr; }
          if (on) {
            if (!seg) seg = { x0: x, y0: y, len: 0 };
            seg.x1 = x; seg.y1 = y; seg.len += 2;
            if (seg.len >= target) close();
          } else if (seg) close();
        }
        close();
      }
    });
    out.sort((a, b) => a.o - b.o);
    return (data.hatch = { list: out, passes });
  }

  function guides() {
    const rnd = seeded(11), out = [], J = () => (rnd() - 0.5) * 3;
    const ell = (cx, cy, rx, ry, a0, a1) => {
      const p = [];
      for (let t = a0; t <= a1; t += 0.04) p.push((cx + Math.cos(t) * rx) * S + J() * 0.4, (cy + Math.sin(t) * ry) * S + J() * 0.4);
      return p;
    };
    const line = (x0, y0, x1, y1) => {
      const p = [];
      for (let t = -0.04; t <= 1.04; t += 0.02) p.push((x0 + (x1 - x0) * t) * S + J() * 0.3, (y0 + (y1 - y0) * t) * S + J() * 0.3);
      return p;
    };
    out.push(ell(0.515, 0.385, 0.19, 0.28, -Math.PI * 0.6, Math.PI * 1.45));
    out.push(ell(0.52, 0.39, 0.182, 0.27, -Math.PI * 0.4, Math.PI * 1.2));
    out.push(line(0.535, 0.11, 0.525, 0.68));
    out.push(line(0.37, 0.36, 0.68, 0.355));
    out.push(line(0.43, 0.52, 0.63, 0.515));
    out.push(ell(0.5, 0.98, 0.42, 0.36, Math.PI * 1.05, Math.PI * 1.95));
    return out.map((p) => ({ pts: new Float32Array(p) }));
  }

  class SketchPortrait extends HTMLElement {
    connectedCallback() {
      if (this._init) return;
      this._init = true;
      const root = this.attachShadow({ mode: 'open' });
      root.innerHTML = '<style>:host{display:block;position:relative;aspect-ratio:1/1}canvas,img{position:absolute;inset:0;width:100%;height:100%;display:block}img{opacity:0}canvas{transition:opacity .45s ease}</style><img draggable="false"><canvas></canvas>';
      this.img = root.querySelector('img');
      this.cv = root.querySelector('canvas');
      this.cv.width = this.cv.height = S;
      this.img.alt = this.getAttribute('alt') || '';
      const src = this.getAttribute('src');
      this.img.src = src;
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
        prep(src).then((d) => { this.img.src = d.finalSrc; this.showFinal(); }).catch(() => this.showFinal());
        return;
      }
      const stages = (this.getAttribute('stages') || '').split(',').map((x) => x.trim()).filter(Boolean);
      this.ready = Promise.all([prep(src), ...stages.map(prep)]).then(([data, ...sd]) => { this.data = data; this.stageData = sd; this.img.src = data.finalSrc; return data; }).catch(() => this.showFinal());
      const trig = this.getAttribute('trigger') || 'view';
      if (trig === 'load') this.ready.then(() => this.play());
      else if (trig === 'view') {
        this.io = new IntersectionObserver((es) => {
          if (es.some((e) => e.isIntersecting)) { this.io.disconnect(); this.ready.then(() => this.play()); }
        }, { threshold: 0.35 });
        this.io.observe(this);
      }
      this.addEventListener('pointerenter', () => {
        if (this.done && this.getAttribute('hover') !== 'off') this.play(this.dur() * 0.7);
      });
    }
    disconnectedCallback() { this.io && this.io.disconnect(); cancelAnimationFrame(this.raf); }
    dur() { return Math.max(0.5, parseFloat(this.getAttribute('duration')) || 3); }
    showFinal() { this.img.style.opacity = 1; this.cv.style.opacity = 0; this.done = true; }

    finish() {
      this.img.style.opacity = 1;
      void this.cv.offsetWidth;
      this.cv.style.transition = 'opacity .45s ease';
      this.cv.style.opacity = 0;
      this.done = true;
      this.dispatchEvent(new CustomEvent('sketchend'));
    }

    // Process mode: real drawing stages (thumbnail → gesture → line) trace on, then hatching resolves the final tone.
    playProcess(seconds) {
      const data = this.data, N = S * S, D = (seconds || this.dur()) * 1000, H = hatches(data);
      this.done = false;
      this.img.style.opacity = 0;
      this.cv.style.transition = 'none'; this.cv.style.opacity = 1;
      const mk = () => { const c = document.createElement('canvas'); c.width = c.height = S; const x = c.getContext('2d', { willReadFrequently: true }); x.lineCap = x.lineJoin = 'round'; return x; };
      const n = this.stageData.length;
      const TL = n === 3
        ? [{ d: [0, 0.2], f: [0.26, 0.46] }, { d: [0.17, 0.42], f: [0.47, 0.68] }, { d: [0.4, 0.64], f: [0.8, 0.99] }]
        : this.stageData.map((_, k) => { const a = (k / n) * 0.6, b = a + 0.62 / n; return { d: [a, b], f: [b + 0.06, k === n - 1 ? 0.99 : b + 0.24] }; });
      const TH = { h: [0.56, 0.9], f: [0.84, 1], sf: [0.86, 1] };
      const layers = this.stageData.map((sd, k) => {
        if (!sd.inkS) { sd.inkS = new Float32Array(N); for (let i = 0; i < N; i++) sd.inkS[i] = clamp((sd.d[i] - 0.07) / 0.75); }
        const m = mk(); m.lineWidth = k < n - 1 ? 3.6 : 2.8; m.strokeStyle = '#000';
        const late = k === n - 1;
        const list = sd.strokes.map((s) => ({ s, o: late ? Math.hypot(s.cx - 0.52, (s.cy - 0.4) * 1.1) / 0.7 * 0.85 + s.r * 0.15 : s.cy * 0.5 + s.r * 0.5 }));
        list.sort((a, b) => a.o - b.o);
        return { m, list, ink: sd.inkS, drawn: new Int32Array(list.length), W: 0.12, arr: null, t: TL[k] };
      });
      const tmask = mk(), sketch = mk();
      const out = this.cv.getContext('2d'), buf = out.createImageData(S, S), o = buf.data;
      for (let i = 0; i < N; i++) { o[i * 4] = 26; o[i * 4 + 1] = 25; o[i * 4 + 2] = 24; }
      const ph = (u, r) => clamp((u - r[0]) / (r[1] - r[0]));
      let hDone = 0, hA = null;
      const t0 = performance.now();
      const frame = (now) => {
        const u = clamp((now - t0) / D);
        const act = [];
        layers.forEach((L) => {
          const pd = easeS(ph(u, L.t.d)), fade = 1 - ss(0, 1, ph(u, L.t.f));
          if (fade <= 0) return;
          if (u >= L.t.d[0]) {
            let changed = false, nL = L.list.length;
            L.m.beginPath();
            for (let k = 0; k < nL; k++) {
              const st = (k / nL) * (1 - L.W);
              if (pd < st) break;
              const p = L.list[k].s.pts, m = p.length / 2, tg = Math.floor(clamp((pd - st) / L.W) * (m - 1));
              if (tg <= L.drawn[k]) continue;
              const a = L.drawn[k];
              L.m.moveTo(p[a * 2], p[a * 2 + 1]);
              for (let j = a + 1; j <= tg; j++) L.m.lineTo(p[j * 2], p[j * 2 + 1]);
              L.drawn[k] = tg; changed = true;
            }
            L.m.stroke();
            if (changed || !L.arr) L.arr = L.m.getImageData(0, 0, S, S).data;
          }
          // soft fill-in at the end of each stage catches lines the tracer missed
          const fill = ss(0.7, 1, ph(u, L.t.d));
          if (L.arr) act.push({ a: L.arr, ink: L.ink, fade, fill });
        });
        const ph2 = ph(u, TH.h), tgt = Math.floor(ph2 * H.list.length);
        if (tgt > hDone) {
          for (let p = 0; p < 3; p++) {
            const P = H.passes[p];
            tmask.beginPath(); sketch.beginPath();
            for (let k = hDone; k < tgt; k++) {
              const h = H.list[k];
              if (h.p !== p) continue;
              tmask.moveTo(h.x0, h.y0); tmask.quadraticCurveTo(h.mx, h.my, h.x1, h.y1);
              sketch.moveTo(h.x0, h.y0); sketch.quadraticCurveTo(h.mx, h.my, h.x1, h.y1);
            }
            tmask.lineWidth = P.sp * 1.3; tmask.strokeStyle = 'rgba(0,0,0,' + P.al + ')'; tmask.stroke();
            sketch.lineWidth = 0.9; sketch.strokeStyle = 'rgba(28,26,24,.2)'; sketch.stroke();
          }
          hDone = tgt;
          hA = tmask.getImageData(0, 0, S, S).data;
        }
        const tf = ss(0, 1, ph(u, TH.f)), d = data.d;
        for (let i = 0; i < N; i++) {
          let keep = 1;
          for (let k = 0; k < act.length; k++) {
            const A = act[k], m = Math.max(A.a[i * 4 + 3] / 255, A.fill);
            keep *= 1 - m * A.ink[i] * A.fade * 0.9;
          }
          const ta = 1 - (1 - (hA ? hA[i * 4 + 3] / 255 : 0)) * (1 - tf);
          keep *= 1 - d[i] * ta;
          o[i * 4 + 3] = (1 - keep) * 255;
        }
        out.putImageData(buf, 0, 0);
        const sa = 1 - ss(0, 1, ph(u, TH.sf));
        if (hDone && sa > 0) { out.globalAlpha = sa; out.drawImage(sketch.canvas, 0, 0); out.globalAlpha = 1; }
        if (u < 1) this.raf = requestAnimationFrame(frame);
        else this.finish();
      };
      this.raf = requestAnimationFrame(frame);
    }

    play(seconds) {
      if (!this.data) { this.ready && this.ready.then(() => this.play(seconds)); return; }
      cancelAnimationFrame(this.raf);
      if (this.stageData && this.stageData.length) { this.playProcess(seconds); return; }
      const data = this.data, va = this.getAttribute('variant');
      const variant = va === 'expressive' || va === 'hatched' ? va : 'disciplined';
      const ex = variant === 'expressive', hx = variant === 'hatched', D = (seconds || this.dur()) * 1000, N = S * S;
      const key = hx ? null : toneKey(data, variant);
      const H = hx ? hatches(data) : null;
      this.done = false;
      this.img.style.opacity = 0;
      this.cv.style.transition = 'none'; this.cv.style.opacity = 1;

      const mk = () => { const c = document.createElement('canvas'); c.width = c.height = S; const x = c.getContext('2d', { willReadFrequently: true }); x.lineCap = x.lineJoin = 'round'; return x; };
      const mask = mk(), sketch = ex || hx ? mk() : null, tmask = hx ? mk() : null;
      let hDone = 0;
      mask.lineWidth = ex ? 3.2 : 2.2; mask.strokeStyle = '#000';
      const out = this.cv.getContext('2d'), buf = out.createImageData(S, S), o = buf.data;
      for (let i = 0; i < N; i++) { o[i * 4] = 26; o[i * 4 + 1] = 25; o[i * 4 + 2] = 24; }

      // order strokes
      const st = data.strokes.map((s) => ({ s, o: ex ? s.cy * 0.45 + s.r * 0.55 : Math.hypot(s.cx - 0.52, (s.cy - 0.4) * 1.1) / 0.7 * 0.88 + s.r * 0.12 }));
      st.sort((a, b) => a.o - b.o);
      const W = ex ? 0.2 : 0.1, n = st.length;
      const start = st.map((_, k) => (k / n) * (1 - W));
      const drawn = new Int32Array(n).fill(0);
      const gd = ex ? guides() : [], gDrawn = new Int32Array(gd.length).fill(0);
      const wob = st.map(() => [(Math.random() - 0.5) * 3, (Math.random() - 0.5) * 3]);

      const T = ex
        ? { g: [0, 0.16], l: [0.08, 0.6], t: [0.34, 0.97], lf: [0.72, 0.97], sf: [0.6, 0.95], lo: 0.06 }
        : hx ? { l: [0, 0.45], h: [0.2, 0.86], f: [0.76, 1], lf: [0.68, 0.98], sf: [0.8, 1], lo: 1 }
        : { l: [0, 0.62], t: [0.36, 0.98], lf: [0.72, 0.98], lo: 0.12 };
      const ph = (u, r) => clamp((u - r[0]) / (r[1] - r[0]));
      const t0 = performance.now();

      const frame = (now) => {
        const u = clamp((now - t0) / D);
        // guides
        if (ex) {
          const pg = easeS(ph(u, T.g));
          sketch.strokeStyle = 'rgba(40,38,35,.32)'; sketch.lineWidth = 1;
          sketch.beginPath();
          gd.forEach((g, k) => {
            const f = clamp((pg - k / gd.length * 0.6) / 0.4), m = g.pts.length / 2, tg = Math.floor(f * (m - 1));
            if (tg <= gDrawn[k]) return;
            sketch.moveTo(g.pts[gDrawn[k] * 2], g.pts[gDrawn[k] * 2 + 1]);
            for (let j = gDrawn[k] + 1; j <= tg; j++) sketch.lineTo(g.pts[j * 2], g.pts[j * 2 + 1]);
            gDrawn[k] = tg;
          });
          sketch.stroke();
        }
        // contours
        const pl = easeS(ph(u, T.l));
        mask.beginPath();
        if (ex) { sketch.beginPath(); sketch.strokeStyle = 'rgba(30,28,26,.42)'; sketch.lineWidth = 0.9; }
        for (let k = 0; k < n; k++) {
          if (pl < start[k]) break;
          const p = st[k].s.pts, m = p.length / 2, tg = Math.floor(clamp((pl - start[k]) / W) * (m - 1));
          if (tg <= drawn[k]) continue;
          const a = drawn[k];
          mask.moveTo(p[a * 2], p[a * 2 + 1]);
          for (let j = a + 1; j <= tg; j++) mask.lineTo(p[j * 2], p[j * 2 + 1]);
          if (ex) {
            const [wx, wy] = wob[k];
            sketch.moveTo(p[a * 2] + wx, p[a * 2 + 1] + wy);
            for (let j = a + 1; j <= tg; j++) sketch.lineTo(p[j * 2] + wx, p[j * 2 + 1] + wy);
          }
          drawn[k] = tg;
        }
        mask.stroke();
        if (ex) sketch.stroke();

        // hatching: diagonal pencil passes build tone
        let hA = null, fill = 0;
        if (hx) {
          const L = H.list, ph2 = ph(u, T.h), tgt = Math.floor(ph2 * L.length);
          if (tgt > hDone) {
            for (let p = 0; p < 3; p++) {
              const P = H.passes[p];
              tmask.beginPath(); sketch.beginPath();
              for (let k = hDone; k < tgt; k++) {
                const h = L[k];
                if (h.p !== p) continue;
                tmask.moveTo(h.x0, h.y0); tmask.quadraticCurveTo(h.mx, h.my, h.x1, h.y1);
                sketch.moveTo(h.x0, h.y0); sketch.quadraticCurveTo(h.mx, h.my, h.x1, h.y1);
              }
              tmask.lineWidth = P.sp * 1.3; tmask.strokeStyle = 'rgba(0,0,0,' + P.al + ')'; tmask.stroke();
              sketch.lineWidth = 0.9; sketch.strokeStyle = 'rgba(28,26,24,.2)'; sketch.stroke();
            }
            hDone = tgt;
          }
          hA = tmask.getImageData(0, 0, S, S).data;
          fill = ss(0, 1, ph(u, T.f));
        }
        // composite
        const mA = mask.getImageData(0, 0, S, S).data;
        const tv = hx ? 0 : ease(ph(u, T.t)) * (1 + T.lo + 0.02), lf = 1 - ss(0, 1, ph(u, T.lf)), lo = T.lo;
        const { ink, d } = data;
        for (let i = 0; i < N; i++) {
          const lm = (mA[i * 4 + 3] / 255) * ink[i] * lf * 0.85;
          let ta;
          if (hx) ta = 1 - (1 - hA[i * 4 + 3] / 255) * (1 - fill);
          else { const z = (tv - key[i]) / lo; ta = z <= 0 ? 0 : z >= 1 ? 1 : z * z * (3 - 2 * z); }
          const td = d[i] * ta;
          o[i * 4 + 3] = (1 - (1 - lm) * (1 - td)) * 255;
        }
        out.putImageData(buf, 0, 0);
        if (ex || hx) {
          const sa = 1 - ss(0, 1, ph(u, T.sf));
          if (sa > 0) { out.globalAlpha = sa; out.drawImage(sketch.canvas, 0, 0); out.globalAlpha = 1; }
        }
        if (u < 1) this.raf = requestAnimationFrame(frame);
        else {
          this.img.style.opacity = 1;
          void this.cv.offsetWidth;
          this.cv.style.transition = 'opacity .45s ease';
          this.cv.style.opacity = 0;
          this.done = true;
          this.dispatchEvent(new CustomEvent('sketchend'));
        }
      };
      this.raf = requestAnimationFrame(frame);
    }
  }
  if (!customElements.get('sketch-portrait')) customElements.define('sketch-portrait', SketchPortrait);

  // ---------- <animation-sheets>: pegged animation-paper stack, one sheet per stage ----------
  function hatchesForm(data) { return data.hatchF || (data.hatchF = C.hatchesForm(data.d, data.noise)); }

  // self-hosted, latin subset; resolved next to the drawings unless fonts="…/" is set
  function ensureFont(base) {
    if (document.querySelector('style[data-sheets-font]')) return;
    const st = document.createElement('style');
    st.dataset.sheetsFont = '1';
    st.textContent = "@font-face{font-family:'Reenie Beanie';font-style:normal;font-weight:400;font-display:block;src:url(" + base + "reenie-beanie.woff2) format('woff2')}"
      + "@font-face{font-family:'IBM Plex Mono';font-style:normal;font-weight:500;font-display:swap;src:url(" + base + "ibm-plex-mono.woff2) format('woff2')}";
    document.head.appendChild(st);
  }

  const STORY = [
    { f: '01', ticks: ['05', '09', '13'], stamp: 'Z. GRACIA · SF', notes: ['find the character'] },
    { f: '15', ticks: ['17', '19'], stamp: 'Z. GRACIA · DISNEY · 2015', notes: ['commit to the line'] },
    { f: '20', ticks: ['22', '24'], x: 'x150', stamp: 'Z. GRACIA · SC 01 · TK 11', notes: ['on model'] },
    { f: '26', ticks: ['28', '', '', ''], open: true, stamp: 'Z. GRACIA · SC 02 →', notes: ['keep the weird'], later: true, date: '2026 10 7' },
  ];
  const HELMET = '<svg viewBox="0 0 30 30" fill="none" stroke="#6b6862" stroke-width="1" stroke-linecap="round"><path d="M15 3.5c6.6-.2 11.3 4.8 11.2 11.1-.1 6.4-5.1 10.9-11.4 10.8C8.6 25.3 3.7 20.7 3.9 14.4 4.1 8.2 8.9 3.6 15 3.5z"/><path d="M8.2 11.8c1.9-2.6 11.6-2.9 13.8.1.9 3.4-.4 6.9-6.9 7.1-6.5.1-8-3.6-6.9-7.2z"/><path d="M6 24.6c2.6 2 15.4 2.2 18.2-.2"/><path d="M22.7 6.1l2.4-2.6"/></svg>';
  const DRIFTER = '<svg viewBox="0 0 34 12" fill="none" stroke="#56544f" stroke-width=".9" stroke-linecap="round"><circle cx="6" cy="6" r="4.4"/><path d="M3.6 5.2c.9-1.2 3.8-1.3 4.8 0 .3 1.4-.5 2.5-2.4 2.5S3.3 6.6 3.6 5.2z"/><path d="M10.4 6.2h11"/><path d="M13 4.4v3.6M15.2 4.2v3.9M17.4 4.4v3.6"/><path d="M12.4 6.4l-1.6 4M14 6.2l1.8-4.4"/><path d="M21.4 6.2l6 -3.2 3.4.6M21.4 6.4l5.4 3.6 3.6-.4"/></svg>';

  const ARROW = '<svg viewBox="0 0 26 14" fill="none" stroke="#6f6c65" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="M1.5 9.5c5.5-5 13-6.2 21.6-3.4"/><path d="M18.4 2.6l4.8 3.6-4.4 3.9"/></svg>';
  const SHEET_CSS = `
:host{display:block;position:relative;aspect-ratio:540/454;container-type:inline-size;--paper:243,241,234;--hole:#141414;outline:none;cursor:pointer}
:host(:focus-visible){outline:2px solid #e5392b;outline-offset:8px}
.pad,.sheet{position:absolute;inset:0}
.pad{background:#e6e3db;box-shadow:0 34px 60px -28px rgba(0,0,0,.85),0 2px 5px rgba(0,0,0,.4)}
.pad.a{transform:translate(.7%,1.1%) rotate(.7deg)}
.pad.b{background:#ebe8e1;transform:translate(-.5%,.5%) rotate(-.45deg)}
.sheet{background:rgba(var(--paper),.8);box-shadow:0 1px 2px rgba(0,0,0,.18);will-change:transform,opacity}
.sheet.first{background:rgb(var(--paper))}
.x{position:absolute;width:6cqw;height:6cqw}
.x::before,.x::after{content:"";position:absolute;background:#77756f}
.x::before{left:50%;top:0;bottom:0;width:1px}.x::after{top:50%;left:0;right:0;height:1px}
.peg{position:absolute;bottom:2.2%;height:2.8%;background:var(--hole);display:grid;place-items:center;overflow:hidden}
.ghost{height:78%;opacity:0;transition:opacity .6s ease}.ghost svg{height:100%;display:block}
.sheet.rest .ghost{opacity:.6}:host(:hover) .sheet.rest .ghost,:host(:focus-visible) .sheet.rest .ghost{opacity:1}
.hand{position:absolute;font-family:'Reenie Beanie',cursive;color:#77746d;line-height:.95}
.num{right:4.5%;bottom:3%;width:9cqw;height:6.6cqw;font-size:5.4cqw;color:#3f3d39;border:1.4px solid #3f3d39;border-radius:50%;display:grid;place-items:center;transform:rotate(-7deg)}
.chart{position:absolute;right:7.5%;top:7%;width:7cqw;height:36%}
.chart .ln{position:absolute;left:30%;top:6cqw;bottom:0;width:1px;background:#5d5b56}
.chart .ext{position:absolute;left:30%;top:100%;height:4cqw;border-left:1px dashed #8a877f}
.chart .tk{position:absolute;left:30%;width:2.4cqw;height:1px;background:#5d5b56;margin-left:-1.2cqw}
.chart .tn{position:absolute;left:60%;font-size:3.2cqw;color:#5d5b56;transform:translateY(-55%)}
.chart .tx{left:56%;top:calc(100% + .6cqw);font-size:2.6cqw;color:#7d7a73}
.chart .key{position:absolute;left:0;top:0;width:5.4cqw;height:5cqw;font-size:3.6cqw;color:#5d5b56;border:1px solid #5d5b56;border-radius:50%;display:grid;place-items:center}
.note{right:3.5%;max-width:15cqw;text-align:right;font-size:3.3cqw;color:#58554f;transform:rotate(-4deg);transform-origin:right}
.later{position:absolute;right:4%;top:80%;display:flex;align-items:center;gap:1cqw;transform:rotate(3deg);opacity:1}
.later svg{width:5.4cqw;height:5.4cqw;display:block}.later .hand{position:static;font-size:3.2cqw;color:#58554f}
.stamp{position:absolute;left:4.5%;bottom:8.4%;font:500 1.9cqw/1 'IBM Plex Mono',ui-monospace,monospace;letter-spacing:.16em;color:#5f5c56;white-space:nowrap}
.date{position:absolute;left:4.5%;bottom:2.6%;font:500 1.3cqw/1 'IBM Plex Mono',ui-monospace,monospace;letter-spacing:.12em;color:#9a978f}
canvas,img{position:absolute;left:4.2cqw;top:-10.4cqw;width:88cqw;height:88cqw;display:block}
img{opacity:0}
img.final{mix-blend-mode:multiply;clip-path:inset(10.4cqw 0 0 0)}
.cue{left:11%;top:6.5%;font-size:3.6cqw;color:#58554f;transform:rotate(-3deg);opacity:0;transition:opacity .6s ease;display:flex;align-items:center;gap:.8cqw;pointer-events:none}
.cue svg{width:4.6cqw;height:2.6cqw;display:block}.cue .b{display:none}
.sheet.rest .cue{opacity:.9}
:host([data-wait]){cursor:progress}:host([data-wait]) .cue .a{display:none}:host([data-wait]) .cue .b{display:inline}
:host([data-static]){cursor:default}:host([data-static]) .cue{display:none}
img.crown{height:17.6cqw;clip-path:inset(0 0 7.2cqw 0);opacity:0;transition:opacity .5s ease;pointer-events:none}
`;

  function sheetHTML(k, s) {
    const n = s.ticks.length;
    const ticks = s.ticks.map((t, j) => { const top = `calc(6cqw + (100% - 6cqw) * ${(j + 1) / n})`; return `<div class="tk" style="top:${top}"></div>` + (t ? `<div class="hand tn" style="top:${top}">${t}</div>` : ''); }).join('');
    const notes = (s.notes || []).map((t, j) => `<div class="hand note" style="top:${44 + k * 9 + j * 9}%">${t}</div>`).join('');
    return `<div class="sheet${k === 0 ? ' first' : ''}" data-k="${k}">
      <div class="x" style="left:4%;top:5%"></div><div class="x" style="left:4%;bottom:15%"></div><div class="x" style="right:20%;top:5%"></div>
      <div class="chart"><div class="hand key">${s.f}</div><div class="ln"></div>${ticks}${s.x ? `<div class="hand tx">${s.x}</div>` : ''}${s.open ? '<div class="ext"></div>' : ''}</div>
      ${notes}${s.later ? `<div class="later">${HELMET}<span class="hand">later</span></div>` : ''}${k === 3 ? `<div class="hand cue" aria-hidden="true"><span class="a">flip it</span><span class="b">one sec…</span>${ARROW}</div>` : ''}
      <canvas></canvas>${k === 3 ? '<img class="final" draggable="false" alt=""><img class="crown" draggable="false" alt="">' : ''}
      <div class="peg" style="left:31%;width:7%"></div><div class="peg" style="left:46.5%;width:7%;border-radius:999px">${k === 3 ? `<div class="ghost">${DRIFTER}</div>` : ''}</div><div class="peg" style="left:62%;width:7%"></div>
      <div class="stamp">${s.stamp}</div>${s.date ? `<div class="date">${s.date}</div>` : ''}
      <div class="hand num">${s.f}</div>
    </div>`;
  }

  class AnimationSheets extends HTMLElement {
    connectedCallback() {
      if (this._init) return;
      this._init = true;
      const alt = this.getAttribute('alt') || 'Sketch portrait of Zach Gracia on a pegged animation sheet';
      ensureFont(this.getAttribute('fonts') || new URL('fonts/', new URL(this.getAttribute('src') || '', document.baseURI)).href);
      let story = STORY;
      try { if (this.getAttribute('story')) story = JSON.parse(this.getAttribute('story')); } catch (e) {}
      this.setAttribute('role', 'img');
      this.setAttribute('aria-label', alt);
      const root = this.attachShadow({ mode: 'open' });
      root.innerHTML = `<style>${SHEET_CSS}</style><div class="pad a"></div><div class="pad b"></div>` + [0, 1, 2, 3].map((k) => sheetHTML(k, story[k])).join('');
      this.sheets = [...root.querySelectorAll('.sheet')];
      this.cvs = this.sheets.map((sh) => { const c = sh.querySelector('canvas'); c.width = c.height = S; return c; });
      this.img = root.querySelector('img.final');
      this.crownEl = root.querySelector('img.crown');
      const pick = (a) => (S < 640 && this.getAttribute(a + '-sm')) || this.getAttribute(a);
      const bTone = pick('tone'), bCrown = pick('crown');
      this.sheets.forEach((sh, k) => { if (k) sh.style.opacity = 0; });
      // baked tone → the worker path (strokes + hatching only); otherwise the full main-thread analysis also renders the tone
      const P = (s, h) => (bTone ? prepLite(s, h) : prep(s));
      this._fail = () => {
        this._failed = true; this.removeAttribute('data-wait'); this.setAttribute('data-static', '');
        this.removeAttribute('tabindex'); this.setAttribute('role', 'img'); this.setAttribute('aria-label', alt);
      };
      const load = () => this.ready || (this.ready = Promise.all([P(this.getAttribute('src'), true), ...(this.getAttribute('stages') || '').split(',').map((x) => x.trim()).filter(Boolean).map((s) => P(s, false))])
        .then(([data, ...sd]) => { this.data = data; this.stageData = sd; if (!bTone) { this.img.src = data.finalSrc; this.img.style.mixBlendMode = ''; } else if (!this.img.getAttribute('src')) { this.img.src = bTone; }
          if (!bCrown) { this.crownEl.src = data.crownSrc; if (this.sheets[3].classList.contains('rest')) this.crownEl.style.opacity = 1; } else if (!this.crownEl.getAttribute('src')) { this.crownEl.src = bCrown; }
          return data; }).catch(() => this._fail()));
      this._load = load;
      const restNow = () => {
        if (bTone) this.img.src = bTone; else { this.img.src = this.getAttribute('src'); this.img.style.mixBlendMode = 'multiply'; }
        if (bCrown) this.crownEl.src = bCrown;
        this.showFinal();
      };
      const warm = () => { if (!this.ready) (window.requestIdleCallback || setTimeout)(() => load()); };
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) { this.setAttribute('data-static', ''); restNow(); if (!bTone) load().then(() => this.showFinal()); return; }
      const trig = this.getAttribute('trigger') || 'static';
      if (trig === 'static' || trig === 'dwell') {
        restNow();
        if (!bTone) load().then(() => this.showFinal());
        ['pointerenter', 'touchstart', 'focus'].forEach((ev) => this.addEventListener(ev, warm, { passive: true }));
        if (trig === 'dwell') {
          const wait = (parseFloat(this.getAttribute('dwell')) || 8) * 1000;
          this.ioDwell = new IntersectionObserver((es) => {
            const vis = es.some((e) => e.isIntersecting);
            clearTimeout(this._dwellT);
            if (vis && !this._played) { warm(); this._dwellT = setTimeout(() => { if (this.done && !this._played) this.play(0); }, wait); }
          }, { threshold: 0.5 });
          this.ioDwell.observe(this);
        }
      } else if (trig === 'load') load().then(() => this.play());
      else if (trig === 'view') {
        this.ioNear = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { this.ioNear.disconnect(); load(); } }, { rootMargin: '400px' });
        this.ioNear.observe(this);
        this.io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { this.io.disconnect(); load().then(() => this.play()); } }, { threshold: 0.35 });
        this.io.observe(this);
      }
      const replay = () => { if (this.done) this.play(0); };
      this.tabIndex = 0;
      this.setAttribute('role', 'button');
      this.setAttribute('aria-label', 'Play the drawing sequence. ' + alt);
      this.addEventListener('click', replay);
      this.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); replay(); } });
    }
    disconnectedCallback() { this.io && this.io.disconnect(); this.ioNear && this.ioNear.disconnect(); this.ioDwell && this.ioDwell.disconnect(); clearTimeout(this._dwellT); cancelAnimationFrame(this.raf); }
    dur() { return Math.max(1, parseFloat(this.getAttribute('duration')) || 6); }
    showFinal() {
      this.sheets.forEach((sh, k) => { sh.style.opacity = k === 3 ? 1 : 0; sh.style.transform = ''; });
      this.sheets[3].style.background = 'rgb(var(--paper))';
      this.cvs[3].style.opacity = 0; this.img.style.opacity = 1; this.sheets[3].classList.add('rest'); this.done = true;
      if (this.data || this.crownEl.getAttribute('src')) { this.crownEl.style.transition = 'opacity .5s ease'; this.crownEl.style.opacity = 1; }
    }

    play(u0 = 0) {
      if (this._failed) return;
      if (!this.data) {
        if (this.hasAttribute('data-wait')) return;
        this.setAttribute('data-wait', '');
        this._load().then(() => { this.removeAttribute('data-wait'); if (this.data) this.play(u0); });
        return;
      }
      cancelAnimationFrame(this.raf);
      this.done = false; this._played = true; clearTimeout(this._dwellT);
      const data = this.data, N = S * S, H = hatchesForm(data);
      const D = this.dur() * 1000 * (u0 ? (1 - u0) * 0.85 : 1);
      const ph = (u, r) => clamp((u - r[0]) / (r[1] - r[0]));
      const TL = [
        { land: [-1, 0], d: [0.02, 0.17], ink: 0.6, W: 0.16 },
        { land: [0.15, 0.21], d: [0.19, 0.4], ink: 0.85, W: 0.12 },
        { land: [0.38, 0.44], d: [0.42, 0.64], ink: 0.95, W: 0.1 },
      ];
      const TN = { land: [0.62, 0.68], h: [0.66, 0.92], f: [0.86, 1], sf: [0.88, 1], op: [0.84, 1] };
      const mk = () => { const c = document.createElement('canvas'); c.width = c.height = S; const x = c.getContext('2d', { willReadFrequently: true }); x.lineCap = x.lineJoin = 'round'; return x; };
      const newBuf = (ctx) => { const b = ctx.createImageData(S, S), o = b.data; for (let i = 0; i < N; i++) { o[i * 4] = 26; o[i * 4 + 1] = 25; o[i * 4 + 2] = 24; } return b; };
      const layers = this.stageData.slice(0, 3).map((sd, k) => {
        const t = TL[k], ctx = this.cvs[k].getContext('2d');
        if (t.d[0] < u0) return null;
        ctx.clearRect(0, 0, S, S);
        if (!sd.inkS) { sd.inkS = new Float32Array(N); for (let i = 0; i < N; i++) sd.inkS[i] = clamp((sd.d[i] - 0.07) / 0.75); }
        const m = mk(); m.lineWidth = k < 2 ? 3.6 : 2.8; m.strokeStyle = '#000';
        const maxL = sd.strokes.reduce((a, s) => Math.max(a, s.pts.length), 1);
        const list = sd.strokes.map((s) => ({ s, o: k === 0 ? (1 - s.pts.length / maxL) * 0.8 + s.r * 0.2 : k === 1 ? s.cy * 0.5 + s.r * 0.5 : Math.hypot(s.cx - 0.52, (s.cy - 0.4) * 1.1) / 0.7 * 0.85 + s.r * 0.15 }));
        list.sort((a, b) => a.o - b.o);
        this.sheets[k].style.opacity = t.land[0] >= 0 ? 0 : 1;
        if (t.land[0] < 0) this.sheets[k].style.transform = '';
        return { k, t, m, list, ink: sd.inkS, drawn: new Int32Array(list.length), ctx, buf: newBuf(ctx), fin: false };
      });
      const tctx = this.cvs[3].getContext('2d'); tctx.clearRect(0, 0, S, S);
      const tbuf = newBuf(tctx), tmask = mk(), sketch = mk();
      this.sheets[3].style.opacity = 0; this.sheets[3].style.background = ''; this.sheets[3].classList.remove('rest');
      this.crownEl.style.transition = 'none'; this.crownEl.style.opacity = 0;
      this.img.style.opacity = 0; this.cvs[3].style.transition = 'none'; this.cvs[3].style.opacity = 1;
      let hDone = 0, hA = null;
      const land = (sh, p) => {
        const e = 1 - Math.pow(1 - p, 3);
        sh.style.opacity = clamp(p * 2);
        sh.style.transform = p >= 1 ? '' : `translateY(${(1 - e) * -0.8}%) rotate(${(1 - e) * -0.35}deg)`;
      };
      const t0 = performance.now();
      const frame = (now) => {
        const u = u0 + (1 - u0) * clamp((now - t0) / D);
        layers.forEach((L) => {
          if (!L || L.fin) return;
          if (L.t.land[0] >= 0) land(this.sheets[L.k], ph(u, L.t.land));
          if (u < L.t.d[0]) return;
          const pd = easeS(ph(u, L.t.d)), nL = L.list.length;
          L.m.beginPath();
          for (let k = 0; k < nL; k++) {
            const st = (k / nL) * (1 - L.W);
            if (pd < st) break;
            const p = L.list[k].s.pts, m = p.length / 2, tg = Math.floor(clamp((pd - st) / L.W) * (m - 1));
            if (tg <= L.drawn[k]) continue;
            const a = L.drawn[k];
            L.m.moveTo(p[a * 2], p[a * 2 + 1]);
            for (let j = a + 1; j <= tg; j++) L.m.lineTo(p[j * 2], p[j * 2 + 1]);
            L.drawn[k] = tg;
          }
          L.m.stroke();
          const arr = L.m.getImageData(0, 0, S, S).data, fill = ss(0.7, 1, ph(u, L.t.d)), o = L.buf.data, ink = L.ink, im = L.t.ink;
          for (let i = 0; i < N; i++) o[i * 4 + 3] = Math.max(arr[i * 4 + 3] / 255, fill) * ink[i] * im * 255;
          L.ctx.putImageData(L.buf, 0, 0);
          if (pd >= 1) L.fin = true;
        });
        land(this.sheets[3], ph(u, TN.land));
        if (u >= TN.h[0]) {
          const tgt = Math.floor(ph(u, TN.h) * H.list.length);
          if (tgt > hDone) {
            for (let p = 0; p < 3; p++) {
              const P = H.passes[p];
              tmask.beginPath(); sketch.beginPath();
              for (let k = hDone; k < tgt; k++) {
                const h = H.list[k];
                if (h.p !== p) continue;
                const q = h.pts;
                tmask.moveTo(q[0], q[1]); sketch.moveTo(q[0], q[1]);
                for (let j = 2; j < q.length; j += 2) { tmask.lineTo(q[j], q[j + 1]); sketch.lineTo(q[j], q[j + 1]); }
              }
              tmask.lineWidth = P.sp * 1.25; tmask.strokeStyle = 'rgba(0,0,0,' + P.al + ')'; tmask.stroke();
              sketch.lineWidth = 0.8; sketch.strokeStyle = 'rgba(28,26,24,.14)'; sketch.stroke();
            }
            hDone = tgt;
            hA = tmask.getImageData(0, 0, S, S).data;
          }
          const tf = ss(0, 1, ph(u, TN.f)), d = data.d, o = tbuf.data;
          for (let i = 0; i < N; i++) o[i * 4 + 3] = d[i] * (1 - (1 - (hA ? hA[i * 4 + 3] / 255 : 0)) * (1 - tf)) * 255;
          tctx.putImageData(tbuf, 0, 0);
          const sa = 1 - ss(0, 1, ph(u, TN.sf));
          if (sa > 0) { tctx.globalAlpha = sa; tctx.drawImage(sketch.canvas, 0, 0); tctx.globalAlpha = 1; }
          const opq = ss(0, 1, ph(u, TN.op));
          this.sheets[3].style.background = `rgba(var(--paper),${0.8 + 0.2 * opq})`;
          this.crownEl.style.opacity = opq;
        }
        if (u < 1) this.raf = requestAnimationFrame(frame);
        else {
          this.img.style.opacity = 1;
          void this.cvs[3].offsetWidth;
          this.cvs[3].style.transition = 'opacity .45s ease'; this.cvs[3].style.opacity = 0;
          this.sheets[3].classList.add('rest'); this.crownEl.style.opacity = 1;
          this.done = true;
          this.dispatchEvent(new CustomEvent('sketchend'));
        }
      };
      this.raf = requestAnimationFrame(frame);
    }
  }
  if (!customElements.get('animation-sheets')) customElements.define('animation-sheets', AnimationSheets);
})();
