// Disposição do arquipélago + coreografia da câmara (função pura do progresso 0..1 do scroll).
import * as THREE from "three";
import { YAW } from "./island.js";
import { clamp, lerp, smooth } from "./util.js";

const R = new THREE.Vector3(Math.cos(YAW), 0, -Math.sin(YAW));   // "direita" no ecrã
const F = new THREE.Vector3(-Math.sin(YAW), 0, -Math.cos(YAW));  // "para dentro" do ecrã

// passos relativos (direita, cima, profundidade) a partir da ilha anterior
const STEPS = [[0, 0, 0], [15, 3, 26], [-8, -3, 26], [15, 4, 26], [-12, -2, 26], [13, 3, 26]];

export const ISLANDS = [
  { id: "inicio",     dist: 40, focus: [1.2, 2.6, 0],  pitch: 0.50, dyaw: 0.00 },
  { id: "pensamento", dist: 42, focus: [0.4, 4.0, 0],  pitch: 0.48, dyaw: -0.06 },
  { id: "escrita",    dist: 42, focus: [0, 2.2, 0],    pitch: 0.52, dyaw: 0.10 },
  { id: "projectos",  dist: 42, focus: [0, 2.6, 0],    pitch: 0.50, dyaw: -0.08 },
  { id: "percurso",   dist: 38, focus: [0.4, 2.3, 0],    pitch: 0.46, dyaw: 0.08 },
  { id: "contacto",   dist: 40, focus: [0, 2.2, 0],    pitch: 0.50, dyaw: 0.00 },
];

// posições no mundo
const p = new THREE.Vector3();
ISLANDS.forEach((isl, i) => {
  const [r, u, f] = STEPS[i];
  p.addScaledVector(R, r).addScaledVector(F, f).y += u;
  isl.pos = p.clone();
});

export { DWELL, CONN, SCROLL_VH, SEG, totalScreens, copyWeight, activeIndex } from "./timeline.js";
import { SEG } from "./timeline.js";

// interpolação monótona cúbica (Fritsch–Carlson)
function pchip(xs, ys) {
  const n = xs.length, d = [], m = new Array(n).fill(0);
  for (let i = 0; i < n - 1; i++) d[i] = (ys[i + 1] - ys[i]) / (xs[i + 1] - xs[i]);
  m[0] = d[0]; m[n - 1] = d[n - 2];
  for (let i = 1; i < n - 1; i++) m[i] = d[i - 1] * d[i] <= 0 ? 0 : (2 * d[i - 1] * d[i]) / (d[i - 1] + d[i]);
  return (x) => {
    if (x <= xs[0]) return ys[0]; if (x >= xs[n - 1]) return ys[n - 1];
    let i = 0; while (x > xs[i + 1]) i++;
    const h = xs[i + 1] - xs[i], t = (x - xs[i]) / h, t2 = t * t, t3 = t2 * t;
    return (2 * t3 - 3 * t2 + 1) * ys[i] + (t3 - 2 * t2 + t) * h * m[i] + (-2 * t3 + 3 * t2) * ys[i + 1] + (t3 - t2) * h * m[i + 1];
  };
}

function worldFocus(i) {
  const isl = ISLANDS[i], f = new THREE.Vector3(...isl.focus);
  f.applyAxisAngle(new THREE.Vector3(0, 1, 0), YAW);
  return isl.pos.clone().add(f);
}

// largura mínima (em unidades do mundo) que tem de caber no ecrã à volta de uma ilha
const FIT_WIDTH = 19;
export function fitScale(aspect, fov, dist) {
  const half = Math.tan((fov * Math.PI) / 360);
  return Math.max(1, FIT_WIDTH / (2 * half * aspect * dist));
}

export function buildCameraTrack(aspect = 16 / 9, fov = 28) {
  const us = [], ch = { x: [], y: [], z: [], d: [], pitch: [], yaw: [], lift: [] };
  const push = (u, tgt, dist, pitch, yaw, lift = 0) => { us.push(u); ch.x.push(tgt.x); ch.y.push(tgt.y); ch.z.push(tgt.z); ch.d.push(dist); ch.pitch.push(pitch); ch.yaw.push(yaw); ch.lift.push(lift); };
  ISLANDS.forEach((isl, i) => {
    const s = SEG[i], t = worldFocus(i), k = fitScale(aspect, fov, isl.dist), dist = isl.dist * k;
    push(lerp(s.a, s.b, 0.12), t, dist, isl.pitch, YAW + isl.dyaw);
    push(lerp(s.a, s.b, 0.88), t, dist, isl.pitch, YAW + isl.dyaw);
    if (i < ISLANDS.length - 1) {
      const n = worldFocus(i + 1), mid = t.clone().lerp(n, 0.5); mid.y += 3.5;
      const um = (s.b + s.next) / 2, sign = i % 2 ? -1 : 1;
      const dmax = Math.max(isl.dist, ISLANDS[i + 1].dist);
      push(um, mid, dmax * 1.75 * fitScale(aspect, fov, dmax), 0.66, YAW + sign * 0.22);
    }
  });
  // pull-back final: mostra o arquipélago
  const last = SEG[SEG.length - 1];
  const tf = worldFocus(ISLANDS.length - 1);
  const f = { x: pchip(us, ch.x), y: pchip(us, ch.y), z: pchip(us, ch.z), d: pchip(us, ch.d), pitch: pchip(us, ch.pitch), yaw: pchip(us, ch.yaw) };
  return (u) => {
    u = clamp(u);
    const tgt = new THREE.Vector3(f.x(u), f.y(u), f.z(u)), dist = f.d(u), pitch = f.pitch(u), yaw = f.yaw(u);
    return { target: tgt, dist, pitch, yaw };
  };
}

