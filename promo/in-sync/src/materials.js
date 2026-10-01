// Custom shaders: glass browser windows, phones, light thread, bokeh particles,
// glow sprites, nebula skies, metallic logo, billboards.
import * as THREE from 'three';

const DOF_VS = /* glsl */`
uniform float uFocus, uFocusRange, uDof;
varying float vCoc;
float coc(vec4 mv){ return clamp(abs(-mv.z - uFocus) / uFocusRange, 0., 1.) * uDof; }
`;

const SDF = /* glsl */`
float sdRoundBox(vec2 p, vec2 b, float r){ vec2 q = abs(p) - b + r; return length(max(q, 0.)) + min(max(q.x, q.y), 0.) - r; }
`;

// ---------------------------------------------------------------------------
// Screen material: browser windows, cards, photos. Optional chrome bar,
// scrollable content, rounded corners, rim light, sheen sweep, depth-of-field.
export function screenMaterial(o = {}) {
  return new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, side: THREE.DoubleSide,
    uniforms: {
      uMap: { value: o.map || null }, uChrome: { value: o.chrome || null },
      uAspect: { value: o.aspect || 1.6 }, uChromeFrac: { value: o.chromeFrac || 0 },
      uRadius: { value: o.radius ?? 0.03 }, uScroll: { value: 0 }, uView: { value: o.view ?? 1 },
      uOpacity: { value: 1 }, uBright: { value: o.bright ?? 0.9 }, uBlur: { value: 0 },
      uFocus: { value: 3 }, uFocusRange: { value: 4 }, uDof: { value: o.dof ?? 1 },
      uRim: { value: new THREE.Color(o.rim || '#ffffff') }, uRimAmt: { value: o.rimAmt ?? 0.35 },
      uSheen: { value: -2 }, uSheenAmt: { value: o.sheenAmt ?? 0.07 },
      uUseAlpha: { value: o.useAlpha ? 1 : 0 }, uReflect: { value: 0 }, uTint: { value: new THREE.Color(1, 1, 1) },
      uGlow: { value: 0 },
    },
    vertexShader: DOF_VS + /* glsl */`
      varying vec2 vUv;
      void main(){ vUv = uv; vec4 mv = modelViewMatrix * vec4(position, 1.); vCoc = coc(mv); gl_Position = projectionMatrix * mv; }`,
    fragmentShader: SDF + /* glsl */`
      uniform sampler2D uMap, uChrome; uniform float uAspect, uChromeFrac, uRadius, uScroll, uView, uOpacity, uBright, uBlur,
        uRimAmt, uSheen, uSheenAmt, uUseAlpha, uReflect, uGlow; uniform vec3 uRim, uTint;
      varying vec2 vUv; varying float vCoc;
      void main(){
        vec2 p = (vUv - .5) * vec2(uAspect, 1.);
        vec2 hs = vec2(uAspect, 1.) * .5;
        float d = sdRoundBox(p, hs, uRadius);
        float blur = clamp(vCoc + uBlur, 0., 1.);
        float aa = fwidth(d) * 1.2 + blur * .02;
        float inside = 1. - smoothstep(-aa, aa, d);
        float bias = blur * 3.2;
        vec4 c;
        float yTop = 1. - uChromeFrac;
        if (uChromeFrac > 0. && vUv.y > yTop) {
          c = texture(uChrome, vec2(vUv.x, (vUv.y - yTop) / uChromeFrac), bias);
        } else {
          float cy = vUv.y / yTop;
          float top = 1. - uScroll * (1. - uView);
          c = texture(uMap, vec2(vUv.x, top - (1. - cy) * uView), bias);
        }
        vec3 col = c.rgb * uBright * uTint;
        float a = inside * (uUseAlpha > .5 ? c.a : 1.);
        // glass edge: thin inner highlight + rim light
        float edge = 1. - smoothstep(0., aa * 2.5 + .004, abs(d + .0025));
        col += uRim * edge * uRimAmt * (0.55 + 0.45 * smoothstep(-hs.y, hs.y, p.y));
        // diagonal sheen sweep
        float s = exp(-pow((p.x * .55 + p.y - uSheen) * 5., 2.));
        col += vec3(1.) * s * uSheenAmt * inside;
        col += uRim * uGlow * inside;
        if (uReflect > 0.) { a *= uReflect * (1. - smoothstep(0., .5, vUv.y)) * .9; col *= .35; }
        gl_FragColor = vec4(col, a * uOpacity);
      }`,
  });
}

