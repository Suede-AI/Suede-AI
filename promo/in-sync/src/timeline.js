// Master timeline, locked to the soundtrack (120 BPM, drops at 6.0 / 54.0 / 145.0).
import * as A1 from './act1.js';
import * as A2 from './act2.js';
import * as A3 from './act3.js';
import * as A4 from './act4.js';

export const SHOTS = [
  // [builder, start, end]
  [A1.genesis, 0, 6.7],
  [A1.surfaces, 5.95, 14.6],
  [A2.agentStudio, 13.9, 22.6],
  [A2.storybeam, 22.0, 30.6],
  [A2.guitarhub, 30.0, 36.6],
  [A2.fretpulse, 36.0, 42.6],
  [A2.sing, 42.0, 48.7],
  [A2.constellation, 48.0, 54.25],
  [A3.ipRegistry, 53.95, 62.6],
  [A3.wordmark, 62.0, 64.6],
  [A3.frontDoors, 64.0, 74.6],
  [A3.apps, 74.0, 82.6],
  [A3.android, 82.0, 90.6],
  [A3.learn, 90.0, 98.6],
  [A3.create, 98.0, 106.6],
  [A3.cinematic, 106.0, 114.6],
  [A3.agentix, 114.0, 124.6],
  [A3.strumlyAgents, 124.0, 132.6],
  [A3.seoHub, 132.0, 145.3],
  [A4.inSync, 144.9, 157.6],
  [A4.suedeCoin, 157.0, 165.8],
  [A4.mosaic, 165.0, 183.0],
  [A4.endCard, 182.0, 188.7],
];
export const TRANSITIONS = [
  // [at, dur, type, opts]
  [5.95, .6, 'zoom', { flash: .2, amt: .35, color: '#dfe3ff' }],
  [13.9, .7, 'blurfade'],
  [22.0, .6, 'zoom', { color: '#ffd88a', amt: .35, flash: .12 }],
  [30.0, .55, 'whip', { dir: [1, 0] }],
  [36.0, .6, 'push'],
  [42.0, .7, 'iris', { color: '#ffffff', amt: .8 }],
  [48.0, .7, 'blurfade'],
  [53.95, .3, 'flash', { color: '#fff3d6', amt: .8 }],
  [62.0, .6, 'blurfade'],
  [64.0, .6, 'push'],
  [74.0, .6, 'zoom', { amt: .3, flash: .1, color: '#dfe3ff' }],
  [82.0, .55, 'whip', { dir: [1, 0] }],
  [90.0, .6, 'blurfade'],
  [98.0, .6, 'push'],
  [106.0, .65, 'iris', { color: '#7ff0e8', amt: .6 }],
  [114.0, .6, 'zoom', { amt: .3, flash: .1, color: '#d8d0ff' }],
  [124.0, .6, 'blurfade'],
  [132.0, .6, 'push'],
  [144.9, .4, 'flash', { color: '#ffffff', amt: .8 }],
  [157.0, .6, 'zoom', { color: '#ffd38a', amt: .35, flash: .15 }],
  [165.0, .8, 'blurfade'],
  [182.0, 1.0, 'blurfade'],
];

export async function buildTimeline(E, from, to) {
  for (const [build, s, e] of SHOTS) if (e > from - .01 && s < to + .01) E.add(build(E), s, e);
  for (const [at, dur, type, o] of TRANSITIONS) E.transition(at, dur, type, o || {});
}
