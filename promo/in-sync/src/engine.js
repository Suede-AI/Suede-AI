// Film engine: deterministic per-frame rendering of a timeline of 3D scenes with
// transitions, bloom, grading and a DOM typography layer.
import * as THREE from 'three';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { FullScreenQuad } from 'three/addons/postprocessing/Pass.js';
import { W, H, clamp, lerp, ease, prog, noise1 } from './util.js';
import * as M from './materials.js';

const loader = new THREE.TextureLoader();
const _q = new THREE.Quaternion();

export class Engine {
  constructor(container, textRoot) {
    const r = this.renderer = new THREE.WebGLRenderer({ antialias: false, preserveDrawingBuffer: true, alpha: false, powerPreference: 'high-performance' });
    r.setPixelRatio(1); r.setSize(W, H); r.outputColorSpace = THREE.LinearSRGBColorSpace; r.toneMapping = THREE.NoToneMapping;
    r.autoClear = true; r.setClearColor(0x000000, 1);
    container.appendChild(r.domElement);
    this.textRoot = textRoot;
    const opt = { type: THREE.HalfFloatType, samples: 4, colorSpace: THREE.LinearSRGBColorSpace };
    this.rtA = new THREE.WebGLRenderTarget(W, H, opt);
    this.rtB = new THREE.WebGLRenderTarget(W, H, opt);
    this.rtMix = new THREE.WebGLRenderTarget(W, H, { type: THREE.HalfFloatType });
    this.bloom = new UnrealBloomPass(new THREE.Vector2(W, H), 0.6, 0.6, 0.92);
    this.mixQuad = new FullScreenQuad(mixMaterial());
    this.finalQuad = new FullScreenQuad(finalMaterial());
    this.tex = new Map(); this.pending = [];
    this.scenes = []; this.transitions = [];
    this.anisotropy = Math.min(8, r.capabilities.getMaxAnisotropy());
  }

  // ---------------- assets
  texture(path, { srgb = true, repeat = false } = {}) {
    if (this.tex.has(path)) return this.tex.get(path);
    const t = new THREE.Texture(); t.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace; t.anisotropy = this.anisotropy;
    t.userData.ready = new Promise((res, rej) => loader.load(path, img => { t.image = img.image; t.needsUpdate = true; t.userData.w = img.image.width; t.userData.h = img.image.height; res(t); }, undefined, e => rej(new Error('load ' + path))));
    this.pending.push(t.userData.ready); this.tex.set(path, t); return t;
  }
  shot(name) { return this.texture(`assets/tex/${name}.jpg`); }
  card(name) { return this.texture(`assets/cards/${name}.png`); }
  img(name) { return this.texture(`assets/img/${name}`); }
  async loaded() { await Promise.all(this.pending); }

  // Canvas text texture (for in-world labels)
  textTexture(text, o = {}) {
    const size = o.size || 48, font = `${o.weight || 400} ${o.italic ? 'italic ' : ''}${size}px ${o.font || 'Inter'}`;
    const c = document.createElement('canvas'), x = c.getContext('2d');
    x.font = font; if (o.tracking) x.letterSpacing = `${o.tracking}px`;
    const tw = Math.ceil(x.measureText(text).width) + (o.tracking || 0) * 2, pad = o.pad ?? Math.round(size * .6);
    c.width = tw + pad * 2; c.height = Math.round(size * 1.6 + (o.padY ?? pad * .6) * 2);
    x.font = font; if (o.tracking) x.letterSpacing = `${o.tracking}px`;
    if (o.bg) { x.fillStyle = o.bg; roundRect(x, 1, 1, c.width - 2, c.height - 2, o.radius ?? c.height / 2); x.fill();
      if (o.border) { x.strokeStyle = o.border; x.lineWidth = 2; x.stroke(); } }
    if (o.dot) { x.fillStyle = o.dot; x.beginPath(); x.arc(pad * .62, c.height / 2, size * .17, 0, Math.PI * 2); x.fill(); }
    x.fillStyle = o.color || '#fff'; x.textBaseline = 'middle'; x.fillText(text, pad + (o.dot ? size * .35 : 0), c.height / 2 + size * .04);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = this.anisotropy;
    t.userData.w = c.width; t.userData.h = c.height; return t;
  }