// ---------------------------------------------------------------------------
// Phone: titanium body, bezel, dynamic island (or punch hole), scrollable screen.
export function phoneMaterial(o = {}) {
  return new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, side: THREE.DoubleSide,
    uniforms: {
      uMap: { value: o.map || null }, uView: { value: 0.5 }, uScroll: { value: 0 },
      uAspect: { value: 417 / 876 }, uOpacity: { value: 1 }, uBright: { value: o.bright ?? 0.92 },
      uFocus: { value: 3 }, uFocusRange: { value: 4 }, uDof: { value: o.dof ?? 1 }, uBlur: { value: 0 },
      uMetal: { value: new THREE.Color(o.metal || '#8a8f9c') }, uLight: { value: o.light ?? 0.6 },
      uRim: { value: new THREE.Color(o.rim || '#ffffff') }, uSheen: { value: -2 }, uAndroid: { value: o.android ? 1 : 0 },
      uScreenGlow: { value: 0 }, uReflect: { value: 0 }, uStatus: { value: o.status ?? 1 },
    },
    vertexShader: DOF_VS + /* glsl */`
      varying vec2 vUv; varying vec3 vN;
      void main(){ vUv = uv; vec4 mv = modelViewMatrix * vec4(position,1.); vCoc = coc(mv); vN = normalize(normalMatrix * normal); gl_Position = projectionMatrix * mv; }`,
    fragmentShader: SDF + /* glsl */`
      uniform sampler2D uMap; uniform float uView, uScroll, uAspect, uOpacity, uBright, uBlur, uLight, uSheen, uAndroid, uScreenGlow, uReflect, uStatus;
      uniform vec3 uMetal, uRim;
      varying vec2 vUv; varying float vCoc; varying vec3 vN;
      void main(){
        // units: body height = 1 (876pt)
        float k = 1. / 876.;
        vec2 p = (vUv - .5) * vec2(uAspect, 1.);
        vec2 hb = vec2(uAspect, 1.) * .5;
        float rB = (uAndroid > .5 ? 44. : 62.) * k;
        float bez = (uAndroid > .5 ? 10. : 12.) * k;
        float rS = rB - bez;
        float dB = sdRoundBox(p, hb, rB);
        float dS = sdRoundBox(p, hb - bez, rS);
        float blur = clamp(vCoc + uBlur, 0., 1.);
        float aa = fwidth(dB) * 1.2 + blur * .02;
        float inB = 1. - smoothstep(-aa, aa, dB);
        float inS = 1. - smoothstep(-aa, aa, dS);
        // metal frame with angle-dependent highlight
        float ang = atan(p.y, p.x);
        float hl = pow(max(0., cos(ang - uLight * 3.14159 - vN.x * 2.)), 6.);
        vec3 metal = uMetal * (0.35 + 0.25 * smoothstep(-.5, .5, p.y)) + uRim * hl * .8;
        float band = 1. - smoothstep(0., 3.5 * k + aa, -dB);  // outer band
        vec3 col = mix(vec3(0.012), metal, band);
        // screen
        vec2 suv = (p + (hb - bez)) / ((hb - bez) * 2.);   // 0..1 in screen
        float statusH = 54. / 852. * uStatus;
        float top = 1. - uScroll * (1. - uView);
        float cy = suv.y / (1. - statusH);
        vec4 sc = texture(uMap, vec2(suv.x, top - (1. - min(cy, 1.)) * uView), blur * 3.2);
        vec3 statusCol = texture(uMap, vec2(.03, .995), 4.).rgb;
        vec3 scr = (suv.y > 1. - statusH ? statusCol : sc.rgb) * uBright;
        // island / punch hole
        vec2 ip = p - vec2(0., hb.y - bez - (uAndroid > .5 ? 26. : 29.) * k);
        float dI = uAndroid > .5 ? length(ip) - 11. * k : sdRoundBox(ip, vec2(63., 18.5) * k, 18.5 * k);
        scr = mix(scr, vec3(0.), 1. - smoothstep(-aa, aa, dI));
        // glass reflection
        float s = exp(-pow((p.x * .6 + p.y - uSheen) * 4., 2.));
        scr += vec3(1.) * s * .1 + vec3(1.) * .03 * smoothstep(.2, .5, p.y - p.x * .3);
        scr += uRim * uScreenGlow;
        col = mix(col, scr, inS);
        float a = inB;
        if (uReflect > 0.) { a *= uReflect * (1. - smoothstep(0., .45, vUv.y)) * .9; col *= .3; }
        gl_FragColor = vec4(col, a * uOpacity);
      }`,
  });
}

