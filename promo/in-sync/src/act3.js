// ACT III — One house (54–145s): registry, front doors, apps, flows, agents, SEO hub + breakdown.
import * as THREE from 'three';
import { Shot, browser, phone, card, glow, drift, look, reflect, syncReflection, M } from './engine.js';
import { textBlock } from './text.js';
import { title, dustField, label, setOpacity, rise, sheen, curve } from './kit.js';
import { kf, prog, env, ease, clamp, lerp, rng, hits, beatPulse, noise1, sstep, onBeat } from './util.js';
import { URLS } from './act1.js';

const icon = (n, s = 60) => `<img src="assets/cards/icon-${n}.png" style="width:${s}px;height:${s}px">`;
const fadeIn = (lt, t0, d = .5) => ease.outCubic(clamp((lt - t0) / d));

// ---------------------------------------------------------------- IP Registry (drop at 54.0)
export function ipRegistry(E) {
  const S = new Shot(E, { fov: 30, sky: { a: '#0f6a40', b: '#123d2a', c: '#2a8a5a', base: '#010503', seed: 5.7, density: .85 }, bloom: { strength: .6, radius: .6, threshold: .95 }, grade: { vig: .5 }, focus: 5, focusRange: 4.5 });
  const cam = S.camera;
  const web = browser(E, 'ip_desk', { w: 2.15, url: 'ip.suedeai.ai', rim: '#86e3ae', rimAmt: .3 }); web.position.set(1.55, .32, -1.2); web.rotation.y = -.2; S.add(web);
  const cert = card(E, E.card('cert'), { w: 1.5, bright: .8, sheenAmt: .08, alpha: true }); cert.position.set(1.15, -.38, .3); S.add(cert);
  const stamp = card(E, E.card('stamp'), { w: .44, bright: 1, sheenAmt: 0 }); S.add(stamp);
  const g = S.add(glow({ size: 3.6, color: '#2fd17f', falloff: 3, intensity: .16 })); g.position.set(1.2, -.2, -1.0);
  const th = S.add(M.makeThread([[-3.2, -1.3, .3], [-.6, -1.05, .4], [.9, -.95, .6], [2.4, -.2, -.3], [3.8, .9, -1.6]], { colorA: '#86e3ae', colorB: '#f4efe2', width: .03, intensity: 1.3, pulseN: 3, pulseSpeed: .4 }));
  const dustP = dustField(S, { colors: ['#ffffff', '#b9f3d2'], intensity: .45 }, 71);
  const step = (n, a, b) => `<div class="step"><b>0${n}</b>${a}<span>${b}</span></div>`;
  title(S, { at: .35, eyebrow: 'Suede AI IP Registry · ip.suedeai.ai', color: '#86e3ae', lines: ['Your music,'], hi: 'on the record.', size: 104, y: 470, out: 8.0,
    extra: [{ k: 'raw', html: '<div style="height:26px"></div>' + step(1, 'Upload it.', 'Your finished file is fingerprinted.'), at: 1.55 },
      { k: 'raw', html: step(2, 'It’s written down.', 'A public, timestamped record.'), at: 2.55 },
      { k: 'raw', html: step(3, 'You hold the certificate.', 'Verify it on-chain.'), at: 3.55 }] });
  S.on((lt, t) => {
    const shake = hits(t, [58.02], 9) * .012;
    look(cam, [kf(lt, [[0, .9], [8.6, .5, ease.inOutSine]]) + noise1(t * 40, 2) * shake, .05 + noise1(t * 40, 5) * shake, kf(lt, [[0, 5.0], [8.6, 4.6]])], [.65, -.02, 0]); drift(cam, lt, .5, 29);
    const pw = prog(lt, .1, 1.4, ease.outExpo); web.position.y = .32 - (1 - pw) * .5; web.material.uniforms.uOpacity.value = fadeIn(lt, .1);
    const pc = prog(lt, .5, 1.9, ease.outExpo);
    cert.position.set(1.15 + (1 - pc) * .8, -.38, .3 - (1 - pc) * .6); cert.rotation.set(-.05 * pc + .3 * (1 - pc), -.1 - (1 - pc) * .7, .02); cert.material.uniforms.uOpacity.value = fadeIn(lt, .5);
    const ps = clamp((lt - 4.0) / .22); const pse = ease.outExpo(ps);
    stamp.position.set(1.15 + .5, -.38 - .22, .36 + (1 - pse) * 1.2); stamp.scale.setScalar(.44 * (1 + (1 - pse) * 1.6)); stamp.material.uniforms.uOpacity.value = ps > 0 ? Math.min(1, ps * 3) : 0;
    stamp.rotation.copy(cert.rotation);
    S.flash = hits(t, [54.0], 8) * .35 + hits(t, [58.02], 10) * .18;
    const tu = th.material.uniforms; tu.uHead.value = prog(lt, .2, 3.0, ease.inOutCubic);
    sheen(web, lt, .25); cert.material.uniforms.uSheen.value = kf(lt, [[4.0, -1.2], [5.4, 1.6]]);
  });
  return S;
}

