// ACT II — The surfaces (14–54s): Agent Studio, Storybeam, GuitarHub, FretPulse, Suede Sing, Suede Map.
import * as THREE from 'three';
import { Shot, browser, phone, card, glow, drift, look, M } from './engine.js';
import { textBlock } from './text.js';
import { title, dustField, label, setOpacity, rise, sheen, curve } from './kit.js';
import { kf, prog, env, ease, clamp, lerp, rng, hits, beatPulse, noise1, sstep } from './util.js';

const icon = (n, s = 46) => `<img src="assets/cards/icon-${n}.png" style="width:${s}px;height:${s}px;border-radius:${s * .23}px;vertical-align:middle">`;

// ---------------------------------------------------------------- Agent Studio
export function agentStudio(E) {
  const S = new Shot(E, { fov: 30, sky: { a: '#3b2fa8', b: '#5a2a9c', c: '#1d2f7a', base: '#03030d', seed: 12.4, density: .9 }, bloom: { strength: .55, radius: .55, threshold: .96 }, focus: 5, focusRange: 4, grade: { vig: .45 } });
  const cam = S.camera;
  const graph = new THREE.Group(); S.add(graph);
  const nodes = {
    input: [-.1, 0, .35], llm1: [.68, .5, .1], llm2: [.68, -.5, .1], branch: [1.42, 0, -.1], output: [2.12, 0, -.35],
  };
  const order = ['input', 'llm1', 'llm2', 'branch', 'output'];
  const nm = {};
  order.forEach((k, i) => { const c = card(E, E.card('node-' + k), { w: .64, bright: 1, rimAmt: 0 }); c.position.set(...nodes[k]); graph.add(c); nm[k] = c; c.userData.t0 = .55 + i * .5; });
  const edges = [['input', 'llm1'], ['input', 'llm2'], ['llm1', 'branch'], ['llm2', 'branch'], ['branch', 'output']].map(([a, b], i) => {
    const A = nodes[a], B = nodes[b], ax = A[0] + .31, bx = B[0] - .31, mx = (ax + bx) / 2;
    const th = M.makeThread([[ax, A[1], A[2]], [mx, A[1] * .8 + B[1] * .2, (A[2] + B[2]) / 2], [mx + .02, A[1] * .2 + B[1] * .8, (A[2] + B[2]) / 2], [bx, B[1], B[2]]], { segments: 120, width: .012, colorA: '#9d8bff', colorB: '#6fd3ff', intensity: 1.4, pulseN: 1, pulseSpeed: 1, minPx: 2 });
    th.userData.ownTime = true; th.userData.t0 = 1.0 + i * .45; graph.add(th); return th;
  });
  graph.position.set(.62, 0, 0); graph.rotation.y = -.24;
  const web = browser(E, 'agents_desk_tall', { w: 2.1, url: 'agents.suedeai.ai', bright: .8, rimAmt: .25 }); web.position.set(1.5, .15, -.9); web.rotation.y = -.22; S.add(web);
  const ph = phone(E, 'agents_mob_tall', { h: 1.22, metal: '#9b93c9', rim: '#cfc6ff' }); ph.position.set(2.55, -.32, .25); ph.rotation.y = -.35; S.add(ph);
  const back = S.add(glow({ size: 5, color: '#5b45ff', falloff: 3, intensity: .18 })); back.position.set(1.6, 0, -2.5);
  const dustP = dustField(S, { colors: ['#ffffff', '#b9adff'], intensity: .45 }, 21);
  title(S, { at: .45, eyebrow: 'Suede AI · Agent Studio', color: '#b8a8ff', lines: ['The workforce that', 'works while'], hi: 'you sleep.', size: 92,
    body: 'Wire specialized agents on a canvas.<br>Launch every flow as a pay-per-call endpoint.', pill: 'agents.suedeai.ai', out: 8.0 });
  S.on((lt, t) => {
    const z = kf(lt, [[0, 5.6], [8.7, 4.7, ease.inOutSine]]);
    look(cam, [.55 + Math.sin(lt * .2) * .12, .05, z], [.62, 0, 0]); drift(cam, lt, .5, 7);
    const ph2 = prog(lt, 4.4, 5.6, ease.inOutCubic);
    order.forEach(k => { const c = nm[k]; const p = rise(c, lt, c.userData.t0, .9, [0, -.12, -.3]);
      c.material.uniforms.uOpacity.value = ease.outCubic(clamp((lt - c.userData.t0) / .5)) * (1 - ph2 * .85);
      c.material.uniforms.uGlow.value = hits(t, [16.52, 17.52, 18.52], 4) * .06; });
    edges.forEach((th, i) => { const u = th.material.uniforms; u.uHead.value = prog(lt, th.userData.t0, th.userData.t0 + .6, ease.inOutCubic); u.uTime.value = (t - .02) * 1 + i * .13; u.uPulse.value = sstep(2.4, 2.8, lt); u.uOpacity.value = 1 - ph2 * .8; });
    graph.position.set(.62 - ph2 * .45, ph2 * .1, -ph2 * 1.4);
    S.focus = lerp(5.1, 5.8, ph2);
    const pw = prog(lt, 4.6, 6.0, ease.outExpo);
    web.position.set(1.5, .15 - (1 - pw) * .6, -.9 + (1 - pw) * -.6); web.material.uniforms.uOpacity.value = ease.outCubic(clamp((lt - 4.6) / .6));
    web.material.uniforms.uScroll.value = kf(lt, [[6.0, 0], [8.6, .08, ease.inOutSine]]);
    const pp = prog(lt, 5.1, 6.3, ease.outExpo);
    ph.position.set(2.42, -.32 - (1 - pp) * .8, .25); setOpacity(ph, ease.outCubic(clamp((lt - 5.1) / .5)));
    ph.userData.mat.uniforms.uScroll.value = kf(lt, [[6, 0], [8.6, .18]]); ph.rotation.y = -.35 + Math.sin(lt * .4) * .04;
    sheen(web, lt, .25); sheen(ph, lt, .3, 1.5);
  });
  return S;
}

