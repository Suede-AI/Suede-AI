// Shared scene helpers.
import * as THREE from 'three';
import { M, card } from './engine.js';
import { textBlock } from './text.js';
import { rng, lerp, clamp, prog, ease, kf } from './util.js';

// Standard title block: eyebrow / headline lines / italic accent / body / pill
export function title(S, o) {
  const at = o.at ?? .4, items = [];
  if (o.eyebrow) items.push({ k: 'eyebrow', text: o.eyebrow, at, color: o.ec || o.color });
  (o.lines || []).forEach((l, i) => items.push({ k: 'h', text: l, at: at + .12 + i * .28, size: o.size }));
  const n = (o.lines || []).length;
  (o.hi ? [].concat(o.hi) : []).forEach((l, i) => items.push({ k: 'hi', text: l, at: (o.hiAt ?? at + .25 + n * .28) + i * .28, size: o.size, color: o.color }));
  if (o.body) items.push({ k: 'body', html: o.body, at: o.bodyAt ?? at + 1.0 + n * .2, style: o.bodyStyle });
  if (o.pill) items.push({ k: 'pill', text: o.pill, at: o.pillAt ?? at + 1.3 + n * .2, color: o.color });
  if (o.extra) items.push(...o.extra);
  return textBlock(S, { x: o.x ?? 150, y: o.y ?? 540, w: o.w ?? 900, align: o.align, anchor: o.anchor ?? 'middle', out: o.out, outDur: o.outDur, items });
}

export function dustField(S, o = {}, seed = 3) {
  const p = M.makeParticles(o.n || 1500, { box: o.box || [14, 9, 18], center: o.center || [0, 0, -2], sizeMax: o.sizeMax ?? 3, sizePow: 4, focus: o.focus ?? 5, focusRange: o.focusRange ?? 3, bokeh: o.bokeh ?? 1.2, intensity: o.intensity ?? .5, colors: o.colors || ['#ffffff', '#c6ceff'], twinkle: .6 }, rng(seed));
  S.add(p); return p;
}

// Label plane (canvas text) in world space
export function label(S, E, text, o = {}) {
  const tex = E.textTexture(text, { size: o.size || 34, font: o.font || "'JetBrains Mono'", weight: o.weight || 500, color: o.color || 'rgba(225,230,255,.8)', tracking: o.tracking ?? 4, bg: o.bg, border: o.border, dot: o.dot, pad: o.pad, padY: o.padY, italic: o.italic });
  const m = card(E, tex, { w: o.w || (tex.userData.w / 1000) * (o.scale || 1), bright: 1, dof: o.dof ?? 1 });
  if (o.pos) m.position.set(...o.pos);
  S.add(m); return m;
}

// Fade an object (and children) via uOpacity
export function setOpacity(obj, v) {
  obj.traverse(o => { const u = o.material && o.material.uniforms; if (u && u.uOpacity) u.uOpacity.value = v; });
}

// Rise-in animation: position from offset with easing; returns progress
export function rise(obj, lt, t0, dur, from = [0, -.4, 0], base, e = ease.outExpo) {
  const p = e(clamp((lt - t0) / dur));
  const b = base || (obj.userData.base ??= obj.position.clone());
  obj.position.set(b.x + from[0] * (1 - p), b.y + from[1] * (1 - p), b.z + from[2] * (1 - p));
  return p;
}

export function sheen(obj, lt, speed = .3, off = 0) {
  obj.traverse(o => { const u = o.material && o.material.uniforms; if (u && u.uSheen) u.uSheen.value = ((lt * speed + off) % 3.2) - 1.2; });
}

// Smooth curve helper
export const curve = (pts, closed = false) => new THREE.CatmullRomCurve3(pts.map(p => new THREE.Vector3(...p)), closed, 'centripetal');
