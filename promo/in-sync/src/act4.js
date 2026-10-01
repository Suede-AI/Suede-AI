// ACT IV — In sync (145–188.6s): product galaxy, $SUEDE, the mosaic that becomes the mark, end card.
import * as THREE from 'three';
import { Shot, browser, phone, card, glow, drift, look, M } from './engine.js';
import { textBlock } from './text.js';
import { title, dustField, label, setOpacity, rise, sheen, curve } from './kit.js';
import { kf, prog, env, ease, clamp, lerp, rng, hits, beatPulse, noise1, sstep, onBeat } from './util.js';

const fadeIn = (lt, t0, d = .5) => ease.outCubic(clamp((lt - t0) / d));
const icon = (n, s = 52) => `<img src="assets/cards/icon-${n}.png" style="width:${s}px;height:${s}px">`;

const PRODUCTS = [
  ['agents', 'Agent Studio', '#8f7bff'], ['storybeam', 'Storybeam', '#ffd27a'], ['guitarhub', 'GuitarHub', '#f2b25c'], ['fretpulse', 'FretPulse', '#4f8dff'],
  ['sing', 'Suede Sing', '#d2a24c'], ['ip', 'IP Registry', '#2fd17f'], ['social', 'Suede Social', '#ff5a5a'], ['map', 'Suede Map', '#fff1b0'],
  ['cinematic', 'Cinematic', '#3fe0d8'], ['muse', 'Suede Muse', '#ff9b3d'], ['voice', 'Suede Voice', '#e0b35c'], ['strumly', 'Strumly', '#8a5cff'], ['studio', 'Suede Studio', '#ff4a52'],
];