// ---------------------------------------------------------------- Storybeam
export function storybeam(E) {
  const S = new Shot(E, { fov: 30, bloom: { strength: .55, radius: .7, threshold: .96 }, grade: { gain: [1.05, 1, .92], vig: .5, sat: 1.06 }, focus: 5, focusRange: 5 });
  const cam = S.camera;
  const art = card(E, E.img('storybeam_art.png'), { w: 8.6, alpha: false, bright: .95, sheenAmt: 0 }); art.position.set(0, .05, -3.2); S.add(art);
  const flies = M.makeParticles(900, { box: [9, 5, 6], center: [0, -.2, -1], sizeMax: 2.6, sizePow: 3, colors: ['#ffd27a', '#fff1c4', '#ffb347'], intensity: .9, twinkle: .9, focus: 5, focusRange: 3, bokeh: 1.4 }, rng(31));
  S.add(flies);
  const beam = S.add(M.makeThread([[-3.2, -1.25, -.6], [-1.8, -.45, -.1], [-.4, .35, .25], [1.0, .05, .2], [2.2, .55, -.1], [3.6, .95, -.7]], { colorA: '#ffcf7a', colorB: '#9fe7ff', width: .05, intensity: 1.5, pulseN: 3, pulseSpeed: .3 }));
  const web = browser(E, 'storybeam_desk_tall', { w: 2.2, url: 'storybeamkids.com', dark: false, bright: .8, rimAmt: .25 }); web.position.set(-.55, -.22, .15); web.rotation.y = .12; S.add(web);
  const ph = phone(E, 'storybeam_mob_tall', { h: 1.28, metal: '#b9a37a', rim: '#ffe6b0' }); ph.position.set(1.42, -.3, .6); ph.rotation.y = -.25; S.add(ph);
  const warm = S.add(glow({ size: 4, color: '#ffb84a', falloff: 3, intensity: 0 })); warm.position.set(0, -.3, -1);
  title(S, { x: 1770, y: 830, align: 'right', at: .5, eyebrow: 'Storybeam · Hosted by mom & daughter', color: '#ffd88a', lines: ['Big adventures'], hi: 'for little listeners.', size: 96, out: 3.55 });
  title(S, { x: 960, y: 118, w: 1500, align: 'center', anchor: 'top', at: 4.25, lines: [], hi: [], extra: [
    { k: 'h', text: 'Read-aloud stories,', at: 4.35, size: 74, style: { display: 'inline-block' } },
    { k: 'hi', text: 'every night.', at: 4.7, size: 74, color: '#ffd88a', style: { display: 'inline-block', marginLeft: '18px' } },
    { k: 'pill', text: 'storybeamkids.com', at: 5.3, color: '#ffd88a', style: { display: 'table', margin: '20px auto 0' } }] });
  S.on((lt, t) => {
    const ph2 = prog(lt, 3.6, 5.0, ease.inOutCubic);
    look(cam, [kf(lt, [[0, -.25], [8.6, .25, ease.inOutSine]]), .02, kf(lt, [[0, 5.2], [3.8, 4.6, ease.inOutSine], [8.6, 4.4]])], [0, 0, 0]); drift(cam, lt, .6, 9);
    art.material.uniforms.uBlur.value = ph2 * .55; art.material.uniforms.uBright.value = lerp(.95, .4, ph2);
    art.position.z = -3.2 - ph2 * .8;
    const bu = beam.material.uniforms; bu.uHead.value = prog(lt, .2, 2.6, ease.inOutCubic); bu.uOpacity.value = 1 - ph2 * .5;
    const pw = prog(lt, 4.0, 5.3, ease.outExpo);
    web.position.y = -.22 - (1 - pw) * .7; web.material.uniforms.uOpacity.value = ease.outCubic(clamp((lt - 4.0) / .5));
    web.material.uniforms.uScroll.value = kf(lt, [[5.2, 0], [8.6, .22]]);
    const pp = prog(lt, 4.45, 5.7, ease.outExpo);
    ph.position.y = -.3 - (1 - pp) * .9; setOpacity(ph, ease.outCubic(clamp((lt - 4.45) / .5)));
    ph.userData.mat.uniforms.uScroll.value = kf(lt, [[5.5, 0], [8.6, .15]]);
    sheen(web, lt, .25); sheen(ph, lt, .3, 1.2);
    warm.material.uniforms.uI.value = .12 + ph2 * .12;
    flies.material.uniforms.uDrift.value.set(Math.sin(lt * .3) * .2, lt * .06, 0);
  });
  return S;
}