// ---------------------------------------------------------------- Suede Labs wordmark beat
export function wordmark(E) {
  const S = new Shot(E, { fov: 30, sky: { a: '#1b2a6a', b: '#2a1a5a', c: '#0f3a5a', base: '#010208', seed: 15.2, density: .7 }, bloom: { strength: .7, radius: .7, threshold: .9 }, grade: { vig: .55 } });
  const cam = S.camera;
  const logo = new THREE.Mesh(new THREE.PlaneGeometry(.82, .82), M.logoMaterial({ mask: E.img('logo_mask.png'), colorA: '#e8ecf7', colorB: '#6f7aa6', intensity: .9 })); logo.position.set(-1.3, 0, 0); S.add(logo);
  const halo = S.add(glow({ size: 2.2, color: '#5d6cff', falloff: 4, intensity: .12 })); halo.position.set(-1.3, 0, -.3);
  textBlock(S, { x: 860, y: 540, w: 900, anchor: 'middle', out: 2.3, outDur: .3, items: [
    { k: 'eyebrow', text: 'suedeai.ai & every sub-apex', at: .25, color: '#9fb0ff', style: { marginBottom: '18px' } },
    { k: 'raw', html: '<span style="font:300 132px/1 Inter;letter-spacing:-.045em;color:#eef0f8">suede</span><span style="font:600 132px/1 Inter;letter-spacing:-.045em;color:#eef0f8">labs</span>', at: .15, dur: .9 }] });
  S.on((lt, t) => {
    look(cam, [0, 0, kf(lt, [[0, 5.3], [2.6, 4.9]])], [0, 0, 0]); drift(cam, lt, .4, 31);
    const L = logo.material.uniforms; L.uReveal.value = prog(lt, 0, .7, ease.outCubic); L.uSweep.value = kf(lt, [[.5, -1], [1.8, 1.4]]);
    logo.rotation.z = kf(lt, [[0, .5], [.9, 0, ease.outExpo]]);
  });
  return S;
}

// ---------------------------------------------------------------- A dozen front doors. One house.
export function frontDoors(E) {
  const S = new Shot(E, { fov: 30, sky: { a: '#2a2a8a', b: '#3a1a6a', c: '#14407a', base: '#02020b', seed: 9.9, density: .9 }, bloom: { strength: .55, radius: .6, threshold: .96 }, grade: { vig: .45 }, focus: 5.4, focusRange: 5 });
  const cam = S.camera;
  const names = ['suedeai', 'app', 'social', 'strumly', 'muse', 'skills', 'seo', 'distro', 'dna', 'podcast', 'promo', 'cosmos'];
  const W_ = .92, panels = [], labels = [];
  const pos = (i) => { const c = i % 4, r = Math.floor(i / 4); return [(c - 1.5) * 1.06, .5 - r * .74 - .16, -.28 * (c - 1.5) ** 2 + .1]; };
  names.forEach((n, i) => {
    const p = browser(E, n + '_desk', { w: W_, url: URLS[n], rimAmt: .3, bright: .84 }); const P = pos(i);
    p.position.set(...P); p.rotation.y = -(i % 4 - 1.5) * .14; p.userData.base = p.position.clone(); p.userData.t0 = .35 + i * .125; S.add(p); panels.push(p);
    const l = label(S, E, URLS[n], { size: 30, color: 'rgba(230,234,255,.85)', tracking: 2, scale: .62, dot: '#9fb0ff' }); l.position.set(P[0], P[1] - .36, P[2] + .02); l.rotation.y = p.rotation.y; labels.push(l);
  });
  const snake = [0, 1, 2, 3, 7, 6, 5, 4, 8, 9, 10, 11].map(i => { const P = pos(i); return [P[0], P[1], P[2] - .12]; });
  const th = S.add(M.makeThread([[-3.4, .2, -.3], ...snake, [3.4, -.9, -.3]], { colorA: '#9d8bff', colorB: '#ffd38a', width: .03, intensity: 1.4, pulseN: 3, pulseSpeed: .3 }));
  const dustP = dustField(S, { colors: ['#ffffff', '#c3c9ff'], intensity: .4 }, 81);
  textBlock(S, { x: 960, y: 92, w: 1600, align: 'center', anchor: 'top', out: 9.8, items: [
    { k: 'eyebrow', text: 'suedeai.ai & every sub-apex', at: .3, color: '#aab4ff' },
    { k: 'h', text: 'A dozen front doors.', at: .4, size: 80, style: { display: 'inline-block' } },
    { k: 'hi', text: 'One house.', at: .95, size: 80, color: '#b9a8ff', style: { display: 'inline-block', marginLeft: '20px' } }] });
  S.on((lt, t) => {
    look(cam, [kf(lt, [[0, -.45], [10.6, .45, ease.inOutSine]]), kf(lt, [[0, .1], [10.6, -.05]]), kf(lt, [[0, 6.1], [10.6, 5.5, ease.inOutSine]])], [0, -.2, 0]); drift(cam, lt, .5, 37);
    const beatIdx = Math.floor((t - 66.02) / .5);
    panels.forEach((p, i) => {
      const pr = prog(lt, p.userData.t0, p.userData.t0 + 1.1, ease.outExpo), b = p.userData.base;
      p.position.set(b.x, b.y - (1 - pr) * .25, b.z - (1 - pr) * 2.2); p.material.uniforms.uOpacity.value = fadeIn(lt, p.userData.t0, .45);
      const hot = beatIdx >= 0 && snake.length && [0, 1, 2, 3, 7, 6, 5, 4, 8, 9, 10, 11][((beatIdx % 12) + 12) % 12] === i ? beatPulse(t, 3) : 0;
      p.material.uniforms.uGlow.value = hot * .06; p.material.uniforms.uRimAmt.value = .3 + hot * .8;
      labels[i].material.uniforms.uOpacity.value = fadeIn(lt, p.userData.t0 + .4) * .9;
    });
    sheen(S.scene, lt, .25);
    th.material.uniforms.uHead.value = prog(lt, 1.6, 6.5, ease.inOutSine);
  });
  return S;
}