// ---------------------------------------------------------------- IN SYNC galaxy (drop at 145.0)
export function inSync(E) {
  const S = new Shot(E, { fov: 34, sky: { a: '#3a2ab8', b: '#7a2a9a', c: '#1a4aa8', base: '#020210', seed: 3.9, density: 1.25, intensity: 1.15 }, bloom: { strength: .7, radius: .7, threshold: .9 }, grade: { vig: .5, sat: 1.08 }, focus: 7, focusRange: 6 });
  const cam = S.camera;
  const logo = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), M.logoMaterial({ mask: E.img('logo_mask.png'), colorA: '#eef0fa', colorB: '#7f89c0', intensity: .82, emit: .05 }));
  logo.userData.billboard = true; S.add(logo);
  const core = S.add(glow({ size: 3.4, color: '#6a5cff', falloff: 5, intensity: .25 })); core.position.z = -.2;
  const coreHot = S.add(glow({ size: 1.2, color: '#c9d0ff', falloff: 6, intensity: .15 })); coreHot.position.z = -.1;
  const shock = glow({ size: 1, color: '#dfe3ff', falloff: 60, ring: 1.6, ringR: .9, ringW: .02, intensity: 0, core: 0 }); S.add(shock);
  const orbits = [{ r: 1.65, tilt: [.42, .1], speed: .16, n: 4 }, { r: 2.5, tilt: [.3, -.22], speed: -.11, n: 5 }, { r: 3.35, tilt: [.5, .18], speed: .075, n: 4 }];
  let k = 0; const orbs = [], spins = [], rings = [];
  orbits.forEach((o, oi) => {
    const tilt = new THREE.Group(); tilt.rotation.set(o.tilt[0], 0, o.tilt[1]); S.add(tilt);
    const spin = new THREE.Group(); tilt.add(spin); spin.userData.o = o; spins.push(spin);
    const circ = []; for (let i = 0; i <= 96; i++) { const a = i / 96 * Math.PI * 2; circ.push([Math.cos(a) * o.r, 0, Math.sin(a) * o.r]); }
    const ring = M.makeThread(circ, { segments: 400, width: .01, colorA: '#8f8cff', colorB: '#ffd9a0', intensity: .7, pulseN: 2, pulseSpeed: .25, minPx: 1.4 }); tilt.add(ring); rings.push(ring);
    for (let j = 0; j < o.n; j++, k++) {
      const [id, name, col] = PRODUCTS[k]; const a = j / o.n * Math.PI * 2 + oi * .7;
      const g = new THREE.Group(); g.position.set(Math.cos(a) * o.r, 0, Math.sin(a) * o.r); spin.add(g);
      const orb = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), M.orbMaterial({ map: E.card('icon-' + id), color: col, scale: .46 })); g.add(orb);
      const lab = label(S, E, name.toUpperCase(), { size: 24, tracking: 5, scale: 1.25, color: 'rgba(230,234,255,.88)' }); g.attach(lab); lab.position.set(0, -.36, 0); lab.userData.billboard = true;
      g.userData.billboard = true;
      const spoke = M.makeThread([[0, 0, 0], [g.position.x * .5, .25, g.position.z * .5], g.position.toArray()], { segments: 60, width: .012, colorA: '#c9d0ff', colorB: col, intensity: 1.0, pulseN: 1, pulseSpeed: .6, minPx: 1.6 });
      spoke.userData.ownTime = true; spin.add(spoke);
      orbs.push({ g, orb, lab, spoke, t0: 1.0 + k * .125, oi });
    }
  });
  const stars = M.makeParticles(2500, { shell: [6, 30], sizeMax: 3, sizePow: 5, colors: ['#ffffff', '#c9d2ff', '#ffe2c0'], intensity: .8, twinkle: .6, focus: 8, focusRange: 6, bokeh: 1 }, rng(141)); S.add(stars);
  const L = (h, hi, at, out) => textBlock(S, { x: 960, y: 88, w: 1700, align: 'center', anchor: 'top', out, outDur: .5, items: [
    { k: 'h', text: h, at, size: 72, stagger: .07, style: { display: 'inline-block' } }, { k: 'hi', text: hi, at: at + .45, size: 72, color: '#bcb0ff', style: { display: 'inline-block', marginLeft: '18px' } }] });
  textBlock(S, { x: 960, y: 50, w: 600, align: 'center', anchor: 'top', out: 12.2, items: [{ k: 'eyebrow', text: 'In sync', at: .6, color: '#c2c9ff' }] });
  L('Web. iPhone. Android. Browser.', 'On-chain.', 1.1, 4.7);
  L('Each one hands off', 'to the next.', 5.1, 8.4);
  L('All moving', 'as one.', 8.65, 12.2);
  S.on((lt, t) => {
    const out = prog(lt, 0, 2.2, ease.outExpo);
    const r = lerp(4.4, 7.6, out) - prog(lt, 2.2, 12.6, ease.inOutSine) * 1.2;
    const az = lt * .09 - .5, el = lerp(.15, .95, out) + Math.sin(lt * .2) * .1;
    look(cam, [Math.sin(az) * r, el, Math.cos(az) * r], [0, -.15, 0]); drift(cam, lt, .4, 83);
    spins.forEach(s => s.rotation.y = lt * s.userData.o.speed + 1.0);
    const LU = logo.material.uniforms; LU.uSweep.value = ((lt * .35) % 3) - 1; LU.uEmit.value = .08 + hits(t, [145.0], 3) * .3 + beatPulse(t, 5) * .05;
    logo.scale.setScalar(.95 + hits(t, [145.0], 3) * .1);
    core.material.uniforms.uI.value = .2 + hits(t, [145.0], 2.5) * .3 + beatPulse(t, 5) * .06;
    coreHot.material.uniforms.uI.value = .12 + hits(t, [145.0], 3.5) * .3;
    const sh = clamp(lt - .1, 0, 3); shock.scale.setScalar(.5 + ease.outExpo(clamp(sh / 1.6)) * 14); shock.material.uniforms.uI.value = sh > 0 ? (1 - clamp(sh / 1.4)) * 1.2 : 0;
    const handoff = env(lt, 5.0, 8.6, .5, .6);
    rings.forEach((rg, i) => { const u = rg.material.uniforms; u.uHead.value = prog(lt, .3 + i * .2, 2.4 + i * .2, ease.inOutCubic); u.uPulse.value = .4 + handoff * 1.6; u.uPulseSpeed.value = .25 + handoff * .25; u.uI.value = .6 + handoff * .5; });
    orbs.forEach((o, i) => {
      const a = fadeIn(lt, o.t0, .6); o.orb.material.uniforms.uOpacity.value = a; o.lab.material.uniforms.uOpacity.value = a * .9;
      const s = ease.outBack(clamp((lt - o.t0) / .7)); o.orb.material.uniforms.uScale.value = .46 * Math.max(.001, s);
      const hop = Math.floor((t - 150.02) / .25); const lit = (lt > 5 && lt < 8.6 && ((hop % orbs.length) + orbs.length) % orbs.length === i) ? 1 : 0;
      o.orb.material.uniforms.uGlow.value = .5 + lit * 1.5 + beatPulse(t, 6) * .15;
      const su = o.spoke.material.uniforms; su.uHead.value = prog(lt, o.t0 + .1, o.t0 + .8, ease.inOutCubic); su.uTime.value = t * .9 + i * .21; su.uPulse.value = 1 + (lt > 8.6 ? 1 : 0);
    });
    S.flash = hits(t, [145.0], 8) * .3;
  });
  return S;
}