// ---------------------------------------------------------------- GuitarHub
export function guitarhub(E) {
  const S = new Shot(E, { fov: 30, bloom: { strength: .55, radius: .7, threshold: .93 }, grade: { gain: [1.06, .98, .88], lift: [.01, .005, 0], vig: .55 }, focus: 5, focusRange: 4.5 });
  const cam = S.camera;
  const photo = card(E, E.img('guitarhub_00.webp'), { w: 8.2, alpha: false, bright: .7, sheenAmt: 0 }); photo.position.set(.6, -.3, -3.3); S.add(photo);
  const covers = [7, 12, 13, 3, 2, 14].map((n, i) => {
    const c = card(E, E.img(`guitarhub_${String(n).padStart(2, '0')}.webp`), { w: .62, alpha: false, radius: .02, bright: .95, rimAmt: .25, rim: '#ffd29a', sheenAmt: .14 });
    const a = (i - 2.5) * .21; c.position.set(1.45 + Math.sin(a) * 2.2, (i % 2 ? -.06 : .06), -.4 + (1 - Math.cos(a)) * -2.2 + 2.2 * 0); c.rotation.y = -a * .9;
    c.userData.base = c.position.clone(); c.userData.t0 = 3.0 + i * .125; S.add(c); return c;
  });
  const smoke = M.makeParticles(1300, { box: [10, 6, 8], center: [0, 0, -1.5], sizeMax: 3, sizePow: 3, colors: ['#ffcf8f', '#ffe8c9', '#ff9d4a'], intensity: .5, twinkle: .5, focus: 5, focusRange: 3, bokeh: 1.4 }, rng(41));
  S.add(smoke);
  const amber = S.add(glow({ size: 3.5, color: '#ff9a3c', falloff: 3, intensity: .14 })); amber.position.set(2.0, .6, -2.5);
  const string = S.add(M.makeThread([[-4, -.95, -.2], [0, -.9, 0], [4.5, -.85, -.2]], { colorA: '#ffb45c', colorB: '#ffe2a8', width: .02, intensity: 1.2, pulseN: 2, pulseSpeed: .5 }));
  title(S, { at: .45, eyebrow: 'GuitarHub · guitarhub.org', color: '#f4b860', lines: ['Practice with', 'a method.'], hi: 'Hear the progress.', size: 98, pill: 'Free field guides · Real routines', pillAt: 3.3, out: 6.0 });
  S.on((lt, t) => {
    const ph2 = prog(lt, 2.7, 3.8, ease.inOutCubic);
    look(cam, [kf(lt, [[0, -.2], [6.6, .45, ease.inOutSine]]), .0, kf(lt, [[0, 5.3], [6.6, 4.7]])], [.35, 0, 0]); drift(cam, lt, .7, 13);
    photo.material.uniforms.uBlur.value = .1 + ph2 * .45; photo.material.uniforms.uBright.value = lerp(.72, .38, ph2);
    covers.forEach((c, i) => { const p = rise(c, lt, c.userData.t0, 1.1, [.6, -.25, 1.4]); c.material.uniforms.uOpacity.value = ease.outCubic(clamp((lt - c.userData.t0) / .45));
      c.position.y += Math.sin(lt * .8 + i) * .02; c.material.uniforms.uSheen.value = ((lt * .4 + i * .3) % 3) - 1; c.material.uniforms.uGlow.value = hits(t, [34.02, 35.02], 5) * .05; });
    const su = string.material.uniforms; su.uHead.value = prog(lt, .3, 2.2, ease.inOutCubic); su.uWobble.value = .02 * beatPulse(t, 5); su.uWobbleT.value = t * 40;
    smoke.material.uniforms.uDrift.value.set(lt * .05, lt * .04, 0);
  });
  return S;
}