  nebula(o) {
    const rt = new THREE.WebGLRenderTarget(1024, 512, { type: THREE.HalfFloatType });
    const q = new FullScreenQuad(M.nebulaGenMaterial(o));
    this.renderer.setRenderTarget(rt); q.render(this.renderer); this.renderer.setRenderTarget(null);
    q.dispose(); return rt.texture;
  }

  // ---------------- timeline
  add(scene, start, end) { scene.start = start; scene.end = end; this.scenes.push(scene); return scene; }
  transition(at, dur, type = 'fade', opts = {}) { this.transitions.push({ at, dur, type, ...opts }); }

  frame(t) {
    // figure active scenes
    const act = this.scenes.filter(s => t >= s.start && t < s.end);
    const tr = this.transitions.find(x => t >= x.at && t < x.at + x.dur);
    let A, B = null, p = 0;
    if (tr && act.length >= 2) { act.sort((a, b) => a.start - b.start); A = act[0]; B = act[act.length - 1]; p = (t - tr.at) / tr.dur; }
    else { A = act.sort((a, b) => b.start - a.start)[0]; }
    for (const s of this.scenes) s.dom.style.display = (s === A || s === B) ? 'block' : 'none';
    if (!A) { this.renderer.setRenderTarget(null); this.renderer.clear(); return; }
    A.render(this, t, this.rtA);
    let bloomS = A.bloom, grade = A.grade;
    if (B) {
      B.render(this, t, this.rtB);
      const mm = this.mixQuad.material.uniforms;
      mm.uA.value = this.rtA.texture; mm.uB.value = this.rtB.texture; mm.uP.value = p; mm.uType.value = TYPES[tr.type] ?? 0;
      mm.uColor.value.set(tr.color || '#ffffff'); mm.uAmt.value = tr.amt ?? 1; mm.uDir.value.set(...(tr.dir || [1, 0]));
      bloomS = lerpObj(A.bloom, B.bloom, ease.inOutSine(p)); grade = lerpObj(A.grade, B.grade, ease.inOutSine(p));
      const domP = tr.type === 'cut' ? (p > 0 ? 1 : 0) : ease.inOutSine(clamp(p * 1.25 - .1));
      A.dom.style.opacity = (1 - domP) * (A.fade ?? 1); B.dom.style.opacity = domP * (B.fade ?? 1);
    } else {
      const mm = this.mixQuad.material.uniforms; mm.uA.value = this.rtA.texture; mm.uP.value = 0; mm.uType.value = 0;
      A.dom.style.opacity = A.fade ?? 1;
    }
    const r = this.renderer;
    r.setRenderTarget(this.rtMix); this.mixQuad.render(r);
    this.bloom.strength = bloomS.strength; this.bloom.radius = bloomS.radius; this.bloom.threshold = bloomS.threshold;
    if (bloomS.strength > 0.001) this.bloom.render(r, null, this.rtMix, 0, false);
    const fu = this.finalQuad.material.uniforms;
    fu.uTex.value = this.rtMix.texture; fu.uTime.value = t;
    const flash = Math.max(A.flash || 0, B ? (B.flash || 0) : 0) + (tr && tr.flash ? tr.flash * Math.sin(Math.PI * clamp(p)) : 0);
    fu.uFlash.value = flash; fu.uFlashC.value.set((B && B.flash > (A.flash || 0) ? B.flashColor : A.flashColor) || tr?.color || '#fff8ee');
    fu.uCA.value = grade.ca + flash * .004; fu.uVig.value = grade.vig; fu.uSat.value = grade.sat; fu.uExpo.value = grade.expo;
    fu.uLift.value.set(...grade.lift); fu.uGain.value.set(...grade.gain); fu.uFade.value = (A.fade ?? 1) * (B ? (B.fade ?? 1) : 1);
    r.setRenderTarget(null); this.finalQuad.render(r);
    const lb = Math.max(A.letterbox || 0, B ? (B.letterbox || 0) : 0) * 138;
    if (!this._lb) this._lb = [document.getElementById('lbt'), document.getElementById('lbb')];
    this._lb.forEach(e => e.style.height = lb.toFixed(1) + 'px');
  }
}