// ---------------------------------------------------------------------------
// Light thread: camera-facing ribbon along a curve with core, halo, head, pulses.
export function makeThread(points, o = {}) {
  const curve = points.isCurve ? points : new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(...p)), false, 'centripetal');
  const N = o.segments || 600;
  const pos = [], nxt = [], side = [], u = [], idx = [];
  const pts = curve.getSpacedPoints(N);
  for (let i = 0; i <= N; i++) {
    const a = pts[i], b = pts[Math.min(i + 1, N)], c = i === N ? pts[N - 1] : null;
    const nb = i === N ? new THREE.Vector3().subVectors(a, c).add(a) : b;
    for (const s of [-1, 1]) { pos.push(a.x, a.y, a.z); nxt.push(nb.x, nb.y, nb.z); side.push(s); u.push(i / N); }
    if (i < N) { const k = i * 2; idx.push(k, k + 1, k + 2, k + 1, k + 3, k + 2); }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('aNext', new THREE.Float32BufferAttribute(nxt, 3));
  g.setAttribute('aSide', new THREE.Float32BufferAttribute(side, 1));
  g.setAttribute('aU', new THREE.Float32BufferAttribute(u, 1));
  g.setIndex(idx);
  const m = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, depthTest: o.depthTest ?? true, blending: o.normal ? THREE.NormalBlending : THREE.AdditiveBlending, side: THREE.DoubleSide,
    uniforms: {
      uNormal: { value: o.normal ? 1 : 0 },
      uWidth: { value: o.width || 0.06 }, uHead: { value: 1 }, uTail: { value: 0 }, uTime: { value: 0 },
      uA: { value: new THREE.Color(o.colorA || '#ffd38a') }, uB: { value: new THREE.Color(o.colorB || o.colorA || '#ffd38a') },
      uI: { value: o.intensity ?? 1.6 }, uOpacity: { value: 1 }, uPulse: { value: o.pulse ?? 1 }, uPulseSpeed: { value: o.pulseSpeed ?? 0.5 },
      uPulseN: { value: o.pulseN ?? 3 }, uCore: { value: o.core ?? 1 }, uHeadGlow: { value: o.headGlow ?? 1 }, uWobble: { value: 0 }, uWobbleT: { value: 0 },
      uMinPx: { value: o.minPx ?? 2.5 },
    },
    vertexShader: /* glsl */`
      attribute vec3 aNext; attribute float aSide, aU;
      uniform float uWidth, uWobble, uWobbleT, uMinPx;
      varying float vSide, vU;
      void main(){
        vec4 mv = modelViewMatrix * vec4(position, 1.);
        vec4 mn = modelViewMatrix * vec4(aNext, 1.);
        vec3 t = normalize(mn.xyz - mv.xyz + 1e-6);
        vec3 s = normalize(cross(t, normalize(-mv.xyz)));
        // optional string vibration along the ribbon normal
        mv.xyz += s * uWobble * sin(aU * 3.14159 * 9. + uWobbleT) * sin(aU * 3.14159);
        float pxw = uMinPx * 2.0 * (-mv.z) / (projectionMatrix[1][1] * 540.);   // keep thread at least N px wide
        float w = max(uWidth, pxw);
        mv.xyz += s * aSide * w * .5;
        vSide = aSide; vU = aU;
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: /* glsl */`
      uniform float uHead, uTail, uTime, uI, uOpacity, uPulse, uPulseSpeed, uPulseN, uCore, uHeadGlow, uNormal;
      uniform vec3 uA, uB;
      varying float vSide, vU;
      void main(){
        float x = vSide;
        float core = exp(-x * x * 70.) * 2.2 * uCore;
        float glow = exp(-x * x * 5.) * .45;
        float vis = smoothstep(uTail, uTail + .015, vU) * (1. - smoothstep(uHead, uHead + .004, vU));
        float head = exp(-pow((vU - uHead) * 45., 2.)) * 4. * uHeadGlow * step(.001, uHead) * step(uHead, .999);
        float pulse = 0.;
        for (int i = 0; i < 6; i++) { if (float(i) >= uPulseN) break;
          float pp = fract(uTime * uPulseSpeed + float(i) / uPulseN);
          pulse += exp(-pow((vU - pp) * 35., 2.)); }
        float ends = smoothstep(0., .03, vU) * smoothstep(1., .97, vU);
        vec3 col = mix(uA, uB, vU) * (core + glow) * (1. + pulse * uPulse * 2.5 + head) * uI;
        if (uNormal > .5) { float a = clamp((core * .5 + glow * .5) * (1. + pulse * uPulse + head * .3), 0., 1.) * vis * ends * uOpacity;
          gl_FragColor = vec4(mix(uA, uB, vU) * (1. + pulse * uPulse * .6), a); return; }
        gl_FragColor = vec4(col * vis * ends * uOpacity, 1.);
      }`,
  });
  const mesh = new THREE.Mesh(g, m);
  mesh.frustumCulled = false;
  mesh.curve = curve;
  return mesh;
}

// ---------------------------------------------------------------------------
// Particles: stars, dust, fireflies with bokeh discs for out-of-focus points.
export function makeParticles(n, o = {}, rand = Math.random) {
  const pos = new Float32Array(n * 3), size = new Float32Array(n), col = new Float32Array(n * 3), ph = new Float32Array(n);
  const box = o.box || [40, 24, 60], center = o.center || [0, 0, -20];
  const cols = (o.colors || ['#ffffff', '#c9d4ff', '#ffe2b8']).map(c => new THREE.Color(c));
  for (let i = 0; i < n; i++) {
    let x, y, z;
    if (o.shell) { const th = rand() * Math.PI * 2, u = rand() * 2 - 1, r = o.shell[0] + rand() * (o.shell[1] - o.shell[0]); x = Math.sqrt(1 - u * u) * Math.cos(th) * r; y = u * r; z = Math.sqrt(1 - u * u) * Math.sin(th) * r; }
    else { x = (rand() - .5) * box[0]; y = (rand() - .5) * box[1]; z = (rand() - .5) * box[2]; }
    pos.set([x + center[0], y + center[1], z + center[2]], i * 3);
    size[i] = (o.size || 1) * Math.pow(rand(), o.sizePow || 3) * (o.sizeMax || 4) + (o.sizeMin || 0.6);
    const c = cols[Math.floor(rand() * cols.length)]; col.set([c.r, c.g, c.b], i * 3);
    ph[i] = rand() * 100;
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.setAttribute('aSize', new THREE.BufferAttribute(size, 1));
  g.setAttribute('aColor', new THREE.BufferAttribute(col, 3));
  g.setAttribute('aPhase', new THREE.BufferAttribute(ph, 1));
  const m = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    uniforms: { uTime: { value: 0 }, uFocus: { value: o.focus ?? 6 }, uFocusRange: { value: o.focusRange ?? 6 }, uBokeh: { value: o.bokeh ?? 1 },
      uI: { value: o.intensity ?? 1 }, uOpacity: { value: 1 }, uTwinkle: { value: o.twinkle ?? 0.5 }, uDrift: { value: new THREE.Vector3() },
      uWrap: { value: new THREE.Vector3(...box) }, uCenter: { value: new THREE.Vector3(...center) }, uStretch: { value: 0 } },
    vertexShader: /* glsl */`
      attribute float aSize, aPhase; attribute vec3 aColor;
      uniform float uTime, uFocus, uFocusRange, uBokeh, uTwinkle, uStretch; uniform vec3 uDrift, uWrap, uCenter;
      varying vec3 vC; varying float vA, vBok;
      void main(){
        vec3 p = position + uDrift;
        if (uWrap.x > 0.) { p = uCenter + mod(p - uCenter + uWrap * .5, uWrap) - uWrap * .5; }
        vec4 mv = modelViewMatrix * vec4(p, 1.);
        float dist = max(-mv.z, .05);
        float base = aSize * 540. * projectionMatrix[1][1] * .012 / dist;
        float coc = clamp(abs(dist - uFocus) / uFocusRange, 0., 3.) * uBokeh;
        float sz = base + coc * 22. * min(1., 4. / dist) ;
        gl_PointSize = clamp(sz * (1. + uStretch), 1.5, 160.);
        float tw = 1. - uTwinkle + uTwinkle * (0.5 + 0.5 * sin(uTime * 2.2 + aPhase));
        vA = tw * min(1., (base * base) / (sz * sz) * 1.8 + .02) * smoothstep(.1, .6, dist);
        vBok = clamp(coc, 0., 1.);
        vC = aColor;
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: /* glsl */`
      uniform float uI, uOpacity; varying vec3 vC; varying float vA, vBok;
      void main(){
        float r = length(gl_PointCoord - .5) * 2.;
        if (r > 1.) discard;
        float soft = exp(-r * r * 4.);
        float disc = smoothstep(1., .82, r) * (.55 + .45 * smoothstep(.55, .95, r));
        float v = mix(soft, disc * .7, vBok);
        gl_FragColor = vec4(vC * v * vA * uI * uOpacity, 1.);
      }`,
  });
  const pts = new THREE.Points(g, m); pts.frustumCulled = false;
  return pts;
}