// ---------------------------------------------------------------- Eleven apps. In your pocket.
export function apps(E) {
  const S = new Shot(E, { fov: 30, sky: { a: '#2a2a9a', b: '#3a1460', c: '#123a7a', base: '#02020a', seed: 21.1, density: 1 }, bloom: { strength: .55, radius: .6, threshold: .96 }, grade: { vig: .5 }, focus: 4.6, focusRange: 3.5 });
  const cam = S.camera;
  const shots = ['agents', 'storybeam', 'guitarhub', 'fretpulse', 'sing', 'social', 'strumly', 'ip', 'studio', 'muse', 'app'];
  const ring = new THREE.Group(); ring.position.set(2.3, 0, -2.3); S.add(ring);
  const R = 1.75, floorY = -.72;
  const phones = shots.map((n, i) => { const p = phone(E, n + '_mob', { h: 1.18, metal: '#8f97b8', rim: '#dfe4ff' }); p.userData.a0 = i / shots.length * Math.PI * 2; ring.add(p); return p; });
  const refl = phones.map(p => { const r = reflect(p, floorY, .28); S.add(r); return r; });
  const floorGlow = S.add(glow({ sx: 7, sy: 1.6, color: '#5a5cff', falloff: 3, intensity: .1, billboard: false })); floorGlow.rotation.x = -Math.PI / 2; floorGlow.position.set(2.3, floorY - .01, -2.3);
  const dustP = dustField(S, { colors: ['#ffffff', '#c3c9ff'], intensity: .4 }, 91);
  const icons = ['agents', 'storybeam', 'guitarhub', 'fretpulse', 'sing', 'social', 'strumly', 'ip', 'studio', 'muse', 'suede'].map(n => icon(n, 60));
  title(S, { at: .35, eyebrow: 'App Store · iPhone & iPad', color: '#a9b8ff', lines: ['Eleven apps.'], hi: 'In your pocket.', size: 112, y: 500, out: 8.0,
    extra: [{ k: 'icons', text: icons, at: 1.55, stagger: .125, style: { width: '520px', whiteSpace: 'normal' } }] });
  const tmpV = new THREE.Vector3(), tmpC = new THREE.Vector3();
  S.on((lt, t) => {
    look(cam, [kf(lt, [[0, -.1], [8.6, .25, ease.inOutSine]]), .38, kf(lt, [[0, 5.5], [8.6, 4.9]])], [1.15, -.05, 0]); drift(cam, lt, .5, 41);
    const spin = lt * .34 + .2 - (1 - prog(lt, 0, 1.6, ease.outExpo)) * 1.2;
    cam.updateMatrixWorld(); cam.getWorldPosition(tmpC);
    phones.forEach((p, i) => {
      const a = p.userData.a0 + spin;
      p.position.set(Math.sin(a) * R, -.12 + Math.sin(lt * .8 + i) * .015, Math.cos(a) * R); p.rotation.set(0, a, 0);
      p.updateMatrixWorld(); p.getWorldPosition(tmpV);
      const facing = Math.cos(a - Math.atan2(tmpC.x - ring.position.x, tmpC.z - ring.position.z));
      const ndc = tmpV.clone().project(cam).x;
      setOpacity(p, (.25 + .75 * sstep(-.2, .7, facing)) * fadeIn(lt, .1 + i * .06) * sstep(-.3, .02, ndc));
      p.userData.mat.uniforms.uScroll.value = 0;
    });
    refl.forEach(r => { r.userData.reflectOf.updateMatrixWorld(); const o = r.userData.reflectOf; o.getWorldPosition(tmpV); const q = new THREE.Quaternion(); o.getWorldQuaternion(q);
      r.position.set(tmpV.x, 2 * floorY - tmpV.y, tmpV.z); r.quaternion.copy(q); r.scale.set(1, -1, 1);
      const so = [], dd = []; o.traverse(x => x.material && so.push(x)); r.traverse(x => x.material && dd.push(x)); so.forEach((s, k) => { dd[k].material.uniforms.uOpacity.value = s.material.uniforms.uOpacity.value; }); });
    sheen(S.scene, lt, .3);
  });
  return S;
}

