// DOM typography with per-word cinematic reveals, all driven by scene-local time.
import { clamp, ease } from './util.js';

const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

// spec: { x, y, w, align:'left'|'center'|'right', anchor:'top'|'middle'|'bottom', out, outDur,
//   items: [ {k:'eyebrow'|'h'|'hi'|'body'|'pill'|'chips'|'raw', text, at, size, color, stagger, html} ] }
export function textBlock(shot, spec) {
  const el = document.createElement('div');
  el.className = 'tb';
  const al = spec.align || 'left';
  Object.assign(el.style, { position: 'absolute', width: (spec.w || 900) + 'px', textAlign: al });
  const ax = al === 'center' ? -50 : al === 'right' ? -100 : 0, ay = spec.anchor === 'middle' ? -50 : spec.anchor === 'bottom' ? -100 : 0;
  el.style.left = spec.x + 'px'; el.style.top = spec.y + 'px'; el.style.transform = `translate(${ax}%, ${ay}%)`;
  shot.dom.appendChild(el);
  const units = [];
  for (const it of spec.items) {
    const line = document.createElement('div');
    line.className = 'tl ' + it.k;
    if (it.color) line.style.setProperty('--c', it.color);
    if (it.size) line.style.fontSize = it.size + 'px';
    if (it.style) Object.assign(line.style, it.style);
    el.appendChild(line);
    if (it.k === 'h' || it.k === 'hi') {
      const words = it.text.split(' ');
      words.forEach((w, i) => {
        const s = document.createElement('span'); s.className = 'w'; s.innerHTML = esc(w) + (i < words.length - 1 ? '&nbsp;' : '');
        line.appendChild(s);
        units.push({ el: s, t0: it.at + i * (it.stagger ?? .085), dur: it.dur ?? 1.1, kind: 'word' });
      });
    } else if (it.k === 'eyebrow') {
      line.textContent = it.text; units.push({ el: line, t0: it.at, dur: it.dur ?? 1.2, kind: 'track' });
    } else if (it.k === 'chips' || it.k === 'icons') {
      it.text.forEach((c, i) => {
        const s = document.createElement('span'); s.className = it.k === 'icons' ? 'ico' : 'chip'; s.innerHTML = c;
        line.appendChild(s); units.push({ el: s, t0: it.at + i * (it.stagger ?? .06), dur: .7, kind: 'pop' });
      });
    } else {
      line.innerHTML = it.html || esc(it.text); units.push({ el: line, t0: it.at, dur: it.dur ?? 1, kind: it.k === 'pill' ? 'pop' : 'fade' });
    }
  }
  const out = spec.out ?? 1e9, outDur = spec.outDur ?? .6;
  const tb = {
    el,
    update(lt) {
      const o = clamp((lt - out) / outDur), oe = ease.inCubic(o);
      for (const u of units) {
        const p = clamp((lt - u.t0) / u.dur);
        if (u.kind === 'word') {
          const e = ease.outExpo(p), f = ease.outCubic(p);
          u.el.style.opacity = (f * (1 - oe)).toFixed(3);
          u.el.style.transform = `translateY(${((1 - e) * 0.42 - oe * .18).toFixed(4)}em)`;
          const b = (1 - e) * 14 + oe * 10; u.el.style.filter = b > .05 ? `blur(${b.toFixed(2)}px)` : 'none';
        } else if (u.kind === 'track') {
          const e = ease.outExpo(p);
          u.el.style.opacity = (ease.outCubic(p) * (1 - oe)).toFixed(3);
          u.el.style.letterSpacing = (0.32 + (1 - e) * .5) + 'em';
          const b = (1 - e) * 6 + oe * 6; u.el.style.filter = b > .05 ? `blur(${b.toFixed(2)}px)` : 'none';
        } else if (u.kind === 'pop') {
          const e = ease.outExpo(p);
          u.el.style.opacity = (ease.outCubic(p) * (1 - oe)).toFixed(3);
          u.el.style.transform = `translateY(${((1 - e) * 14).toFixed(2)}px) scale(${(0.94 + .06 * e).toFixed(4)})`;
          const b = (1 - e) * 8 + oe * 8; u.el.style.filter = b > .05 ? `blur(${b.toFixed(2)}px)` : 'none';
        } else {
          const e = ease.outExpo(p);
          u.el.style.opacity = (ease.outCubic(p) * (1 - oe)).toFixed(3);
          u.el.style.transform = `translateY(${((1 - e) * 18).toFixed(2)}px)`;
          const b = (1 - e) * 10 + oe * 8; u.el.style.filter = b > .05 ? `blur(${b.toFixed(2)}px)` : 'none';
        }
      }
    },
  };
  shot.texts.push(tb);
  return tb;
}