// ---------------------------------------------------------------------------
// Additive glow sprite (radial gaussian, optional anamorphic stretch).
export function glowMaterial(o = {}) {
  return new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, depthTest: o.depthTest ?? true, blending: THREE.AdditiveBlending,
    uniforms: { uC: { value: new THREE.Color(o.color || '#ffffff') }, uI: { value: o.intensity ?? 1 }, uOpacity: { value: 1 }, uFall: { value: o.falloff ?? 4 }, uRing: { value: o.ring ?? 0 }, uRingR: { value: o.ringR ?? .6 }, uRingW: { value: o.ringW ?? .03 }, uCoreI: { value: o.core ?? 1 } },
    vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }`,
    fragmentShader: /* glsl */`
      uniform vec3 uC; uniform float uI, uOpacity, uFall, uRing, uRingR, uRingW, uCoreI; varying vec2 vUv;
      void main(){ float r = length(vUv - .5) * 2.;
        float g = exp(-r * r * uFall) * smoothstep(1., .8, r) * uCoreI;
        float ring = exp(-pow((r - uRingR) / uRingW, 2.)) * uRing;
        gl_FragColor = vec4(uC * (g + ring) * uI * uOpacity, 1.); }`,
  });
}
export function glow(o = {}) {
  const m = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), glowMaterial(o));
  m.scale.set(o.sx || o.size || 1, o.sy || o.size || 1, 1);
  if (o.billboard !== false) m.userData.billboard = true;
  return m;
}

// ---------------------------------------------------------------------------
// Logo: metallic Suede mark with draw-on reveal (conic sweep), light sweep, glow.
export function logoMaterial(o = {}) {
  return new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, side: THREE.DoubleSide,
    uniforms: { uMask: { value: o.mask }, uReveal: { value: 1 }, uSweep: { value: -2 }, uOpacity: { value: 1 },
      uA: { value: new THREE.Color(o.colorA || '#f4f6ff') }, uB: { value: new THREE.Color(o.colorB || '#8d97c4') },
      uEdge: { value: new THREE.Color(o.edge || '#b9c4ff') }, uI: { value: o.intensity ?? 1 }, uEmit: { value: o.emit ?? 0 }, uRot: { value: 0 } },
    vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }`,
    fragmentShader: /* glsl */`
      uniform sampler2D uMask; uniform float uReveal, uSweep, uOpacity, uI, uEmit, uRot; uniform vec3 uA, uB, uEdge; varying vec2 vUv;
      void main(){
        vec4 m = texture(uMask, vUv);
        vec2 p = vUv - .5;
        float ang = fract((atan(p.y, p.x) / 6.28318) + .25 + uRot);   // 0..1 clockwise from top
        float r = length(p);
        float rev = uReveal * 1.08;
        float vis = smoothstep(rev, rev - .06, ang);
        float edge = exp(-pow((ang - rev + .03) * 30., 2.)) * step(.001, uReveal) * step(uReveal, .999);
        vec3 metal = mix(uB, uA, smoothstep(-.35, .35, p.y - p.x * .4));
        metal *= .85 + .15 * sin(r * 160.);   // fine brushed rings
        float s = exp(-pow((p.x + p.y * .6 - uSweep) * 7., 2.));
        vec3 col = metal * uI + vec3(1.) * s * 1.4 + uEdge * edge * 4. + uEdge * uEmit;
        gl_FragColor = vec4(col, m.a * max(vis, edge * .8) * uOpacity);
      }`,
  });
}