// ---------------------------------------------------------------- On Android. In your browser.
export function android(E) {
  const S = new Shot(E, { fov: 30, sky: { a: '#10507a', b: '#2a2a7a', c: '#0f6a5a', base: '#01030a', seed: 33.3, density: .85 }, bloom: { strength: .55, radius: .6, threshold: .96 }, grade: { vig: .45 }, focus: 5, focusRange: 4.5 });
  const cam = S.camera;
  const a1 = phone(E, 'agents_mob', { h: 1.32, android: true, metal: '#6f7a8c', rim: '#d6f5ff', bright: .8 }); a1.position.set(-1.25, -.28, .35); a1.rotation.y = .3; S.add(a1);
  const a2 = phone(E, 'studio_mob', { h: 1.22, android: true, metal: '#6f7a8c', rim: '#d6f5ff' }); a2.position.set(-2.05, -.3, -.35); a2.rotation.y = .45; S.add(a2);
  const web = browser(E, 'suedeai_desk', { w: 2.3, url: 'suedeai.ai', rimAmt: .25, bright: .8, dark: false }); web.position.set(1.05, -.15, -.45); web.rotation.y = -.16; S.add(web);
  const pop = card(E, E.shot('sing_mob'), { w: .62, alpha: false, radius: .025, aspect: 393 / 640, bright: .92, rimAmt: .35, rim: '#cfe7ff' });
  pop.material.uniforms.uView.value = (786 / 1704) / (393 / 640); S.add(pop);
  const l1 = label(S, E, 'GOOGLE PLAY · 6 APPS', { size: 28, tracking: 6, scale: .95, color: 'rgba(214,245,255,.85)' }); l1.position.set(-1.55, -1.13, .3);
  const l2 = label(S, E, 'CHROME · EDGE · 2 EXTENSIONS', { size: 28, tracking: 6, scale: .95, color: 'rgba(214,245,255,.85)' }); l2.position.set(1.05, -1.13, .1);
  const th = S.add(M.makeThread([[-3.4, -.9, .2], [-1.25, -.95, .5], [0, -.7, .3], [1.05, -.9, .2], [3.4, -.6, -.4]], { colorA: '#7fe3ff', colorB: '#a9b8ff', width: .025, intensity: 1.3, pulseN: 3, pulseSpeed: .4 }));
  const dustP = dustField(S, { colors: ['#ffffff', '#bfefff'], intensity: .4 }, 93);
  textBlock(S, { x: 960, y: 96, w: 1600, align: 'center', anchor: 'top', out: 8.0, items: [
    { k: 'h', text: 'On Android.', at: .35, size: 84, style: { display: 'inline-block' } },
    { k: 'hi', text: 'In your browser.', at: .8, size: 84, color: '#8fe3ff', style: { display: 'inline-block', marginLeft: '22px' } }] });
  S.on((lt, t) => {
    look(cam, [kf(lt, [[0, -.35], [8.6, .3, ease.inOutSine]]), .05, kf(lt, [[0, 5.5], [8.6, 5.0]])], [0, -.15, 0]); drift(cam, lt, .5, 43);
    [a2, a1].forEach((p, i) => { rise(p, lt, .2 + i * .25, 1.2, [0, -1.0, 0]); setOpacity(p, fadeIn(lt, .2 + i * .25)); p.userData.mat.uniforms.uScroll.value = 0; });
    const pw = prog(lt, .5, 1.8, ease.outExpo); web.position.x = 1.05 + (1 - pw) * 1.4; web.material.uniforms.uOpacity.value = fadeIn(lt, .5);
    const pp = prog(lt, 2.0, 2.7, ease.outExpo);
    pop.position.set(1.05 + .62 + (1 - pw) * 1.4, .52 - (pop.userData.h || 1) * .5 * pp, -.45 + .22); pop.rotation.y = web.rotation.y;
    pop.scale.y = Math.max(.001, (pop.userData.h || 1) * pp); pop.material.uniforms.uOpacity.value = clamp(pp * 2);
    [l1, l2].forEach((l, i) => l.material.uniforms.uOpacity.value = fadeIn(lt, 1.2 + i * .3) * .9);
    th.material.uniforms.uHead.value = prog(lt, .3, 3.5, ease.inOutCubic);
    sheen(S.scene, lt, .3);
  });
  return S;
}

// ---------------------------------------------------------------- Learn + share
function flowRow(S, E, items, o) {
  // items: [{obj, label}] already positioned; adds connecting thread + labels
  const pts = [[-3.6, o.y, o.z ?? -.2], ...items.map(it => [it.obj.position.x, o.y, it.obj.position.z - .15]), [3.8, o.y, o.z ?? -.2]];
  const th = S.add(M.makeThread(pts, { colorA: o.ca, colorB: o.cb, width: .03, intensity: 1.5, pulseN: 3, pulseSpeed: .45 }));
  const labels = items.map(it => { const l = label(S, E, it.label, { size: 26, tracking: 6, scale: .95, color: o.lc || 'rgba(235,235,255,.8)' }); l.position.set(it.obj.position.x, o.ly, it.obj.position.z + .05); return l; });
  return { th, labels };
}