function lerpObj(a, b, p) {
  const o = {};
  for (const k in a) o[k] = Array.isArray(a[k]) ? a[k].map((v, i) => lerp(v, b[k][i], p)) : lerp(a[k], b[k], p);
  return o;
}
function roundRect(x, l, t, w, h, r) { x.beginPath(); x.moveTo(l + r, t); x.arcTo(l + w, t, l + w, t + h, r); x.arcTo(l + w, t + h, l, t + h, r); x.arcTo(l, t + h, l, t, r); x.arcTo(l, t, l + w, t, r); x.closePath(); }

const TYPES = { fade: 0, zoom: 1, whip: 2, flash: 3, cut: 4, iris: 5, push: 6, blurfade: 7 };
function mixMaterial() {
  return new THREE.ShaderMaterial({
    uniforms: { uA: { value: null }, uB: { value: null }, uP: { value: 0 }, uType: { value: 0 }, uColor: { value: new THREE.Color() }, uAmt: { value: 1 }, uDir: { value: new THREE.Vector2(1, 0) } },
    vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0., 1.); }`,
    fragmentShader: /* glsl */`
      uniform sampler2D uA, uB; uniform float uP, uType, uAmt; uniform vec3 uColor; uniform vec2 uDir; varying vec2 vUv;
      vec3 zoomBlur(sampler2D t, vec2 uv, float amt, float scale){
        vec2 c = vec2(.5); vec2 d = (uv - c); vec3 s = vec3(0.);
        for (int i = 0; i < 16; i++){ float f = float(i) / 15.; s += texture(t, c + d * scale * (1. - amt * f)).rgb; }
        return s / 16.; }
      vec3 dirBlur(sampler2D t, vec2 uv, vec2 dir){ vec3 s = vec3(0.); for (int i = 0; i < 16; i++){ float f = float(i) / 15. - .5; s += texture(t, uv + dir * f).rgb; } return s / 16.; }
      float ss(float a, float b, float x){ return smoothstep(a, b, x); }
      void main(){
        float p = uP; vec3 col;
        if (uType < .5) { col = mix(texture(uA, vUv).rgb, texture(uB, vUv).rgb, ss(0., 1., p)); }
        else if (uType < 1.5) { // zoom through: A rushes toward camera, B arrives from small
          float pa = ss(0., .6, p), pb = ss(.35, 1., p);
          vec3 a = zoomBlur(uA, vUv, .25 * pa * uAmt, 1. - .35 * pa * pa);
          vec3 b = zoomBlur(uB, vUv, .25 * (1. - pb) * uAmt, 1. + .25 * (1. - pb) * (1. - pb));
          col = mix(a, b, ss(.3, .7, p));
          col += uColor * exp(-pow((p - .5) * 5., 2.)) * .6 * uAmt; }
        else if (uType < 2.5) { // whip pan
          float e = p < .5 ? 4. * p * p * p : 1. - pow(-2. * p + 2., 3.) / 2.;
          vec2 o = uDir * e; float bl = sin(3.14159 * p) * .14 * uAmt;
          vec3 a = dirBlur(uA, vUv + o, uDir * bl), b = dirBlur(uB, vUv + o - uDir, uDir * bl);
          col = mix(a, b, ss(.99, 1.01, dot(vUv, uDir) + e)); }
        else if (uType < 3.5) { // flash cut
          col = p < .5 ? texture(uA, vUv).rgb : texture(uB, vUv).rgb;
          col += uColor * exp(-abs(p - .5) * 9.) * 1.6 * uAmt; }
        else if (uType < 4.5) { col = p < .5 ? texture(uA, vUv).rgb : texture(uB, vUv).rgb; }
        else if (uType < 5.5) { // iris from center with glowing edge
          float r = length((vUv - .5) * vec2(16./9., 1.));
          float R = p * p * 1.25; float m = ss(R, R - .06, r);
          col = mix(texture(uA, vUv).rgb, texture(uB, vUv).rgb, m) + uColor * exp(-pow((r - R) * 28., 2.)) * 1.2 * (1. - p) * uAmt; }
        else if (uType < 6.5) { // push: A scales up & fades, B settles from slightly larger
          float e = p * p * (3. - 2. * p);
          vec2 ua = (vUv - .5) / (1. + e * .18) + .5, ub = (vUv - .5) / (1.08 - e * .08) + .5;
          col = mix(texture(uA, ua).rgb, texture(uB, ub).rgb, e); }
        else { // blur dissolve
          float b = sin(3.14159 * p) * .03 * uAmt; vec3 a = vec3(0.), c = vec3(0.);
          for (int i = 0; i < 12; i++){ float f = float(i) / 11.; vec2 o = vec2(cos(f * 6.28), sin(f * 6.28)) * b * f;
            a += texture(uA, vUv + o).rgb; c += texture(uB, vUv + o).rgb; }
          col = mix(a, c, ss(.2, .8, p)) / 12.; }
        gl_FragColor = vec4(col, 1.);
      }`,
  });
}

function finalMaterial() {
  return new THREE.ShaderMaterial({
    uniforms: { uTex: { value: null }, uTime: { value: 0 }, uFlash: { value: 0 }, uFlashC: { value: new THREE.Color() }, uCA: { value: .0015 }, uVig: { value: .35 },
      uSat: { value: 1 }, uExpo: { value: 1 }, uLift: { value: new THREE.Vector3() }, uGain: { value: new THREE.Vector3(1, 1, 1) }, uFade: { value: 1 } },
    vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0., 1.); }`,
    fragmentShader: /* glsl */`
      uniform sampler2D uTex; uniform float uTime, uFlash, uCA, uVig, uSat, uExpo, uFade; uniform vec3 uFlashC, uLift, uGain; varying vec2 vUv;
      vec3 shoulder(vec3 x){ vec3 k = vec3(.82); return mix(x, k + (1. - k) * (1. - exp(-(x - k) / (1. - k))), step(k, x)); }
      float lin2srgb(float c){ return c <= .0031308 ? c * 12.92 : 1.055 * pow(c, 1. / 2.4) - .055; }
      float hash(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233)) + uTime * 61.7) * 43758.5453); }
      void main(){
        vec2 d = vUv - .5; float r2 = dot(d, d);
        vec2 off = d * r2 * uCA * 18.;
        vec3 c = vec3(texture(uTex, vUv - off).r, texture(uTex, vUv).g, texture(uTex, vUv + off).b);
        c *= uExpo;
        c += uFlashC * uFlash * (0.65 + .35 * exp(-r2 * 3.));
        c = shoulder(c);
        float l = dot(c, vec3(.2126, .7152, .0722));
        c = mix(vec3(l), c, uSat);
        c = c * uGain + uLift * (1. - c);
        c *= mix(1., smoothstep(1.05, .2, length(d * vec2(1.1, 1.))), uVig);
        c *= uFade;
        c = clamp(c, 0., 1.);
        c = vec3(lin2srgb(c.r), lin2srgb(c.g), lin2srgb(c.b));
        c += (hash(gl_FragCoord.xy) - .5) / 255.;
        gl_FragColor = vec4(c, 1.);
      }`,
  });
}