// ---------------------------------------------------------------- FretPulse
export function fretpulse(E) {
  const S = new Shot(E, { fov: 30, sky: { a: '#1747c9', b: '#0a2a7a', c: '#3b7bff', base: '#01030c', seed: 3.3, density: .8 }, bloom: { strength: .6, radius: .6, threshold: .95 }, grade: { vig: .45 }, focus: 4.8, focusRange: 4 });
  const cam = S.camera;
  const mk = (sh, scroll, x, y, z, ry, h) => { const p = phone(E, sh, { h, metal: '#8fa6d6', rim: '#cfe0ff' }); p.position.set(x, y, z); p.rotation.y = ry; p.userData.scroll = scroll; p.userData.base = p.position.clone(); S.add(p); return p; };
  const phones = [mk('fretpulse_mob_tall', .33, .55, -.08, -.35, .42, 1.3), mk('fretpulse_mob', 0, 1.45, .0, .25, 0, 1.55), mk('fretpulse_mob_tall', .62, 2.35, -.08, -.35, -.42, 1.3)];
  const pedal = card(E, E.img('social_01.webp'), { w: .55, alpha: false, radius: .03, rimAmt: .3 }); pedal.position.set(2.7, .78, -.9); pedal.rotation.set(.1, -.4, .12); S.add(pedal);
  const board = card(E, E.img('social_00.webp'), { w: .9, alpha: false, radius: .03, rimAmt: .3 }); board.position.set(.15, -.98, -.2); board.rotation.set(-.15, .35, -.08); S.add(board);
  const string = S.add(M.makeThread([[-4, -1.12, .3], [0, -1.1, .4], [5, -1.05, .2]], { colorA: '#8ec2ff', colorB: '#e3f0ff', width: .018, intensity: 1.4, pulseN: 2, pulseSpeed: .5 }));
  const g1 = S.add(glow({ size: 4, color: '#2f6bff', falloff: 3, intensity: .2 })); g1.position.set(1.45, 0, -1.5);
  const dustP = dustField(S, { colors: ['#ffffff', '#9fc0ff'], intensity: .45 }, 51);
  title(S, { at: .45, eyebrow: '', lines: ['Tune. Chord.'], hi: 'Pulse. Play.', color: '#86b8ff', size: 110, pill: 'fretpulse.suedeai.ai', out: 6.0,
    extra: [] });
  textBlock(S, { x: 150, y: 262, w: 800, out: 6.0, items: [{ k: 'raw', html: `${icon('fretpulse', 48)}<span style="font:500 21px Inter;margin-left:16px;vertical-align:middle;color:#eef2ff">Suede Guitar Tuner &amp; Studio</span><div style="font:500 12px 'JetBrains Mono';letter-spacing:.3em;color:#86b8ff;margin:10px 0 0 64px">FRETPULSE</div>`, at: .35 }] });
  S.on((lt, t) => {
    look(cam, [kf(lt, [[0, .9], [6.6, .55, ease.inOutSine]]), .05, kf(lt, [[0, 5.5], [6.6, 4.8]])], [.75, 0, 0]); drift(cam, lt, .6, 17);
    phones.forEach((p, i) => { const tt = .2 + i * .25; const pr = rise(p, lt, tt, 1.2, [0, -1.2, 0]); setOpacity(p, ease.outCubic(clamp((lt - tt) / .5)));
      p.position.y += Math.sin(lt * .7 + i * 1.3) * .02; p.userData.mat.uniforms.uScroll.value = p.userData.scroll + Math.sin(lt * .25 + i) * .02;
      p.userData.mat.uniforms.uScreenGlow.value = hits(t, [36.52 + i * .25, 38.02 + i * .25, 40.02 + i * .25], 6) * .05; });
    sheen(S.scene, lt, .3);
    [pedal, board].forEach((c, i) => { rise(c, lt, .9 + i * .3, 1.2, [0, i ? -.5 : .5, -.5]); c.material.uniforms.uOpacity.value = ease.outCubic(clamp((lt - .9 - i * .3) / .6)); c.rotation.z = (i ? -.08 : .12) + Math.sin(lt * .5 + i) * .03; });
    const su = string.material.uniforms; su.uHead.value = prog(lt, .1, 1.6, ease.inOutCubic); su.uWobble.value = .045 * beatPulse(t, 4.5); su.uWobbleT.value = t * 55;
  });
  return S;
}