export function learn(E) {
  const S = new Shot(E, { fov: 30, sky: { a: '#6a1a5a', b: '#2a1460', c: '#8a2a5a', base: '#040108', seed: 44.4, density: .9 }, bloom: { strength: .6, radius: .6, threshold: .95 }, grade: { vig: .45 }, focus: 5.2, focusRange: 4 });
  const cam = S.camera;
  const sh = [['guitarhub_mob', 'GUITARHUB LESSONS'], ['strumly_mob', 'STRUMLY COACH'], ['fretpulse_mob', 'FRETPULSE'], ['social_mob', 'SUEDE SOCIAL']];
  const items = sh.map(([n, l], i) => { const p = phone(E, n, { h: 1.25, metal: '#a08fb8', rim: '#ffd6ec' }); const x = (i - 1.5) * 1.12;
    p.position.set(x, -.3, -.22 * Math.abs(i - 1.5)); p.rotation.y = -(i - 1.5) * .12; S.add(p); return { obj: p, label: l }; });
  const { th, labels } = flowRow(S, E, items, { y: -.3, ly: -1.07, ca: '#ff7ab0', cb: '#ffd38a' });
  const dustP = dustField(S, { colors: ['#ffffff', '#ffc6e0'], intensity: .4 }, 97);
  textBlock(S, { x: 150, y: 110, w: 1600, anchor: 'top', out: 8.0, items: [
    { k: 'eyebrow', text: 'Learn + share', at: .3, color: '#ff8ab8' },
    { k: 'h', text: 'Practice on GuitarHub, Strumly and FretPulse.', at: .4, size: 66, stagger: .06 },
    { k: 'hi', text: 'Your progress lands on Suede Social.', at: 1.0, size: 66, color: '#ff8ab8', stagger: .06 }] });
  S.on((lt, t) => {
    look(cam, [kf(lt, [[0, -.3], [8.6, .3, ease.inOutSine]]), .12, kf(lt, [[0, 5.6], [8.6, 5.1]])], [0, -.2, 0]); drift(cam, lt, .5, 47);
    items.forEach(({ obj }, i) => { const t0 = .5 + i * .25; rise(obj, lt, t0, 1.2, [0, -1.0, 0]); setOpacity(obj, fadeIn(lt, t0));
      const k = Math.floor((t - 92.02) / .5); obj.userData.mat.uniforms.uScreenGlow.value = (k >= 0 && k % 4 === i ? beatPulse(t, 3.5) : 0) * .03;
      obj.position.y += Math.sin(lt * .8 + i) * .015; });
    labels.forEach((l, i) => l.material.uniforms.uOpacity.value = fadeIn(lt, 1.0 + i * .25) * .85);
    const tu = th.material.uniforms; tu.uHead.value = prog(lt, .8, 3.0, ease.inOutCubic);
    sheen(S.scene, lt, .3);
  });
  return S;
}

// ---------------------------------------------------------------- Create · Prove · Protect
export function create(E) {
  const S = new Shot(E, { fov: 30, sky: { a: '#0f5a3a', b: '#173a2a', c: '#2a7a4a', base: '#010402', seed: 51.5, density: .85 }, bloom: { strength: .6, radius: .6, threshold: .95 }, grade: { vig: .45 }, focus: 5.2, focusRange: 4 });
  const cam = S.camera;
  const ph = phone(E, 'studio_mob', { h: 1.3, metal: '#7f9a8a', rim: '#d6ffe6' }); ph.position.set(-1.65, -.32, .1); ph.rotation.y = .18; S.add(ph);
  const cert = card(E, E.card('cert'), { w: 1.42, bright: .8, sheenAmt: .06 }); cert.position.set(.12, -.3, -.05); S.add(cert);
  const cat = card(E, E.card('catalog'), { w: 1.0, bright: 1, sheenAmt: .08 }); cat.position.set(1.78, -.3, .05); cat.rotation.y = -.18; S.add(cat);
  const items = [{ obj: ph, label: 'AI MUSIC GENERATOR' }, { obj: cert, label: 'IP REGISTRY RECORD' }, { obj: cat, label: 'YOUR MUSIC' }];
  const { th, labels } = flowRow(S, E, items, { y: -.3, ly: -1.12, ca: '#5ee39a', cb: '#f4efe2' });
  const gl = S.add(glow({ size: 2.4, color: '#2fd17f', falloff: 3, intensity: 0 })); gl.position.set(1.78, -.3, -.4);
  const dustP = dustField(S, { colors: ['#ffffff', '#c6ffe0'], intensity: .4 }, 101);
  textBlock(S, { x: 150, y: 110, w: 1600, anchor: 'top', out: 8.0, items: [
    { k: 'eyebrow', text: 'Create · Prove · Protect', at: .3, color: '#7fe3a8' },
    { k: 'h', text: 'Prove the concept with Suede AI music.', at: .4, size: 66, stagger: .06 },
    { k: 'hi', text: 'Then bring your own catalog.', at: 1.0, size: 66, color: '#7fe3a8', stagger: .06 }] });
  S.on((lt, t) => {
    look(cam, [kf(lt, [[0, -.25], [8.6, .3, ease.inOutSine]]), .1, kf(lt, [[0, 5.6], [8.6, 5.1]])], [0, -.2, 0]); drift(cam, lt, .5, 53);
    [ph, cert, cat].forEach((o, i) => { const t0 = .4 + i * 1.0; rise(o, lt, t0, 1.1, [0, -.9, -.4]); setOpacity(o, fadeIn(lt, t0)); });
    labels.forEach((l, i) => l.material.uniforms.uOpacity.value = fadeIn(lt, .9 + i * 1.0) * .85);
    th.material.uniforms.uHead.value = prog(lt, .6, 3.4, ease.inOutCubic);
    cat.material.uniforms.uGlow.value = hits(t, [100.52, 102.02, 104.02], 4) * .05; gl.material.uniforms.uI.value = .12 + hits(t, [100.52], 2) * .2;
    cert.material.uniforms.uSheen.value = ((lt * .3) % 3) - 1.2; cat.material.uniforms.uSheen.value = ((lt * .3 + 1) % 3) - 1.2; sheen(ph, lt, .3);
  });
  return S;
}

