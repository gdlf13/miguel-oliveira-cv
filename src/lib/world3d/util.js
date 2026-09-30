// Utilitários partilhados do mundo 3D: RNG determinístico, easing, ruído, geometrias.
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";

export const TAU = Math.PI * 2;
export const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const lerp = (a, b, t) => a + (b - a) * t;
export const smooth = (x) => { x = clamp(x); return x * x * (3 - 2 * x); };
export const smoother = (x) => { x = clamp(x); return x * x * x * (x * (x * 6 - 15) + 10); };
export const easeOutBack = (x, s = 1.55) => { x = clamp(x); const c = s + 1; return 1 + c * Math.pow(x - 1, 3) + s * Math.pow(x - 1, 2); };
export const easeOutCubic = (x) => 1 - Math.pow(1 - clamp(x), 3);

export function rng(seed = 1) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ruído de valor 1D/2D suave
const H = (n) => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
export function noise1(x, seed = 0) {
  const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f);
  return lerp(H(i + seed * 17.3), H(i + 1 + seed * 17.3), u) * 2 - 1;
}
export function noise2(x, y, seed = 0) {
  const ix = Math.floor(x), iy = Math.floor(y), fx = x - ix, fy = y - iy;
  const ux = fx * fx * (3 - 2 * fx), uy = fy * fy * (3 - 2 * fy);
  const h = (a, b) => H(a * 57 + b * 131 + seed * 19.19);
  return lerp(lerp(h(ix, iy), h(ix + 1, iy), ux), lerp(h(ix, iy + 1), h(ix + 1, iy + 1), ux), uy) * 2 - 1;
}

export const rbox = (w, h, d, r = 0.06, seg = 3) => new RoundedBoxGeometry(w, h, d, seg, Math.min(r, w / 2 - 1e-3, h / 2 - 1e-3, d / 2 - 1e-3));

// mesh com sombra
export function mesh(geo, mat, { cast = true, receive = true, pos, rot, scl, name } = {}) {
  const m = new THREE.Mesh(geo, mat);
  m.castShadow = cast; m.receiveShadow = receive;
  if (pos) m.position.set(pos[0], pos[1], pos[2]);
  if (rot) m.rotation.set(rot[0], rot[1], rot[2]);
  if (scl) (typeof scl === "number") ? m.scale.setScalar(scl) : m.scale.set(scl[0], scl[1], scl[2]);
  if (name) m.name = name;
  return m;
}

// posição polar no plano do palco
export const polar = (r, a) => [Math.cos(a) * r, Math.sin(a) * r];

// tubo ao longo de pontos (Catmull-Rom) com raio fixo ou função
export function tubeAlong(points, radius, { seg = 64, radial = 10, closed = false, tension = 0.5 } = {}) {
  const curve = new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p)), closed, "catmullrom", tension);
  return { curve, geo: new THREE.TubeGeometry(curve, seg, radius, radial, closed) };
}

// tubo cónico (raio decrescente) construído à mão
export function taperedTube(curve, r0, r1, { seg = 32, radial = 8, c0, c1 } = {}) {
  const pos = [], idx = [], nrm = [], col = [];
  const k0 = c0 && new THREE.Color(c0), k1 = c1 && new THREE.Color(c1), kk = new THREE.Color();
  const frames = curve.computeFrenetFrames(seg, false);
  for (let i = 0; i <= seg; i++) {
    const u = i / seg, p = curve.getPointAt(u), N = frames.normals[i], B = frames.binormals[i];
    const r = lerp(r0, r1, Math.pow(u, 0.85));
    for (let j = 0; j <= radial; j++) {
      const a = (j / radial) * TAU, c = Math.cos(a), s = Math.sin(a);
      const nx = c * N.x + s * B.x, ny = c * N.y + s * B.y, nz = c * N.z + s * B.z;
      pos.push(p.x + r * nx, p.y + r * ny, p.z + r * nz); nrm.push(nx, ny, nz);
      if (k0) { kk.copy(k0).lerp(k1, u); col.push(kk.r, kk.g, kk.b); }
    }
  }
  for (let i = 0; i < seg; i++) for (let j = 0; j < radial; j++) {
    const a = i * (radial + 1) + j, b = (i + 1) * (radial + 1) + j;
    idx.push(a, b, a + 1, b, b + 1, a + 1);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute("normal", new THREE.Float32BufferAttribute(nrm, 3));
  g.setIndex(idx);
  if (k0) g.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
  return g;
}

export function disposeTree(obj) {
  obj.traverse((o) => {
    if (o.geometry) o.geometry.dispose();
    if (o.material) { (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => { for (const k in m) if (m[k] && m[k].isTexture) m[k].dispose(); m.dispose(); }); }
  });
}