// ---------------------------------------------------------------- $SUEDE — agents that pay, get paid, and prove it.
export function suedeCoin(E) {
  const S = new Shot(E, { fov: 30, sky: { a: '#5a3a08', b: '#2a1a04', c: '#8a5a12', base: '#020100', seed: 7.7, density: .8 }, bloom: { strength: .45, radius: .6, threshold: .97 }, grade: { vig: .55, gain: [1.04, 1, .92] }, focus: 5, focusRange: 3 });
  const cam = S.camera;
  const mask = E.img('logo_mask.png');
  const coin = new THREE.Mesh(new THREE.CylinderGeometry(.92, .92, .11, 160, 1), [M.coinMaterial({ mask }), M.coinMaterial({ mask, face: true }), M.coinMaterial({ mask, face: true })]);
  const coinG = new THREE.Group(); coin.rotation.x = Math.PI / 2; coinG.add(coin); coinG.position.set(-1.4, .05, 0); S.add(coinG);
  const halo = S.add(glow({ size: 3.4, color: '#ffb340', falloff: 5, intensity: .16 })); halo.position.set(-1.4, .05, -.4);
  const ring = []; for (let i = 0; i <= 96; i++) { const a = i / 96 * Math.PI * 2; ring.push([Math.cos(a) * 1.25, Math.sin(a) * .25, Math.sin(a) * 1.25 * .0 + Math.sin(a) * .5]); }
  const orbit = M.makeThread(ring, { segments: 400, width: .02, colorA: '#ffd38a', colorB: '#fff1c9', intensity: 1.4, pulseN: 3, pulseSpeed: .3 }); orbit.position.set(-1.4, .05, 0); orbit.rotation.z = -.25; S.add(orbit);
  const sym = label(S, E, '$SUEDE', { size: 30, tracking: 10, scale: .55, color: 'rgba(255,226,160,.9)' }); sym.position.set(-1.4, -1.18, .1);
  const gold = M.makeParticles(1800, { box: [10, 6, 8], center: [0, 0, -1], sizeMax: 2.6, sizePow: 3, colors: ['#ffd27a', '#fff1c4', '#ffb347'], intensity: .7, twinkle: .9, focus: 5, focusRange: 2.5, bokeh: 1.6 }, rng(151)); S.add(gold);
  const P = [['x402', '#7fb6ff', 'Pay per call, in USDC'], ['AP2', '#c9a6ff', 'Agent payments, authorized'], ['ACP', '#5ee39a', 'Agentic commerce checkout'], ['A2A', '#ff8ab8', 'Agent-to-agent handoffs'],
    ['MCP', '#5fe6dd', 'Tools any model can call'], ['ERC-8004', '#f5a35c', 'On-chain agent identity'], ['Skills', '#ffd38a', '74 skills, one install']];
  textBlock(S, { x: 880, y: 200, w: 900, anchor: 'top', out: 8.0, items: [
    { k: 'eyebrow', text: 'Every payment runs on Agent Studio', at: .4, color: '#f5c76a' },
    { k: 'h', text: 'Agents that pay, get paid,', at: .5, size: 80 },
    { k: 'hi', text: 'and prove it.', at: 1.05, size: 80, color: '#f5c76a' },
    { k: 'raw', html: '<div style="height:34px"></div>', at: 0 },
    ...P.map(([n, c, d], i) => ({ k: 'raw', html: `<div class="proto"><b style="color:${c}">${n}</b><span>${d}</span></div>`, at: 1.6 + i * .25, style: { display: 'inline-block' } }))] });
  S.on((lt, t) => {
    look(cam, [kf(lt, [[0, -.3], [8.6, .2, ease.inOutSine]]), .05, kf(lt, [[0, 5.4], [8.6, 4.9]])], [.1, 0, 0]); drift(cam, lt, .5, 89);
    const spinIn = prog(lt, 0, 2.2, ease.outExpo);
    coinG.rotation.set(Math.sin(lt * .5) * .08, (1 - spinIn) * Math.PI * 3 + Math.sin(lt * .6) * .45 + .25, Math.sin(lt * .4) * .05);
    coinG.position.y = .05 + Math.sin(lt * .9) * .03;
    coin.material.forEach(m => { m.uniforms.uSweep.value = ((lt * .45) % 3) - 1.2; m.uniforms.uI.value = .62 + beatPulse(t, 5) * .06; });
    halo.material.uniforms.uI.value = .14 + beatPulse(t, 4) * .05;
    orbit.material.uniforms.uHead.value = prog(lt, .4, 2.6, ease.inOutCubic);
    sym.material.uniforms.uOpacity.value = fadeIn(lt, 1.0);
    gold.material.uniforms.uDrift.value.set(0, lt * .08, 0);
  });
  return S;
}

