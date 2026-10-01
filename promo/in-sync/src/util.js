// Time, easing and procedural helpers. Everything is a pure function of time so
// any frame can be rendered independently (and in parallel).
export const W = 1920, H = 1080;
export const BEAT = 0.5, B0 = 0.02; // 120 BPM grid, first downbeat offset

export const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const lerp = (a, b, t) => a + (b - a) * t;
export const mix3 = (a, b, t) => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
export const sstep = (a, b, x) => { const t = clamp((x - a) / (b - a)); return t * t * (3 - 2 * t); };

export const ease = {
  linear: t => t,
  inSine: t => 1 - Math.cos(t * Math.PI / 2),
  outSine: t => Math.sin(t * Math.PI / 2),
  inOutSine: t => -(Math.cos(Math.PI * t) - 1) / 2,
  inCubic: t => t * t * t,
  outCubic: t => 1 - Math.pow(1 - t, 3),
  inOutCubic: t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
  outQuart: t => 1 - Math.pow(1 - t, 4),
  inOutQuart: t => t < .5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2,
  outQuint: t => 1 - Math.pow(1 - t, 5),
  inOutQuint: t => t < .5 ? 16 * t ** 5 : 1 - Math.pow(-2 * t + 2, 5) / 2,
  inExpo: t => t === 0 ? 0 : Math.pow(2, 10 * t - 10),
  outExpo: t => t === 1 ? 1 : 1 - Math.pow(2, -10 * t),
  inOutExpo: t => t === 0 ? 0 : t === 1 ? 1 : t < .5 ? Math.pow(2, 20 * t - 10) / 2 : (2 - Math.pow(2, -20 * t + 10)) / 2,
  outBack: t => { const c1 = 1.3, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); },
};

// progress of t through [a,b] with easing
export const prog = (t, a, b, e = ease.inOutCubic) => e(clamp((t - a) / (b - a)));
// in/out envelope: rises over [a, a+fi], holds, falls over [b-fo, b]
export const env = (t, a, b, fi = .5, fo = .5, e = ease.inOutCubic) => prog(t, a, a + fi, e) * (1 - prog(t, b - fo, b, e));

// Keyframe interpolation. keys: [[time, value, easing?], ...] value may be number or array.
export function kf(t, keys, def = ease.inOutCubic) {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 0; i < keys.length - 1; i++) {
    const [t0, v0] = keys[i], [t1, v1, e] = keys[i + 1];
    if (t <= t1) {
      const p = (e || def)(clamp((t - t0) / (t1 - t0)));
      return Array.isArray(v0) ? v0.map((x, j) => lerp(x, v1[j], p)) : lerp(v0, v1, p);
    }
  }
  return keys[keys.length - 1][1];
}

// Deterministic RNG
export function rng(seed = 1) {
  let a = seed >>> 0;
  return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
}

// Smooth 1D value noise in [-1,1]
const _h = n => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
export function noise1(x, seed = 0) {
  const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f);
  return lerp(_h(i + seed * 17.3), _h(i + 1 + seed * 17.3), u) * 2 - 1;
}
export const fbm1 = (x, seed = 0) => noise1(x, seed) * .6 + noise1(x * 2.1, seed + 3) * .3 + noise1(x * 4.3, seed + 7) * .1;

// Beat helpers (absolute time)
export const beatPhase = t => ((t - B0) % BEAT + BEAT) % BEAT;
export const beatPulse = (t, decay = 7) => Math.exp(-decay * beatPhase(t));
export const onBeat = n => B0 + n * BEAT; // time of beat n

// Pulse that fires at specific absolute times
export function hits(t, times, decay = 5, pre = 0.0) {
  let v = 0;
  for (const h of times) { const d = t - h + pre; if (d >= 0) v = Math.max(v, Math.exp(-decay * d)); }
  return v;
}