// ---------------------------------------------------------------- Suede Cinematic (letterboxed)
export function cinematic(E) {
  const S = new Shot(E, { fov: 30, sky: { a: '#0b5a63', b: '#0a2a3a', c: '#1a8a8a', base: '#000405', seed: 61.6, density: .9 }, bloom: { strength: .7, radius: .65, threshold: .93 }, grade: { vig: .55, sat: 1.05, gain: [.96, 1.02, 1.04] }, focus: 5.6, focusRange: 4 });
  const cam = S.camera;
  const ic = card(E, E.card('icon-cinematic'), { w: .62, bright: 1 }); ic.position.set(-2.15, -.32, .1); S.add(ic);
  const icg = S.add(glow({ size: 1.6, color: '#3fe0d8', falloff: 4, intensity: .3 })); icg.position.set(-2.15, -.32, -.1);
  const phones = [1, 2, 3, 4].map((k, i) => { const p = phone(E, null, { map: E.card('cin' + k), h: 1.2, metal: '#5f8f92', rim: '#c9fffb', status: 0 }); p.position.set(-.95 + i * 1.08, -.32, -.05); S.add(p); return p; });
  const items = [{ obj: ic, label: 'SUEDE CINEMATIC' }, ...phones.map((p, i) => ({ obj: p, label: ['TYPE IT. SEE IT.', 'THEN ANIMATE IT', 'YOUR WORK, KEPT', 'OWN IT'][i] }))];
  const { th, labels } = flowRow(S, E, items, { y: -.32, ly: -1.07, ca: '#3fe0d8', cb: '#c9fffb', lc: 'rgba(201,255,251,.75)' });
  const dustP = dustField(S, { colors: ['#ffffff', '#b9fffa'], intensity: .45 }, 103);
  textBlock(S, { x: 150, y: 168, w: 1600, anchor: 'top', out: 7.4, items: [
    { k: 'eyebrow', text: 'Suede Cinematic · Made in Suede Agent Studio', at: .45, color: '#5fe6dd' },
    { k: 'h', text: 'From UGC to superheroes.', at: .55, size: 64, stagger: .06 },
    { k: 'hi', text: 'Born in Suede. Provenance on the record.', at: 1.1, size: 64, color: '#5fe6dd', stagger: .06 }] });
  S.on((lt, t) => {
    S.letterbox = prog(lt, .1, 1.0, ease.inOutCubic) * (1 - prog(lt, 7.5, 8.4, ease.inOutCubic));
    look(cam, [kf(lt, [[0, -.45], [8.6, .25, ease.inOutSine]]), .06, kf(lt, [[0, 6.0], [8.6, 5.45]])], [.05, -.2, 0]); drift(cam, lt, .5, 59);
    rise(ic, lt, .3, 1.0, [0, -.5, 0]); ic.material.uniforms.uOpacity.value = fadeIn(lt, .3);
    phones.forEach((p, i) => { const t0 = .9 + i * .5; rise(p, lt, t0, 1.1, [0, -1.0, 0]); setOpacity(p, fadeIn(lt, t0));
      p.userData.mat.uniforms.uScreenGlow.value = hits(t, [onBeat(220 + i), onBeat(224 + i), onBeat(228 + i)], 4) * .05; });
    labels.forEach((l, i) => l.material.uniforms.uOpacity.value = fadeIn(lt, .8 + i * .5) * .85);
    th.material.uniforms.uHead.value = prog(lt, .7, 3.6, ease.inOutCubic);
    icg.material.uniforms.uI.value = .25 + beatPulse(t, 4) * .15;
    sheen(S.scene, lt, .3);
  });
  return S;
}

// ---------------------------------------------------------------- Agent Studio + Agentix
export function agentix(E) {
  const S = new Shot(E, { fov: 30, sky: { a: '#3a2aa8', b: '#1a1a6a', c: '#5a2a9a', base: '#02020b', seed: 71.7, density: .9 }, bloom: { strength: .6, radius: .6, threshold: .95 }, grade: { vig: .45 }, focus: 5.2, focusRange: 4.5 });
  const cam = S.camera;
  const w1 = browser(E, 'agents_desk', { w: 2.0, url: 'agents.suedeai.ai', rimAmt: .22, bright: .76, dark: false }); w1.position.set(-1.05, -.22, -.8); w1.rotation.y = .24; S.add(w1);
  const w2 = browser(E, 'agentix_desk', { w: 2.1, url: 'agentix.suedeai.ai', rimAmt: .22, bright: .76, dark: false }); w2.position.set(1.12, -.25, .05); w2.rotation.y = -.2; S.add(w2);
  const R = rng(5); const chart = []; let y = -1.15;
  for (let i = 0; i <= 26; i++) { const x = -2.9 + i * .23; y += .045 + (R() - .45) * .09; chart.push([x, y, .75]); }
  const th = S.add(M.makeThread(chart, { colorA: '#9d8bff', colorB: '#5ee39a', width: .03, intensity: 1.6, pulseN: 2, pulseSpeed: .35 }));
  const tip = S.add(glow({ size: .35, color: '#9dffc9', falloff: 6, intensity: 0 }));
  const dustP = dustField(S, { colors: ['#ffffff', '#cfc6ff'], intensity: .4 }, 107);
  textBlock(S, { x: 150, y: 110, w: 1600, anchor: 'top', out: 9.8, items: [
    { k: 'eyebrow', text: 'Launch + track', at: .3, color: '#b0a2ff' },
    { k: 'h', text: 'Launch agents on Agent Studio.', at: .4, size: 66, stagger: .06 },
    { k: 'hi', text: 'Track yours, and everyone else’s, on Agentix.', at: 1.0, size: 66, color: '#b0a2ff', stagger: .06 }] });
  const crv = th.curve;
  S.on((lt, t) => {
    look(cam, [kf(lt, [[0, -.3], [10.6, .35, ease.inOutSine]]), .08, kf(lt, [[0, 5.7], [10.6, 5.05]])], [0, -.25, 0]); drift(cam, lt, .5, 61);
    rise(w1, lt, .3, 1.3, [-.8, 0, -.6]); w1.material.uniforms.uOpacity.value = fadeIn(lt, .3);
    rise(w2, lt, .7, 1.3, [.9, 0, -.6]); w2.material.uniforms.uOpacity.value = fadeIn(lt, .7);
    const h = prog(lt, 1.6, 6.0, ease.inOutSine); th.material.uniforms.uHead.value = h;
    const p = crv.getPointAt(clamp(h, 0, .999)); tip.position.copy(p); tip.material.uniforms.uI.value = h > 0 && h < 1 ? 1.2 : (h >= 1 ? .6 + beatPulse(t, 4) * .6 : 0);
    sheen(S.scene, lt, .25);
  });
  return S;
}