// ---------------------------------------------------------------- Suede Sing (daylight)
export function sing(E) {
  const S = new Shot(E, { fov: 30, sky: { a: '#f2e3c4', b: '#d9ead8', c: '#ffffff', base: '#e9e2d2', seed: 8.8, density: .6, stars: 0 }, bloom: { strength: .25, radius: .6, threshold: .985 }, grade: { vig: .25, sat: 1.02 }, focus: 4.8, focusRange: 4.5 });
  const cam = S.camera;
  const web = browser(E, 'sing_desk', { w: 2.35, url: 'sing.suedeai.ai', dark: false, rim: '#2f7d55', rimAmt: .25, bright: 1 }); web.position.set(1.25, .12, -.4); web.rotation.y = -.2; S.add(web);
  const ph = phone(E, 'sing_mob_tall', { h: 1.3, metal: '#7f8a80', rim: '#ffffff', bright: 1 }); ph.position.set(2.42, -.3, .45); ph.rotation.y = -.32; S.add(ph);
  const shadow = S.add(glow({ size: 3.4, color: '#000000', intensity: 0 }));
  const notes = []; for (let i = 0; i <= 28; i++) { const x = -3.4 + i * .27, y = -1.0 + .18 * Math.sin(i * .9) + .1 * Math.sin(i * 2.3) + (i % 5 === 0 ? .08 : 0); notes.push([x, y, .2 + Math.sin(i * .5) * .1]); }
  const pitch = S.add(M.makeThread(notes, { colorA: '#2f7d55', colorB: '#b98a2a', width: .06, normal: true, pulseN: 2, pulseSpeed: .4, minPx: 4 }));
  title(S, { at: .45, eyebrow: 'Suede Sing · Free · In the browser', color: '#2f7d55', lines: ['The vocal studio,'], hi: 'in your browser.', size: 100,
    body: 'Range test, warmups, ear training and the Voice Atlas.<br>Nothing to install.', pill: 'sing.suedeai.ai', out: 6.0 });
  S.dom.classList.add('light');
  S.on((lt, t) => {
    look(cam, [kf(lt, [[0, .3], [6.6, .7, ease.inOutSine]]), .05, kf(lt, [[0, 5.4], [6.6, 4.75]])], [.7, 0, 0]); drift(cam, lt, .5, 19);
    const pw = prog(lt, .25, 1.6, ease.outExpo); web.position.x = 1.25 + (1 - pw) * 1.2; web.material.uniforms.uOpacity.value = ease.outCubic(clamp((lt - .25) / .5));
    
    const pp = prog(lt, .7, 2.0, ease.outExpo); ph.position.y = -.3 - (1 - pp) * .9; setOpacity(ph, ease.outCubic(clamp((lt - .7) / .5)));
    ph.userData.mat.uniforms.uScroll.value = kf(lt, [[2, 0], [6.6, .2]]);
    const pu = pitch.material.uniforms; pu.uHead.value = prog(lt, .2, 4.5, ease.inOutSine);
    sheen(S.scene, lt, .25);
  });
  return S;
}