// ---------------------------------------------------------------- Mosaic of every surface → the Suede mark
export function mosaic(E) {
  const S = new Shot(E, { fov: 34, sky: { a: '#2a2a8a', b: '#4a1a6a', c: '#1a3a7a', base: '#010108', seed: 12.1, density: .8, intensity: .8 }, bloom: { strength: .45, radius: .65, threshold: .96 }, grade: { vig: .5 }, focus: 3, focusRange: 3 });
  const cam = S.camera;
  // --- atlas
  const CELLS = 16, CS = 256;
  const canvas = document.createElement('canvas'); canvas.width = canvas.height = CELLS * CS;
  const atlas = new THREE.CanvasTexture(canvas); atlas.colorSpace = THREE.SRGBColorSpace; atlas.anisotropy = E.anisotropy;
  const desk = ['agents', 'storybeam', 'guitarhub', 'fretpulse', 'sing', 'ip', 'social', 'strumly', 'muse', 'skills', 'seo', 'distro', 'dna', 'podcast', 'promo', 'cosmos', 'agentix', 'map', 'studio', 'suedeai', 'johnny', 'app'];
  const srcs = [...desk.map(d => E.shot(d + '_desk')), ...desk.map(d => E.shot(d + '_mob')), ...[0, 2, 7, 12, 13, 14, 6].map(n => E.img(`guitarhub_${String(n).padStart(2, '0')}.webp`)), E.img('storybeam_art.png'), E.img('social_00.webp'), E.img('promo_02.jpg'), E.img('storybeam_00.webp'),
    ...[1, 2, 3, 4].map(k => E.card('cin' + k)), ...['agents', 'fretpulse', 'sing', 'ip', 'social', 'cinematic', 'muse', 'strumly', 'studio', 'coin'].map(n => E.card('icon-' + n)), E.card('cert'), E.card('x402'), E.card('catalog'), E.card('theory')];
  const maskTex = E.img('logo_mask.png');
  const G = 64, WALL = 10.5, tile = WALL / G;
  const geo = new THREE.PlaneGeometry(tile * .9, tile * .9);
  const mat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false,
    uniforms: { uAtlas: { value: atlas }, uTime: { value: 0 }, uLt: { value: 0 }, uOut: { value: 1 }, uWave: { value: 0 }, uWaveR: { value: 0 }, uGlow: { value: 0 }, uFocus: { value: 3 }, uFocusRange: { value: 3 }, uMerge: { value: 0 }, uOpacity: { value: 1 } },
    vertexShader: /* glsl */`
      attribute float aCell, aIn, aRand; uniform float uTime, uLt, uWave, uWaveR, uFocus, uFocusRange, uMerge;
      varying vec2 vUv; varying float vCell, vIn, vRand, vCoc, vLift;
      void main(){
        vUv = uv; vCell = aCell; vIn = aIn; vRand = aRand;
        vec4 wp = instanceMatrix * vec4(position, 1.);
        vec2 c = instanceMatrix[3].xy;
        float d = length(c);
        float flow = sin(c.x * 1.3 + c.y * .9 - uTime * 1.6) * .05 + sin(d * 2.2 - uTime * 2.1) * .04;
        float wave = exp(-pow((d - uWaveR) * 2.2, 2.)) * uWave;
        float settle = (1. - smoothstep(0., 1.4, uLt - aRand * 1.2)) * 1.4;
        vLift = wave;
        wp.z += flow * (1. - uMerge) + wave * .6 + settle;
        vec4 mv = modelViewMatrix * wp;
        vCoc = clamp(abs(-mv.z - uFocus) / uFocusRange, 0., 1.);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: /* glsl */`
      uniform sampler2D uAtlas; uniform float uOut, uGlow, uMerge, uOpacity, uLt;
      varying vec2 vUv; varying float vCell, vIn, vRand, vCoc, vLift;
      float sdRB(vec2 p, vec2 b, float r){ vec2 q = abs(p) - b + r; return length(max(q, 0.)) + min(max(q.x, q.y), 0.) - r; }
      void main(){
        vec2 p = vUv - .5; float d = sdRB(p, vec2(.5), .07); float aa = fwidth(d) * 1.3 + vCoc * .05;
        float a = 1. - smoothstep(-aa, aa, d);
        float cx = mod(vCell, 16.), cy = floor(vCell / 16.);
        vec2 auv = (vec2(cx, 15. - cy) + vec2(vUv.x * .96 + .02, vUv.y * .96 + .02)) / 16.;
        vec3 col = texture(uAtlas, auv, vCoc * 3.).rgb * .9;
        float edge = 1. - smoothstep(0., aa * 2. + .02, abs(d + .01));
        col += vec3(.75, .8, 1.) * edge * .25;
        float vis = mix(uOut * .35, 1., vIn);
        float appear = smoothstep(0., .6, uLt - vRand * 1.2);
        col *= mix(.55, 1., vIn) * (1. + vLift * 1.2);
        col += vec3(.75, .78, 1.) * (uGlow * vIn + vLift * .5);
        col = mix(col, vec3(.62, .66, .8) * (.8 + uGlow * .4), uMerge * vIn);
        gl_FragColor = vec4(col, a * vis * appear * uOpacity * mix(1., vIn, uMerge));
      }`,
  });
  const inst = new THREE.InstancedMesh(geo, mat, G * G); inst.count = 0; inst.frustumCulled = false; S.add(inst);
  const ready = Promise.all([...srcs.map(t => t.userData.ready), maskTex.userData.ready]).then(() => {
    const x = canvas.getContext('2d'); x.fillStyle = '#0b0c14'; x.fillRect(0, 0, canvas.width, canvas.height);
    const R = rng(7); const cells = [];
    srcs.forEach((t, i) => { const im = t.image, w = im.width, h = im.height;
      const crops = [];
      if (w > h * 1.2) { const s = Math.min(h, w * .55); crops.push([w * .04, 0, s, s], [w - s - w * .04, h * .1, s, s]); }
      else if (h > w * 1.3) { crops.push([0, h * .02, w, w], [0, h * .3, w, w]); }
      else crops.push([0, 0, Math.min(w, h), Math.min(w, h)]);
      crops.forEach(c => cells.push([im, ...c])); });
    for (let i = 0; i < CELLS * CELLS; i++) { const [im, sx, sy, sw, sh] = cells[i % cells.length]; const cx = i % CELLS, cy = Math.floor(i / CELLS); x.drawImage(im, sx, sy, sw, sh, cx * CS, cy * CS, CS, CS); }
    atlas.needsUpdate = true;
    // mask sampling
    const mc = document.createElement('canvas'); mc.width = mc.height = 400; const mx = mc.getContext('2d'); mx.drawImage(maskTex.image, 0, 0, 400, 400);
    const md = mx.getImageData(0, 0, 400, 400).data;
    const m4 = new THREE.Matrix4(); const cellA = [], inA = [], rA = []; let n = 0;
    const span = WALL;               // wall covers the logo bbox (logo occupies ~61% of the mask image)
    for (let gy = 0; gy < G; gy++) for (let gx = 0; gx < G; gx++) {
      const wx = (gx + .5) / G * span - span / 2, wy = (gy + .5) / G * span - span / 2;
      const u = .5 + wx / (span / .62), v = .5 - wy / (span / .62);
      let inside = 0; if (u > 0 && u < 1 && v > 0 && v < 1) inside = md[(Math.floor(v * 400) * 400 + Math.floor(u * 400)) * 4 + 3] / 255;
      const isIn = inside > .45 ? 1 : 0;
      if (!isIn && R() < .35) continue;
      m4.makeTranslation(wx, wy, 0); inst.setMatrixAt(n, m4);
      cellA.push(Math.floor(R() * CELLS * CELLS)); inA.push(isIn); rA.push(R()); n++;
    }
    inst.count = n; inst.instanceMatrix.needsUpdate = true;
    const pad = a => { const f = new Float32Array(G * G); f.set(a); return new THREE.InstancedBufferAttribute(f, 1); };
    geo.setAttribute('aCell', pad(cellA)); geo.setAttribute('aIn', pad(inA)); geo.setAttribute('aRand', pad(rA));
  });
  E.pending.push(ready);
  const logo = new THREE.Mesh(new THREE.PlaneGeometry(WALL / .62 * 1, WALL / .62 * 1), M.logoMaterial({ mask: maskTex, colorA: '#e3e7f4', colorB: '#7e88b8', intensity: .72, emit: .05 })); logo.position.z = .2; S.add(logo);
  const halo = S.add(glow({ size: 16, color: '#5d5cff', falloff: 4, intensity: 0 })); halo.position.z = -1;
  const scrim = document.createElement('div'); scrim.style.cssText = 'position:absolute;inset:0;background:radial-gradient(ellipse 60% 45% at 50% 50%,rgba(2,2,10,.78),rgba(2,2,10,.35) 60%,transparent 85%)'; S.dom.appendChild(scrim);
  textBlock(S, { x: 960, y: 540, w: 1600, align: 'center', anchor: 'middle', out: 5.9, outDur: .7, items: [
    { k: 'h', text: 'Workflows you could', at: 1.0, size: 118 }, { k: 'h', text: 'only dream of.', at: 1.5, size: 118 }] });
  textBlock(S, { x: 960, y: 540, w: 1600, align: 'center', anchor: 'middle', out: 12.0, outDur: .8, items: [
    { k: 'hi', text: 'Now they simply flow.', at: 9.6, size: 124, color: '#c2b6ff' }] });
  S.on((lt, t) => {
    // phase 1: low flyover; phase 2: pull back to reveal; phase 3: merge into the mark
    const pull = prog(lt, 6.2, 12.4, ease.inOutCubic);
    const fly = [lerp(-3.2, -.6, prog(lt, 0, 7, ease.inOutSine)), lerp(-3.6, -1.6, prog(lt, 0, 7, ease.inOutSine)), 1.6];
    const far = [0, -.3, 18.4 - prog(lt, 12.4, 17.7, ease.inOutSine) * 2.4];
    const pos = [lerp(fly[0], far[0], pull), lerp(fly[1], far[1], pull), lerp(fly[2], far[2], pull)];
    const tgt = [lerp(fly[0] + 1.2, 0, pull), lerp(fly[1] + 2.4, 0, pull), 0];
    look(cam, pos, tgt, lerp(.25, 0, pull)); drift(cam, lt, .5, 97);
    S.focus = lerp(2.2, pos[2], pull) * (pull > .5 ? 1 : 1); S.focusRange = lerp(1.6, 8, pull);
    const u = mat.uniforms; u.uLt.value = lt; u.uTime.value = t;
    u.uOut.value = 1 - prog(lt, 8.5, 11.5, ease.inOutCubic);
    const wv = Math.max(hits(t, [173.02], .9), hits(t, [177.02], .9));
    u.uWave.value = wv * .8; u.uWaveR.value = Math.max(0, (t - (t > 177.02 ? 177.02 : 173.02))) * 3.2;
    u.uGlow.value = beatPulse(t, 5) * .06 * pull + prog(lt, 14.6, 16.4) * .2;
    u.uMerge.value = prog(lt, 15.0, 16.8, ease.inOutCubic);
    u.uFocus.value = S.focus; u.uFocusRange.value = S.focusRange;
    const lu = logo.material.uniforms; lu.uOpacity.value = prog(lt, 15.4, 17.0, ease.inOutCubic); lu.uSweep.value = kf(lt, [[15.8, -1], [17.4, 1.3]]); lu.uEmit.value = .12 * (1 - prog(lt, 16.2, 17.6));
    halo.material.uniforms.uI.value = .12 * pull + prog(lt, 15, 16.6) * .1;
    scrim.style.opacity = (env(lt, .7, 6.1, .6, .6) + env(lt, 9.3, 12.2, .6, .7)).toFixed(3);
  });
  return S;
}

// ---------------------------------------------------------------- End card
export function endCard(E) {
  const S = new Shot(E, { fov: 30, sky: { a: '#2a2f8f', b: '#5b2a8a', c: '#123a7a', base: '#010208', seed: 2.3, density: .9 }, bloom: { strength: .8, radius: .7, threshold: .88 }, grade: { vig: .55 } });
  const cam = S.camera;
  const logo = new THREE.Mesh(new THREE.PlaneGeometry(.64, .64), M.logoMaterial({ mask: E.img('logo_mask.png'), colorA: '#ffffff', colorB: '#8e98d0', intensity: .95, emit: .05 })); logo.position.set(0, .66, 0); S.add(logo);
  const halo = S.add(glow({ size: 2.2, color: '#5a5cff', falloff: 4, intensity: .2 })); halo.position.set(0, .66, -.3);
  const ring = []; for (let i = 0; i <= 96; i++) { const a = i / 96 * Math.PI * 2 + Math.PI / 2; ring.push([Math.cos(a) * .52, .66 + Math.sin(a) * .52, 0]); }
  const loop = S.add(M.makeThread(ring, { segments: 400, width: .012, colorA: '#ffd9a0', colorB: '#9d8bff', intensity: 1.5, pulseN: 1, pulseSpeed: .3 }));
  const motes = dustField(S, { colors: ['#ffffff', '#c3c9ff'], intensity: .4 }, 171);
  const doms = ['suedeai.ai', 'agents.suedeai.ai', 'storybeamkids.com', 'guitarhub.org', 'fretpulse.suedeai.ai', 'sing.suedeai.ai', 'social.suedeai.ai', 'strumly.suedeai.ai', 'ip.suedeai.ai', 'map.suedeai.ai', 'skills.suedeai.ai', 'muse.suedeai.ai'];
  const plat = ['11 iOS apps', '6 Android apps', 'Chrome &amp; Edge extensions', '<b>x402 · AP2 · ACP · A2A</b>', '<b>$SUEDE</b>'];
  textBlock(S, { x: 960, y: 548, w: 1700, align: 'center', anchor: 'top', out: 99, items: [
    { k: 'h', text: 'Suede', at: .35, size: 136, style: { display: 'inline-block' } }, { k: 'hi', text: 'AI', at: .6, size: 136, color: '#bcb0ff', style: { display: 'inline-block', marginLeft: '26px' } },
    { k: 'raw', html: '<div style="font:400 36px Instrument Serif;color:rgba(236,238,252,.86);margin-top:2px">The workforce that works while you sleep.</div>', at: 1.0 },
    { k: 'chips', text: doms, at: 1.6, stagger: .04, style: { marginTop: '34px', maxWidth: '1500px', marginLeft: 'auto', marginRight: 'auto', whiteSpace: 'normal', lineHeight: '2.5' } },
    { k: 'chips', text: plat, at: 2.2, stagger: .06, style: { marginTop: '4px' } },
    { k: 'icons', text: ['suede', 'agents', 'storybeam', 'guitarhub', 'fretpulse', 'sing', 'ip', 'social', 'map', 'cinematic', 'muse', 'voice', 'strumly', 'studio'].map(n => icon(n, 46)), at: 2.6, stagger: .04, style: { marginTop: '22px' } }] });
  S.on((lt, t) => {
    look(cam, [0, .05, kf(lt, [[0, 5.6], [6.6, 5.2, ease.outSine]])], [0, .05, 0]); drift(cam, lt, .35, 101);
    const L = logo.material.uniforms; L.uReveal.value = 1; L.uSweep.value = kf(lt, [[.6, -1], [2.0, 1.3]]); L.uOpacity.value = fadeIn(lt, 0, .8);
    loop.material.uniforms.uHead.value = prog(lt, .4, 2.6, ease.inOutCubic);
    halo.material.uniforms.uI.value = .18 + beatPulse(t, 4) * .06 * (1 - prog(lt, 1, 3));
    S.fade = 1 - prog(lt, 4.6, 6.45, ease.inOutSine);
  });
  return S;
}