// ---------------------------------------------------------------- Strumly for agents
export function strumlyAgents(E) {
  const S = new Shot(E, { fov: 30, sky: { a: '#6a4a10', b: '#3a2406', c: '#8a6a1a', base: '#030200', seed: 81.8, density: .8 }, bloom: { strength: .65, radius: .65, threshold: .94 }, grade: { vig: .5, gain: [1.04, 1.0, .9] }, focus: 5.2, focusRange: 4 });
  const cam = S.camera;
  const web = browser(E, 'strumly_desk', { w: 1.85, url: 'strumly.suedeai.ai/agents', rimAmt: .3, rim: '#ffd38a' }); web.position.set(-1.45, -.3, -.25); web.rotation.y = .2; S.add(web);
  const c1 = card(E, E.card('x402'), { w: 1.05, bright: 1, sheenAmt: .08 }); c1.position.set(.45, -.3, .15); S.add(c1);
  const c2 = card(E, E.card('theory'), { w: 1.05, bright: 1, sheenAmt: .08 }); c2.position.set(1.85, -.3, -.1); c2.rotation.y = -.18; S.add(c2);
  const items = [{ obj: web, label: 'STRUMLY' }, { obj: c1, label: 'AGENTIC SEARCH' }, { obj: c2, label: 'TRAINING DATABASE' }];
  const { th, labels } = flowRow(S, E, items, { y: -.3, ly: -1.05, ca: '#f5c76a', cb: '#fff1c9', lc: 'rgba(255,236,200,.75)' });
  const gold = M.makeParticles(900, { box: [10, 6, 8], center: [0, 0, -1.5], sizeMax: 2.5, colors: ['#ffd27a', '#fff1c4'], intensity: .55, twinkle: .8, focus: 5, focusRange: 3 }, rng(111)); S.add(gold);
  textBlock(S, { x: 150, y: 110, w: 1600, anchor: 'top', out: 7.8, items: [
    { k: 'eyebrow', text: 'Strumly for agents · strumly.suedeai.ai/agents', at: .3, color: '#f5c76a' },
    { k: 'h', text: 'Custom lessons for AI agents', at: .4, size: 66, stagger: .06 },
    { k: 'hi', text: 'searching on your behalf.', at: 1.0, size: 66, color: '#f5c76a', stagger: .06 }] });
  S.on((lt, t) => {
    look(cam, [kf(lt, [[0, -.3], [8.6, .3, ease.inOutSine]]), .1, kf(lt, [[0, 5.6], [8.6, 5.1]])], [0, -.2, 0]); drift(cam, lt, .5, 67);
    [web, c1, c2].forEach((o, i) => { const t0 = .4 + i * .75; rise(o, lt, t0, 1.1, [0, -.8, -.4]); setOpacity(o, fadeIn(lt, t0)); });
    labels.forEach((l, i) => l.material.uniforms.uOpacity.value = fadeIn(lt, .9 + i * .75) * .85);
    th.material.uniforms.uHead.value = prog(lt, .6, 3.2, ease.inOutCubic);
    c1.material.uniforms.uGlow.value = hits(t, [126.52, 128.52, 130.52], 4) * .05; c2.material.uniforms.uGlow.value = hits(t, [127.02, 129.02, 131.02], 4) * .05;
    sheen(S.scene, lt, .28);
  });
  return S;
}

