import { Engine } from './engine.js';
import { buildTimeline } from './timeline.js';
const E = new Engine(document.getElementById('gl'), document.getElementById('text'));
window.__E = E;
window.__init = async (from = 0, to = 1e9) => {
  await Promise.all(["400 48px 'Instrument Serif'", "italic 400 48px 'Instrument Serif'", "400 48px Inter", "600 48px Inter", "300 48px Inter", "500 48px 'JetBrains Mono'"].map(f => document.fonts.load(f)));
  await document.fonts.ready;
  await buildTimeline(E, from, to);
  await E.loaded();
  E.frame(from);
  return true;
};
window.__frame = t => { E.frame(t); return true; };
