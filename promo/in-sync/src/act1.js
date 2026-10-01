// ACT I — The signal (0–14s): logo genesis, "Many surfaces. One rhythm."
import * as THREE from 'three';
import { Shot, browser, phone, card, glow, drift, look, reflect, syncReflection, M } from './engine.js';
import { textBlock } from './text.js';
import { kf, prog, env, ease, clamp, lerp, rng, hits, beatPulse, noise1, sstep } from './util.js';

export const DESK = ['agents', 'storybeam', 'guitarhub', 'fretpulse', 'sing', 'ip', 'social', 'strumly', 'muse', 'skills', 'seo', 'distro', 'dna', 'podcast', 'promo', 'cosmos', 'agentix', 'map', 'studio', 'suedeai', 'johnny', 'app'];
export const URLS = { agents: 'agents.suedeai.ai', storybeam: 'storybeamkids.com', guitarhub: 'guitarhub.org', fretpulse: 'fretpulse.suedeai.ai', sing: 'sing.suedeai.ai', ip: 'ip.suedeai.ai', social: 'social.suedeai.ai', strumly: 'strumly.suedeai.ai', muse: 'muse.suedeai.ai', skills: 'skills.suedeai.ai', seo: 'seo.suedeai.ai', distro: 'distro.suedeai.ai', dna: 'dna.suedeai.ai', podcast: 'podcast.suedeai.ai', promo: 'promo.suedeai.ai', cosmos: 'cosmos.suedeai.ai', agentix: 'agentix.suedeai.ai', map: 'map.suedeai.ai', studio: 'studio.suedeai.ai', suedeai: 'suedeai.ai', johnny: 'johnnysuede.com', app: 'app.suedeai.ai' };

// Shared: dust field that follows a camera
export function dust(S, n = 1400, o = {}, seed = 3) {
  const p = M.makeParticles(n, { box: [16, 10, 24], center: [0, 0, 0], sizeMax: 3, sizePow: 4, focus: 4, focusRange: 3, bokeh: 1.2, intensity: o.intensity ?? .55, colors: o.colors || ['#ffffff', '#bfc9ff', '#ffe6c4'], twinkle: .6, ...o }, rng(seed));
  S.add(p); return p;
}

// ---------------------------------------------------------------- S0 Genesis
export function genesis(E) {
  const S = new Shot(E, { fov: 30, sky: { a: '#2a2f8f', b: '#5b2a8a', c: '#123a7a', base: '#010208', seed: 2.3, density: .9, stars: 1 }, bloom: { strength: .9, radius: .7, threshold: .85 }, grade: { vig: .55, ca: .0015 } });
  const cam = S.camera;
  const motes = dust(S, 1600, { intensity: .45 }, 5);
  const logo = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), M.logoMaterial({ mask: E.img('logo_mask.png'), colorA: '#e6eaf7', colorB: '#7d88b8', edge: '#b7c2ff', intensity: .85 }));
  S.add(logo);
  const core = S.add(glow({ size: .5, color: '#c9d2ff', falloff: 9 })); core.position.z = -.4;
  const halo = S.add(glow({ size: 2.6, color: '#4b4bff', falloff: 5, intensity: .2 })); halo.position.z = -.6;
  const streak = S.add(glow({ sx: 7, sy: .07, color: '#9fb0ff', falloff: 2.2, intensity: 0 }));
  const rings = [0.9, 1.25, 1.7, 2.3].map((r, i) => { const g = glow({ size: r * 2, color: '#7f88ff', falloff: 40, ring: .35, ringR: .96, ringW: .006, intensity: 0 }); g.userData.billboard = false; return S.add(g); });
  const shock = S.add(glow({ size: 1, color: '#d9deff', falloff: 60, ring: 1.4, ringR: .9, ringW: .02, intensity: 0 })); shock.userData.billboard = false;
  // thread spiralling into the core
  const pts = []; for (let i = 0; i <= 80; i++) { const a = i / 80, ang = a * Math.PI * 3.5, r = lerp(9, .62, ease.outCubic(a)); pts.push([Math.cos(ang) * r, Math.sin(ang) * r * .7, lerp(-14, 0, a)]); }
  const thread = S.add(M.makeThread(pts, { colorA: '#7b6cff', colorB: '#ffd9a0', width: .05, intensity: 1.4, pulseN: 2 }));
  textBlock(S, { x: 960, y: 760, w: 900, align: 'center', out: 5.85, outDur: .3, items: [{ k: 'eyebrow', text: 'Suede AI', at: 3.4, color: '#c2c9ff', style: { fontSize: '16px' } }] });
  S.on((lt, t) => {
    look(cam, [0, 0, kf(lt, [[0, 7.5], [6, 3.6, ease.inOutSine]])], [0, 0, 0]);
    drift(cam, lt, .6, 1);
    S.sky.material.uniforms.uI.value = kf(lt, [[0, 0], [3, .8], [6, 1]]);
    const tick = hits(t, [0.52, 1.52, 2.52, 3.52], 3.2);
    const build = prog(lt, 0, 3.6, ease.inSine);
    const fadeCore = 1 - prog(lt, 3.2, 4.8);
    core.material.uniforms.uI.value = ((.3 + build * .6) * (1 + tick * 1.2)) * (.25 + .75 * fadeCore) + hits(t, [6.0], 3) * .6;
    core.scale.setScalar(.25 + build * .25 + tick * .15);
    halo.material.uniforms.uI.value = (.05 + build * .1 + tick * .08) + hits(t, [6.0], 2) * .4;
    const L = logo.material.uniforms;
    L.uReveal.value = prog(lt, 3.0, 5.25, ease.inOutCubic);
    L.uSweep.value = kf(lt, [[5.0, -1], [5.9, 1.2]]);
    L.uEmit.value = hits(t, [6.0], 3) * .6;
    L.uOpacity.value = 1;
    logo.scale.setScalar(kf(lt, [[3, .92], [6, 1, ease.outCubic]]));
    logo.rotation.z = kf(lt, [[3, .25], [5.4, 0, ease.outCubic]]);
    rings.forEach((g, i) => { g.material.uniforms.uI.value = env(lt, 1.5 + i * .35, 7, 1.5, .3) * (.4 + tick * .4); g.rotation.z = lt * .05 * (i % 2 ? 1 : -1); g.scale.setScalar(g.userData.r0 ??= g.scale.x); });
    const tu = thread.material.uniforms; tu.uHead.value = prog(lt, 1.0, 4.4, ease.inOutSine); tu.uTail.value = Math.max(0, tu.uHead.value - .45) + prog(lt, 4.2, 5.2, ease.inSine); tu.uOpacity.value = 1;
    const sh = clamp(lt - 6.0, 0, 2);
    shock.scale.setScalar(.5 + ease.outExpo(clamp(sh / 1.2)) * 9); shock.material.uniforms.uI.value = sh > 0 ? (1 - clamp(sh / 1.0)) * 1.5 : 0;
    streak.material.uniforms.uI.value = hits(t, [6.0], 3) * 1.2 + prog(lt, 4.8, 5.9) * .3;
    streak.scale.x = 4 + hits(t, [6.0], 2) * 10;
    S.flash = hits(t, [6.0], 9) * .3;
    motes.material.uniforms.uDrift.value.set(0, lt * .03, lt * .25);
  });
  return S;
}