// ---------------------------------------------------------------------------
// Billboarded icon orb (circular crop + ring) — used for the product galaxy.
export function orbMaterial(o = {}) {
  return new THREE.ShaderMaterial({
    transparent: true, depthWrite: false,
    uniforms: { uMap: { value: o.map }, uC: { value: new THREE.Color(o.color || '#8fa0ff') }, uOpacity: { value: 1 }, uGlow: { value: 0.6 }, uScale: { value: o.scale || .5 } },
    vertexShader: /* glsl */`uniform float uScale; varying vec2 vUv;
      void main(){ vUv = uv; vec4 mv = modelViewMatrix * vec4(0.,0.,0.,1.); mv.xy += position.xy * uScale; gl_Position = projectionMatrix * mv; }`,
    fragmentShader: /* glsl */`
      uniform sampler2D uMap; uniform vec3 uC; uniform float uOpacity, uGlow; varying vec2 vUv;
      void main(){ vec2 p = (vUv - .5) * 2.; float r = length(p);
        float aa = fwidth(r) * 1.5;
        float disc = 1. - smoothstep(.62 - aa, .62 + aa, r);
        vec2 iuv = p / .62 * .5 * .82 + .5;
        vec3 ic = texture(uMap, iuv).rgb;
        float ring = exp(-pow((r - .7) / .025, 2.)) * 1.2 + exp(-pow((r - .7) / .12, 2.)) * .25;
        float halo = exp(-r * r * 2.5) * uGlow * (1. - disc);
        vec3 col = ic * disc * .95 + uC * (ring + halo) ;
        float a = max(disc, clamp(ring + halo, 0., 1.));
        gl_FragColor = vec4(col, a * uOpacity); }`,
  });
}

