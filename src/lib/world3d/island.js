// Plataforma flutuante: tampo liso + banda de terra + rocha facetada por baixo.
import * as THREE from "three";
import { PAL } from "./materials.js";
import { rng, noise1, TAU, mesh } from "./util.js";

export const YAW = 0.62; // o "palco" de cada ilha roda para encarar a câmara

export function makeIsland(M, { R = 6.5, top = PAL.sand, soil = PAL.soil, rock = [PAL.rock, PAL.rockD], seed = 1, depth = 5.2, squash = [1, 1], wob = 0.05, topMat } = {}) {
  const r = rng(seed);
  const group = new THREE.Group();
  const shape = (x, z) => { // deformação orgânica partilhada por tampo e rocha
    const a = Math.atan2(z, x), k = 1 + wob * noise1(a * 1.7 + seed * 3.1, seed) + wob * 0.6 * noise1(a * 3.9 + seed, seed + 4);
    return [x * k * squash[0], z * k * squash[1]];
  };
  const deform = (geo) => { const p = geo.attributes.position; for (let i = 0; i < p.count; i++) { const [x, z] = shape(p.getX(i), p.getZ(i)); p.setX(i, x); p.setZ(i, z); } p.needsUpdate = true; geo.computeVertexNormals(); return geo; };

  // tampo (topo liso com cantos arredondados)
  const prof = [[0, 0.0], [R - 0.32, 0.0]];
  for (let i = 1; i <= 6; i++) { const a = (i / 6) * Math.PI / 2; prof.push([R - 0.32 + Math.sin(a) * 0.32, -0.32 + Math.cos(a) * 0.32]); }
  prof.push([R, -0.62], [R - 0.02, -0.66], [R - 0.02, -0.7]);
  const topGeo = deform(new THREE.LatheGeometry(prof.map(([x, y]) => new THREE.Vector2(x, y)).reverse(), 96));
  group.add(mesh(topGeo, topMat || M.clay(top, { rough: 0.9, bump: 0.25 })));

  // banda de solo (uma camada mais escura sob o tampo)
  const band = deform(new THREE.CylinderGeometry(R * 0.995, R * 0.97, 0.5, 96, 1, false));
  band.translate(0, -0.9, 0);
  group.add(mesh(band, M.clay(soil, { rough: 1, bump: 0.5 }), { cast: false }));

  // rocha facetada
  const segs = 13, rows = 7, pts = [];
  for (let i = 0; i <= rows; i++) {
    const t = i / rows, y = -0.95 - t * depth;
    let rad = R * (0.98 - 0.86 * Math.pow(t, 0.8)) * (0.86 + r() * 0.26);
    if (i <= 1) rad = Math.max(rad, R * (i === 0 ? 0.985 : 0.93)); // o topo da rocha fica escondido sob a banda de solo (sem frestas)
    pts.push(new THREE.Vector2(Math.max(0.15, rad), y));
  }
  pts.push(new THREE.Vector2(0.001, -0.95 - depth - 0.35));
  const rg = new THREE.LatheGeometry(pts.slice().reverse(), segs);
  const pp = rg.attributes.position, col = new Float32Array(pp.count * 3), c1 = new THREE.Color(rock[0]), c2 = new THREE.Color(rock[1]), tmp = new THREE.Color();
  // Lathe: índice = seg * npts + j. A costura (seg = segs) e o polo têm de partilhar o mesmo "ruído", senão abre-se uma fenda.
  const NP = pts.length, jit = new Map();
  for (let i = 0; i < pp.count; i++) {
    const seg = Math.floor(i / NP), jr = i % NP, key = jr === 0 ? "pole" : jr + "_" + (seg % segs);
    const a = (r() - 0.5) * 0.35, b = (r() - 0.5) * 0.3, c = (r() - 0.5) * 0.08; // mesmo nº de chamadas a r() que antes
    if (!jit.has(key)) jit.set(key, [a, b, c]);
    const [j, jy, jc] = jit.get(key);
    let [x, z] = shape(pp.getX(i), pp.getZ(i));
    if (jr === 0) { x = 0; z = 0; }
    pp.setX(i, x + (jr === 0 ? 0 : j)); pp.setZ(i, z + (jr === 0 ? 0 : j * 0.7)); pp.setY(i, pp.getY(i) + jy);
    const t = THREE.MathUtils.clamp((-pp.getY(i) - 0.95) / depth, 0, 1);
    tmp.copy(c1).lerp(c2, Math.pow(t, 0.8) * 0.9 + jc); col.set([tmp.r, tmp.g, tmp.b], i * 3);
  }
  rg.setAttribute("color", new THREE.BufferAttribute(col, 3));
  const rgn = rg.toNonIndexed(); rgn.computeVertexNormals();
  group.add(mesh(rgn, new THREE.MeshStandardMaterial({ vertexColors: true, flatShading: true, roughness: 0.95, envMapIntensity: 0.35 }), { receive: true }));

  // estalactites
  const st = new THREE.Group();
  for (let i = 0; i < 5; i++) {
    const a = r() * TAU, rr = r() * R * 0.35, h = 1.2 + r() * 2.2;
    const cone = mesh(new THREE.ConeGeometry(0.28 + r() * 0.35, h, 6), M.clay(rock[1], { flat: true, noBump: true, rough: 1 }), { cast: false });
    cone.rotation.x = Math.PI; cone.position.set(Math.cos(a) * rr, -depth - 0.4 - h * 0.35, Math.sin(a) * rr); cone.rotation.z = (r() - 0.5) * 0.4; st.add(cone);
  }
  group.add(st);

  // pedrinhas a flutuar
  const chunks = [];
  for (let i = 0; i < 4; i++) {
    const a = r() * TAU, rr = R * (0.55 + r() * 0.5), s = 0.22 + r() * 0.34;
    const c = mesh(new THREE.IcosahedronGeometry(s, 0), M.clay(rock[0], { flat: true, noBump: true, rough: 1 }));
    c.position.set(Math.cos(a) * rr, -3.2 - r() * 3.8, Math.sin(a) * rr); c.userData = { y0: c.position.y, ph: r() * TAU, sp: 0.4 + r() * 0.5 }; c.rotation.set(r() * 3, r() * 3, r() * 3); group.add(c); chunks.push(c);
  }
  group.userData.chunks = chunks;
  const update = (t) => chunks.forEach((c) => { c.position.y = c.userData.y0 + Math.sin(t * c.userData.sp + c.userData.ph) * 0.18; c.rotation.y += 0.002; });
  return { group, update, shape };
}