// ---------------------------------------------------------------------------
// Scene base: owns a THREE.Scene, camera, DOM text layer, post settings.
export class Shot {
  constructor(E, o = {}) {
    this.E = E;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(o.fov || 32, W / H, 0.05, 3000);
    this.bloom = { strength: .55, radius: .55, threshold: .92, ...(o.bloom || {}) };
    this.grade = { ca: .0012, vig: .4, sat: 1.04, expo: 1, lift: [0, 0, 0], gain: [1, 1, 1], ...(o.grade || {}) };
    this.flash = 0; this.flashColor = o.flashColor || '#fff4e6'; this.fade = 1;
    this.dom = document.createElement('div'); this.dom.className = 'shot'; E.textRoot.appendChild(this.dom);
    this.updaters = []; this.texts = [];
    this.billboards = [];
    this.focus = o.focus ?? 3; this.focusRange = o.focusRange ?? 3; this.dof = o.dof ?? 1;
    if (o.sky) {
      const tex = E.nebula(o.sky);
      this.sky = new THREE.Mesh(new THREE.SphereGeometry(1000, 48, 24), M.skyMaterial(tex));
      this.sky.material.uniforms.uI.value = o.sky.intensity ?? 1;
      this.scene.add(this.sky);
    }
  }
  add(o) { this.scene.add(o); return o; }
  on(fn) { this.updaters.push(fn); return this; }
  render(E, t, rt) {
    const lt = t - this.start;
    for (const f of this.updaters) f(lt, t);
    for (const tx of this.texts) tx.update(lt);
    if (this.sky) this.sky.position.copy(this.camera.position);
    this.camera.updateMatrixWorld();
    this.scene.updateMatrixWorld();
    // global uniforms: DOF focus + time + billboard orientation
    this.scene.traverse(o => {
      const u = o.material && o.material.uniforms; if (!u) return;
      if (u.uFocus) { u.uFocus.value = this.focus; u.uFocusRange.value = this.focusRange; }
      if (u.uDof && o.userData.dofScale !== undefined) u.uDof.value = this.dof * o.userData.dofScale;
      if (u.uTime && !o.userData.ownTime) u.uTime.value = t;
      if (o.userData.billboard) {
        if (o.parent && o.parent !== this.scene) { o.parent.getWorldQuaternion(_q); o.quaternion.copy(_q.invert().multiply(this.camera.quaternion)); }
        else o.quaternion.copy(this.camera.quaternion);
      }
    });
    E.renderer.setRenderTarget(rt); E.renderer.clear(); E.renderer.render(this.scene, this.camera);
  }
}