// ---------------------------------------------------------------------------
// Nebula sky: generated once per scene into an equirect texture.
export function nebulaGenMaterial(o) {
  return new THREE.ShaderMaterial({
    uniforms: { uA: { value: new THREE.Color(o.a) }, uB: { value: new THREE.Color(o.b) }, uC: { value: new THREE.Color(o.c || o.b) },
      uBase: { value: new THREE.Color(o.base || '#020309') }, uSeed: { value: o.seed || 1 }, uDensity: { value: o.density ?? 1 }, uStars: { value: o.stars ?? 1 } },
    vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0., 1.); }`,
    fragmentShader: /* glsl */`
      uniform vec3 uA, uB, uC, uBase; uniform float uSeed, uDensity, uStars; varying vec2 vUv;
      vec3 hash3(vec3 p){ p = fract(p * vec3(.1031,.1030,.0973)); p += dot(p, p.yxz + 33.33); return fract((p.xxy + p.yxx) * p.zyx); }
      float noise(vec3 p){ vec3 i = floor(p), f = fract(p); f = f*f*(3.-2.*f);
        float n = mix(mix(mix(hash3(i).x, hash3(i+vec3(1,0,0)).x, f.x), mix(hash3(i+vec3(0,1,0)).x, hash3(i+vec3(1,1,0)).x, f.x), f.y),
                      mix(mix(hash3(i+vec3(0,0,1)).x, hash3(i+vec3(1,0,1)).x, f.x), mix(hash3(i+vec3(0,1,1)).x, hash3(i+vec3(1,1,1)).x, f.x), f.y), f.z);
        return n; }
      float fbm(vec3 p){ float s = 0., a = .5; for (int i = 0; i < 6; i++){ s += a * noise(p); p = p * 2.03 + 17.1; a *= .5; } return s; }
      void main(){
        float lon = (vUv.x - .5) * 6.28318, lat = (vUv.y - .5) * 3.14159;
        vec3 d = vec3(cos(lat) * sin(lon), sin(lat), -cos(lat) * cos(lon));
        vec3 q = d * 2.2 + uSeed;
        float w = fbm(q + fbm(q * 1.7) * 1.4);
        float m1 = smoothstep(.45, .85, w) * uDensity;
        float m2 = smoothstep(.55, .95, fbm(q * 2.3 + 4.)) * uDensity;
        float band = exp(-pow(d.y * 2.6 + .2 * sin(lon * 2.), 2.));   // galactic band
        vec3 col = uBase + uA * m1 * (.35 + .65 * band) * .55 + uB * m2 * band * .45 + uC * pow(w, 3.) * .25;
        // fine stars baked into sky
        vec3 sp = d * 420.; vec3 id = floor(sp); vec3 h = hash3(id + uSeed);
        float st = step(.9965, h.x) * smoothstep(.45, .0, length(fract(sp) - .5)) * (h.y * 1.5 + .2);
        col += vec3(.85, .9, 1.) * st * uStars;
        gl_FragColor = vec4(col, 1.);
      }`,
  });
}

export function skyMaterial(tex) {
  return new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false,
    uniforms: { uTex: { value: tex }, uI: { value: 1 }, uTint: { value: new THREE.Color(1, 1, 1) } },
    vertexShader: `varying vec3 vD; void main(){ vD = normalize(position); vec4 p = projectionMatrix * modelViewMatrix * vec4(position,1.); gl_Position = p.xyww; }`,
    fragmentShader: /* glsl */`uniform sampler2D uTex; uniform float uI; uniform vec3 uTint; varying vec3 vD;
      void main(){ vec3 d = normalize(vD); float lon = atan(d.x, -d.z), lat = asin(clamp(d.y, -1., 1.));
        vec2 uv = vec2(lon / 6.28318 + .5, lat / 3.14159 + .5);
        gl_FragColor = vec4(texture(uTex, uv).rgb * uI * uTint, 1.); }`,
  });
}

// ---------------------------------------------------------------------------
// Gold coin faces and edge (procedural metal, no env map needed).
export function coinMaterial(o = {}) {
  return new THREE.ShaderMaterial({
    uniforms: { uMask: { value: o.mask }, uFace: { value: o.face ? 1 : 0 }, uSweep: { value: 0 }, uI: { value: 1 } },
    vertexShader: `varying vec2 vUv; varying vec3 vN, vV; void main(){ vUv = uv; vN = normalize(normalMatrix * normal); vec4 mv = modelViewMatrix * vec4(position,1.); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }`,
    fragmentShader: /* glsl */`
      uniform sampler2D uMask; uniform float uFace, uSweep, uI; varying vec2 vUv; varying vec3 vN, vV;
      void main(){
        vec3 gold = vec3(1.0, .72, .32), dark = vec3(.32, .18, .05);
        vec3 L1 = normalize(vec3(-.5, .7, .6)), L2 = normalize(vec3(.8, -.2, .4));
        vec3 n = normalize(vN);
        vec3 col;
        if (uFace > .5) {
          vec2 p = vUv - .5; float r = length(p) * 2.;
          float m = texture(uMask, (p * 1.18) + .5).a;
          // raised rim and emblem
          float rim = smoothstep(.86, .9, r) * (1. - smoothstep(.97, 1., r));
          float lift = max(m, rim);
          float dx = texture(uMask, (p * 1.18) + .5 + vec2(.004, 0.)).a - m, dy = texture(uMask, (p * 1.18) + .5 + vec2(0., .004)).a - m;
          vec3 nn = normalize(n + vec3(-dx, -dy, 0.) * 6.);
          float dif = max(dot(nn, L1), 0.) * .8 + max(dot(nn, L2), 0.) * .35;
          float spec = pow(max(dot(reflect(-L1, nn), vV), 0.), 24.) * 1.6;
          vec3 base = mix(dark * 1.4, gold * .75, .35 + .2 * sin(r * 90.));   // fine guilloche rings
          col = mix(base * (.35 + dif * .7), gold * (.6 + dif) , lift) + vec3(1., .85, .6) * spec * (.4 + lift);
          float s = exp(-pow((p.x + p.y * .7 - uSweep) * 6., 2.));
          col += vec3(1., .86, .55) * s * (1.2 + lift * 2.);
        } else {
          float ridges = .65 + .35 * sin(vUv.x * 3.14159 * 2. * 140.);
          float dif = max(dot(n, L1), 0.) * .8 + max(dot(n, L2), 0.) * .4;
          float spec = pow(max(dot(reflect(-L1, n), vV), 0.), 16.);
          col = gold * (.25 + dif * .8) * ridges + vec3(1., .85, .6) * spec;
        }
        gl_FragColor = vec4(col * uI, 1.);
      }`,
  });
}