// ---------------------------------------------------------------- Suede Map constellation + breakdown
export function constellation(E) {
  const S = new Shot(E, { fov: 32, sky: { a: '#3a3410', b: '#2a2006', c: '#59501c', base: '#030301', seed: 4.4, density: .7 }, bloom: { strength: .8, radius: .7, threshold: .9 }, grade: { vig: .55, gain: [1.04, 1.0, .9] }, focus: 6, focusRange: 5 });
  const cam = S.camera, R = rng(77);
  const N = 44, P = [];
  for (let i = 0; i < N; i++) { const th = R() * 6.283, u = R() * 2 - 1, r = 1.2 + R() * 1.6; P.push(new THREE.Vector3(Math.sqrt(1 - u * u) * Math.cos(th) * r * 1.5, u * r * .75, Math.sqrt(1 - u * u) * Math.sin(th) * r)); }
  P[0].set(0, 0, 0);
  const group = new THREE.Group(); S.add(group);
  const stars = P.map((p, i) => { const g = glow({ size: i === 0 ? .55 : .14 + R() * .16, color: i === 0 ? '#fff4c8' : '#ffe9a8', falloff: 5, intensity: 1.2 }); g.position.copy(p); group.add(g); return g; });
  // edges: connect each node to its 2 nearest; order reveal by BFS distance from node 0
  const dist0 = P.map(p => p.length());
  const E2 = []; const seen = new Set();
  P.forEach((p, i) => { const nn = P.map((q, j) => [q.distanceTo(p), j]).filter(([, j]) => j !== i).sort((a, b) => a[0] - b[0]).slice(0, 2);
    for (const [, j] of nn) { const k = i < j ? `${i}-${j}` : `${j}-${i}`; if (!seen.has(k)) { seen.add(k); E2.push([i, j]); } } });
  const lines = E2.map(([i, j]) => { const a = dist0[i] < dist0[j] ? P[i] : P[j], b = dist0[i] < dist0[j] ? P[j] : P[i];
    const th = M.makeThread([a.toArray(), a.clone().lerp(b, .5).toArray(), b.toArray()], { segments: 30, width: .008, colorA: '#ffe7a3', colorB: '#d9b45a', intensity: .9, pulse: 0, headGlow: .6, minPx: 1.6 });
    th.userData.t0 = .2 + Math.min(dist0[i], dist0[j]) * .85; group.add(th); return th; });
  const names = ['Agent Studio', 'Storybeam', 'GuitarHub', 'FretPulse', 'Suede Sing', 'IP Registry', 'Suede Social', 'Strumly', 'Suede Muse', 'Suede DNA', 'Suede Skills', 'Suede Distro'];
  const labels = names.map((n, i) => { const l = label(S, E, n.toUpperCase(), { size: 26, color: 'rgba(255,236,190,.85)', tracking: 5, scale: .55, pad: 6 }); const p = P[1 + i * 3]; l.position.copy(p).add(new THREE.Vector3(0, -.13, 0)); group.attach(l); l.userData.billboard = true; l.userData.t0 = .6 + dist0[1 + i * 3] * .85; return l; });
  const dustP = dustField(S, { colors: ['#fff2c8', '#ffd98a'], intensity: .35, box: [12, 8, 14], center: [0, 0, 0] }, 61);
  const core = S.add(glow({ size: .9, color: '#fff2c8', falloff: 5, intensity: 0 }));
  const streak = S.add(glow({ sx: 6, sy: .05, color: '#ffe3a0', falloff: 2, intensity: 0 }));
  textBlock(S, { x: 960, y: 900, w: 1400, align: 'center', anchor: 'middle', out: 3.85, outDur: .5, items: [
    { k: 'eyebrow', text: 'Suede Map · map.suedeai.ai', at: .9, color: '#f0d58a' },
    { k: 'h', text: 'Every surface,', at: 1.0, size: 96, style: { display: 'inline-block' } }, { k: 'hi', text: 'connected.', at: 1.45, size: 96, color: '#f0d58a', style: { display: 'inline-block', marginLeft: '22px' } }] });
  S.on((lt, t) => {
    const brk = prog(lt, 3.9, 4.6, ease.inOutCubic);          // music drops out at 52.0
    const push = prog(lt, 4.2, 6.0, ease.inExpo);
    const a = lt * .12 + .3;
    const r = kf(lt, [[0, 7.2], [4, 6.2, ease.inOutSine]]) * (1 - push * .86);
    look(cam, [Math.sin(a) * r, .6 * (1 - push) + .1, Math.cos(a) * r], [0, 0, 0]); drift(cam, lt, .5 * (1 - push), 23);
    lines.forEach(th => { const u = th.material.uniforms; u.uHead.value = prog(lt, th.userData.t0, th.userData.t0 + .7, ease.inOutCubic); u.uOpacity.value = 1 - brk * .9; });
    stars.forEach((g, i) => { if (i) g.material.uniforms.uI.value = (1.1 + .5 * Math.sin(lt * 2 + i)) * sstep(.1, .5, lt - dist0[i] * .85) * (1 - brk * .85) * (1 + beatPulse(t, 6) * .4 * (1 - brk)); });
    labels.forEach(l => l.material.uniforms.uOpacity.value = ease.outCubic(clamp((lt - l.userData.t0) / .6)) * (1 - brk));
    const rise_ = prog(lt, 5.0, 6.0, ease.inCubic);
    stars[0].material.uniforms.uI.value = 1.6 + rise_ * 3; stars[0].scale.setScalar(.55 + rise_ * .5);
    core.material.uniforms.uI.value = rise_ * 1.2; streak.material.uniforms.uI.value = rise_ * 1.6; streak.scale.x = 2 + rise_ * 8;
    S.grade.expo = 1 - brk * .25 + rise_ * .3;
  });
  return S;
}