// ---------------------------------------------------------------------------
// Builders
const chromeCache = new Map();
function chromeTexture(E, url, dark = true) {
  const key = url + dark; if (chromeCache.has(key)) return chromeCache.get(key);
  const c = document.createElement('canvas'); c.width = 2048; c.height = 72; const x = c.getContext('2d');
  const g = x.createLinearGradient(0, 0, 0, 72); g.addColorStop(0, dark ? '#24262f' : '#f3f3f5'); g.addColorStop(1, dark ? '#1a1b22' : '#e6e6ea');
  x.fillStyle = g; x.fillRect(0, 0, 2048, 72);
  x.fillStyle = dark ? 'rgba(255,255,255,.06)' : 'rgba(0,0,0,.08)'; x.fillRect(0, 71, 2048, 1);
  [['#ff5f57', 34], ['#febc2e', 64], ['#28c840', 94]].forEach(([col, cx]) => { x.fillStyle = col; x.beginPath(); x.arc(cx, 36, 9, 0, 7); x.fill(); });
  x.fillStyle = dark ? 'rgba(255,255,255,.07)' : 'rgba(0,0,0,.06)'; roundRect(x, 724, 16, 600, 40, 12); x.fill();
  x.font = '500 22px Inter'; x.fillStyle = dark ? 'rgba(235,238,255,.78)' : 'rgba(30,30,40,.75)'; x.textAlign = 'center'; x.textBaseline = 'middle';
  x.fillText('🔒 ' + url, 1024, 37);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = E.anisotropy; chromeCache.set(key, t); return t;
}

// Browser window. w = world width. Content texture may be tall (scrollable).
export function browser(E, shotName, o = {}) {
  const w = o.w || 1.6, chromeFrac = 0.052;
  const contentAspect = 1600 / 1000;            // visible content area aspect
  const h = w / contentAspect / (1 - chromeFrac);
  const map = o.map || E.shot(shotName);
  const m = M.screenMaterial({ map, chrome: chromeTexture(E, o.url || shotName, o.dark ?? true), aspect: w / h, chromeFrac, radius: 0.018 * (1 / 1), rim: o.rim, rimAmt: o.rimAmt ?? .35, bright: o.bright ?? .86 });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), m);
  map.userData.ready.then(t => { m.uniforms.uView.value = Math.min(1, (t.userData.w / t.userData.h) / contentAspect); });
  mesh.userData.dofScale = o.dof ?? 1; mesh.userData.w = w; mesh.userData.h = h;
  return mesh;
}