// ---------------------------------------------------------------- SEO hub + breakdown into the drop
export function seoHub(E) {
  const S = new Shot(E, { fov: 30, sky: { a: '#0b5a4a', b: '#0a3a3a', c: '#1a7a6a', base: '#000403', seed: 91.9, density: .9 }, bloom: { strength: .7, radius: .7, threshold: .92 }, grade: { vig: .5 }, focus: 5.2, focusRange: 5 });
  const cam = S.camera;
  const hub = new THREE.Group(); hub.position.set(1.5, 0, 0); S.add(hub);
  const ring = glow({ size: 1.3, color: '#5fe6c4', falloff: 30, ring: 1.3, ringR: .82, ringW: .02, intensity: 1, core: .35 }); hub.add(ring);
  const ringGlow = glow({ size: 1.8, color: '#2fbf9a', falloff: 4, intensity: .25 }); hub.add(ringGlow);
  const hubL1 = label(S, E, 'YOUR BRAND', { size: 22, tracking: 7, scale: .9, color: 'rgba(170,255,225,.85)' }); hub.attach(hubL1); hubL1.position.set(0, .14, .01);
  const hubL2 = label(S, E, 'yoursite.com', { size: 64, font: "'Instrument Serif'", weight: 400, tracking: 0, scale: 1.0, color: '#e9fff7', pad: 10 }); hub.attach(hubL2); hubL2.position.set(0, -.06, .01);
  const domains = ['suedeai.ai', 'agents.suedeai.ai', 'ip.suedeai.ai', 'sing.suedeai.ai', 'social.suedeai.ai', 'strumly.suedeai.ai', 'fretpulse.suedeai.ai', 'storybeamkids.com', 'guitarhub.org', 'map.suedeai.ai',
    'skills.suedeai.ai', 'muse.suedeai.ai', 'johnnysuede.com', 'jasoncolapietro.com', 'seo.suedeai.ai', 'distro.suedeai.ai', 'dna.suedeai.ai', 'podcast.suedeai.ai', 'promo.suedeai.ai', 'cosmos.suedeai.ai'];
  const R = rng(17);
  const chips = domains.map((d, i) => {
    const a = i / domains.length * Math.PI * 2 + .15, r = 1.62 + (i % 2) * .5, z = (R() - .5) * .8;
    const l = label(S, E, d, { size: 28, tracking: 1, scale: 1.05, color: '#dffff4', bg: 'rgba(10,40,34,.88)', border: 'rgba(110,240,200,.4)', dot: '#5fe6c4', padY: 8, pad: 22 });
    hub.attach(l); l.position.set(Math.cos(a) * r * 1.2, Math.sin(a) * r * .74, z); l.userData.base = l.position.clone(); l.userData.t0 = .9 + i * .125; l.userData.billboard = true;
    const th = M.makeThread([l.position.toArray(), l.position.clone().multiplyScalar(.5).add(new THREE.Vector3(0, 0, .15)).toArray(), [0, 0, 0]], { segments: 50, width: .008, colorA: '#5fe6c4', colorB: '#e9fff7', intensity: 1.1, pulseN: 1, pulseSpeed: .9, minPx: 1.6 });
    th.userData.ownTime = true; hub.add(th); l.userData.th = th; return l;
  });
  const dustP = dustField(S, { colors: ['#ffffff', '#bfffee'], intensity: .45 }, 113);
  const flare = S.add(glow({ sx: 7, sy: .06, color: '#c9fff0', falloff: 2, intensity: 0 })); flare.position.set(1.5, 0, .2);
  const core = S.add(glow({ size: .8, color: '#e9fff7', falloff: 5, intensity: 0 })); core.position.set(1.5, 0, .1);
  title(S, { at: .4, eyebrow: 'Suede AI SEO · seo.suedeai.ai', color: '#6fe3c4', lines: ['Every surface is a link', 'your brand inherits,'], hi: 'placed where you choose.', size: 76, y: 500, out: 10.7,
    extra: [{ k: 'raw', html: '<div style="font:400 38px Instrument Serif;color:#e6fff6;margin-top:30px">That’s why the agency is <i style="color:#6fe3c4">cohort-only.</i></div>', at: 5.6 }] });
  S.on((lt, t) => {
    const implode = prog(lt, 11.0, 12.6, ease.inExpo);        // 143.0 → 144.6
    const riser = prog(lt, 11.6, 12.95, ease.inCubic);
    const push = prog(lt, 11.2, 13.0, ease.inExpo);
    look(cam, [kf(lt, [[0, -.6], [11, .5, ease.inOutSine]]) + push * .9, kf(lt, [[0, .35], [11, -.15, ease.inOutSine]]), kf(lt, [[0, 6.0], [11, 4.75, ease.inOutSine]]) - push * 3.4], [lerp(.7, 1.5, push), 0, 0]);
    drift(cam, lt, .5 * (1 - push), 71);
    hub.rotation.set(Math.sin(lt * .2) * .12, Math.sin(lt * .15) * .25, 0);
    chips.forEach((l, i) => {
      const p = prog(lt, l.userData.t0, l.userData.t0 + .9, ease.outExpo), b = l.userData.base;
      const k = (1 - implode) * (.6 + .4 * p);
      l.position.set(b.x * k, b.y * k, b.z * k);
      l.material.uniforms.uOpacity.value = fadeIn(lt, l.userData.t0, .4) * (1 - implode);
      const u = l.userData.th.material.uniforms; u.uHead.value = prog(lt, l.userData.t0 + .2, l.userData.t0 + .9, ease.inOutCubic); u.uTime.value = t * 1 + i * .37; u.uOpacity.value = 1 - implode;
      l.userData.th.scale.setScalar(Math.max(.001, k / (.6 + .4 * p) || 1));
    });
    ring.material.uniforms.uI.value = .9 + beatPulse(t, 4) * .4 * (1 - implode) + riser * 2;
    ring.scale.setScalar(1.3 * (1 - implode * .5));
    [hubL1, hubL2].forEach(l => l.material.uniforms.uOpacity.value = fadeIn(lt, .6) * (1 - implode));
    core.material.uniforms.uI.value = riser * 2.2; core.scale.setScalar(.6 + riser * 1.2);
    flare.material.uniforms.uI.value = riser * 2.5; flare.scale.x = 2 + riser * 10;
    S.grade.expo = 1 - implode * .3 + riser * .4;
  });
  return S;
}