// ---------------------------------------------------------------- S1 Many surfaces
export function surfaces(E) {
  const S = new Shot(E, { fov: 38, sky: { a: '#2b2a9a', b: '#7a2c8f', c: '#1b4a8a', base: '#020310', seed: 7.1, density: 1.1 }, bloom: { strength: .6, radius: .6, threshold: .97 }, grade: { vig: .5 }, focus: 4, focusRange: 5 });
  const cam = S.camera, R = rng(11);
  const panels = [];
  const N = 30;
  for (let i = 0; i < N; i++) {
    const name = DESK[i % DESK.length];
    const p = browser(E, name + '_desk', { w: 1.5, url: URLS[name], rimAmt: .5, bright: .82 });
    const ang = i * 2.39996 + .4, rad = 2.05 + R() * .5, z = 2 - i * 1.75;
    p.position.set(Math.cos(ang) * rad * 1.35, Math.sin(ang) * rad * .82, z);
    p.lookAt(0, 0, z + 3.5);
    p.rotation.z += (R() - .5) * .25;
    p.userData.base = p.position.clone(); p.userData.ph = R() * 10;
    S.add(p); panels.push(p);
  }
  const spine = []; for (let i = 0; i <= 60; i++) { const z = 9 - i * 1.2; spine.push([Math.sin(i * .35) * .55, Math.cos(i * .27) * .3 - .15, z]); }
  const thread = S.add(M.makeThread(spine, { colorA: '#ffd9a0', colorB: '#8f7bff', width: .035, intensity: 1.5, pulseN: 4, pulseSpeed: .35 }));
  const motes = dust(S, 2200, { intensity: .5, box: [12, 8, 30] }, 9);
  textBlock(S, { x: 960, y: 540, w: 1400, align: 'center', anchor: 'middle', out: 7.1, outDur: .55, items: [
    { k: 'eyebrow', text: 'One studio · Every surface', at: .45, color: '#c9b9ff' },
    { k: 'h', text: 'Many surfaces.', at: .55, size: 150 },
    { k: 'hi', text: 'One rhythm.', at: 1.55, size: 150, color: '#b7a6ff' },
  ] });
  S.on((lt, t) => {
    const z = kf(lt, [[0, 9.5], [1.2, 5.5, ease.outCubic], [8.6, -16, ease.inOutSine]]);
    cam.position.set(Math.sin(lt * .3) * .25, Math.cos(lt * .23) * .12, z);
    cam.up.set(Math.sin(lt * .08) * .2, 1, 0).normalize();
    cam.lookAt(Math.sin(lt * .3 + .6) * .4, 0, z - 6);
    drift(cam, lt, .8, 4);
    S.focus = 4.2; S.focusRange = 6;
    panels.forEach((p, i) => {
      const b = p.userData.base;
      p.position.y = b.y + Math.sin(lt * .6 + p.userData.ph) * .05;
      const u = p.material.uniforms;
      u.uSheen.value = ((lt * .35 + i * .13) % 3) - 1;
      u.uScroll.value = (Math.sin(lt * .12 + i) * .5 + .5) * .25;
      const dz = b.z - cam.position.z;
      u.uOpacity.value = sstep(-15, -8, dz) * sstep(1.2, -.4, dz);
      u.uGlow.value = hits(t, [6.0, 8.0, 10.0, 12.0], 4) * .08;
    });
    const tu = thread.material.uniforms; tu.uHead.value = kf(lt, [[0, .05], [7, .95, ease.outCubic]]); tu.uTail.value = 0;
    motes.material.uniforms.uDrift.value.set(0, 0, 0);
    S.flash = hits(t, [6.0], 8) * .25;
  });
  return S;
}