// Phone with optional metal back plate for thickness.
export function phone(E, shotName, o = {}) {
  const h = o.h || 1, w = h * 417 / 876;
  const map = o.map || E.shot(shotName);
  const m = M.phoneMaterial({ map, metal: o.metal, rim: o.rim, android: o.android, bright: o.bright, light: o.light, status: o.status });
  if (o.android) m.uniforms.uAspect.value = 0.47;
  const g = new THREE.Group();
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(o.android ? h * 0.47 : w, h), m);
  mesh.userData.dofScale = o.dof ?? 1;
  const screenAspect = 393 / 852 * (1);
  map.userData.ready.then(t => { m.uniforms.uView.value = Math.min(1, (t.userData.w / t.userData.h) / screenAspect); });
  if (o.thick !== false) {
    const bm = M.phoneMaterial({ map, metal: o.metal || '#5b606b', rim: o.rim, android: o.android, bright: 0 });
    bm.uniforms.uAspect.value = m.uniforms.uAspect.value; bm.uniforms.uBright.value = 0;
    const back = new THREE.Mesh(mesh.geometry, bm); back.position.z = -h * 0.018; back.userData.dofScale = o.dof ?? 1;
    g.add(back); g.userData.back = back;
  }
  g.add(mesh); g.userData.screen = mesh; g.userData.mat = m;
  return g;
}

// Flat image / card with alpha.
export function card(E, tex, o = {}) {
  const w = o.w || 1;
  const m = M.screenMaterial({ map: tex, aspect: 1, radius: o.radius ?? 0, useAlpha: o.alpha ?? true, rim: o.rim, rimAmt: o.rimAmt ?? 0, bright: o.bright ?? .92, sheenAmt: o.sheenAmt ?? .08 });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), m);
  const setAspect = (tw, th) => { const h = w * th / tw; mesh.scale.set(w, h, 1); m.uniforms.uAspect.value = w / h; mesh.userData.h = h; };
  if (o.aspect) setAspect(o.aspect, 1); else if (tex.userData.w) setAspect(tex.userData.w, tex.userData.h);
  else { setAspect(1, 1); tex.userData.ready?.then(t => setAspect(t.userData.w, t.userData.h)); }
  mesh.userData.dofScale = o.dof ?? 1; mesh.userData.w = w;
  return mesh;
}

// Mirror copy of a mesh/group below a floor plane (fake reflection).
export function reflect(obj, floorY, amt = .35) {
  const r = obj.clone(true);
  r.traverse(o => { if (o.material) { o.material = o.material.clone(); if (o.material.uniforms.uReflect) o.material.uniforms.uReflect.value = amt; } });
  r.userData.reflectOf = obj; r.userData.floorY = floorY;
  return r;
}
export function syncReflection(r) {
  const o = r.userData.reflectOf; o.updateMatrix();
  r.position.set(o.position.x, 2 * r.userData.floorY - o.position.y, o.position.z);
  r.rotation.set(-o.rotation.x, o.rotation.y, -o.rotation.z);
  r.scale.set(o.scale.x, -o.scale.y, o.scale.z);
  const src = [], dst = [];
  o.traverse(x => x.material && src.push(x)); r.traverse(x => x.material && dst.push(x));
  src.forEach((s, i) => { const du = dst[i].material.uniforms, su = s.material.uniforms; for (const k of ['uScroll', 'uOpacity', 'uSheen', 'uView', 'uScreenGlow', 'uBlur']) if (du[k] && su[k]) du[k].value = su[k].value; });
}

// Camera handheld drift
export function drift(cam, t, amt = 1, seed = 0) {
  cam.rotation.x += noise1(t * .35, seed + 1) * .006 * amt;
  cam.rotation.y += noise1(t * .3, seed + 2) * .008 * amt;
  cam.rotation.z += noise1(t * .25, seed + 3) * .004 * amt;
}
export function look(cam, pos, target, roll = 0) {
  cam.position.set(...pos); cam.up.set(Math.sin(roll), Math.cos(roll), 0); cam.lookAt(...target);
}

export { M };
export { glow } from './materials.js';
