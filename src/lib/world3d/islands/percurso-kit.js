// Peças partilhadas pela ilha 5 (Percurso) e pelos seus edifícios: fundir geometrias por material, telhados, texturas de placas/letras/emblemas.
import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { mesh, rbox, TAU } from "../util.js";

// fundir geometrias por material (poucos draw calls)
export function bucket() {
  const map = new Map(), m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(0, 0, 0, "YXZ"), pv = new THREE.Vector3(), sv = new THREE.Vector3();
  const api = {
    add(geo, mat, { p = [0, 0, 0], r = [0, 0, 0], s = 1, cast = true, live = false } = {}) {
      const g = geo.index ? geo.toNonIndexed() : geo.clone();
      for (const k of Object.keys(g.attributes)) if (k !== "position" && k !== "normal" && k !== "uv") g.deleteAttribute(k);
      if (!g.attributes.uv) g.setAttribute("uv", new THREE.BufferAttribute(new Float32Array(g.attributes.position.count * 2), 2));
      e.set(r[0], r[1], r[2]); q.setFromEuler(e); pv.set(p[0], p[1], p[2]);
      if (typeof s === "number") sv.set(s, s, s); else sv.set(s[0], s[1], s[2]);
      g.applyMatrix4(m4.compose(pv, q, sv));
      const key = mat.uuid + (cast ? "c" : "n") + (live ? "L" : "");
      let ent = map.get(key); if (!ent) map.set(key, (ent = { mat, cast, live, geos: [] }));
      ent.geos.push(g);
      return api;
    },
    box(w, h, d, mat, p, o = {}) { return api.add(o.flat ? new THREE.BoxGeometry(w, h, d) : rbox(w, h, d, o.r ?? 0.04, o.seg ?? 2), mat, { p, r: o.rot, cast: o.cast, live: o.live }); },
    build(parent) { map.forEach((ent) => { const m = mesh(ent.geos.length > 1 ? mergeGeometries(ent.geos) : ent.geos[0], ent.mat, { cast: ent.cast }); if (ent.live) m.userData.live = true; parent.add(m); }); map.clear(); return parent; },
  };
  return api;
}

// telhado de duas águas: cumeeira ao longo de x, profundidade em z, base em y=0
export function gable(len, depth, rise, over = 0.14) {
  const s = new THREE.Shape(), hd = depth / 2 + over;
  s.moveTo(-hd, 0); s.lineTo(hd, 0); s.lineTo(0, rise); s.lineTo(-hd, 0);
  const g = new THREE.ExtrudeGeometry(s, { depth: len, bevelEnabled: true, bevelSize: 0.045, bevelThickness: 0.045, bevelSegments: 2, curveSegments: 2 });
  g.translate(0, 0, -len / 2); g.rotateY(-Math.PI / 2);
  return g;
}

// setor de anel (degraus/balaustradas curvos): raio interior r0, exterior r1, altura h, ângulo a0..a1 (0 = +z, positivo para +x), base em y=0
export function ringSector(r0, r1, h, a0, a1, seg = 28, bev = 0.02) {
  const s = new THREE.Shape(); // shape em (x, y) -> depois roda-se para xz
  const pts = [];
  for (let i = 0; i <= seg; i++) { const a = a0 + ((a1 - a0) * i) / seg; pts.push([Math.sin(a) * r1, Math.cos(a) * r1]); }
  if (r0 < 1e-4) pts.push([0, 0]); // setor cheio: um único vértice no centro (sem triângulos degenerados)
  else for (let i = seg; i >= 0; i--) { const a = a0 + ((a1 - a0) * i) / seg; pts.push([Math.sin(a) * r0, Math.cos(a) * r0]); }
  s.moveTo(pts[0][0], -pts[0][1]); for (let i = 1; i < pts.length; i++) s.lineTo(pts[i][0], -pts[i][1]);
  const g = new THREE.ExtrudeGeometry(s, { depth: Math.max(0.01, h - 2 * bev), bevelEnabled: bev > 0, bevelSize: bev, bevelThickness: bev, bevelSegments: 1, curveSegments: 1 });
  g.rotateX(-Math.PI / 2); g.translate(0, bev, 0);
  return g;
}

// ---------- texturas de canvas ----------
const FONT = '"Helvetica Neue", Helvetica, Arial, "DejaVu Sans", sans-serif';
const tex = (c, aniso = 8) => { const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = aniso; return t; };

// placa escura com texto claro (anos)
export function textTexture(text, { w = 512, h = 256, bg = "#3A2E28", fg = "#F4ECDD", size = 168, weight = 700 } = {}) {
  const c = document.createElement("canvas"); c.width = w; c.height = h;
  const g = c.getContext("2d");
  g.fillStyle = bg; g.fillRect(0, 0, w, h);
  g.strokeStyle = fg; g.globalAlpha = 0.35; g.lineWidth = 6; g.strokeRect(14, 14, w - 28, h - 28); g.globalAlpha = 1;
  g.font = `${weight} ${size}px ${FONT}`;
  const tw = g.measureText(text).width; if (tw > w * 0.8) size = Math.floor(size * (w * 0.8) / tw);
  g.fillStyle = fg; g.font = `${weight} ${size}px ${FONT}`; g.textAlign = "center"; g.textBaseline = "middle";
  g.fillText(text, w / 2, h / 2 + size * 0.04);
  return tex(c);
}
// letras soltas sobre fundo transparente (aplicadas a uma parede)
export function letterTexture(text, { w = 512, h = 128, fg = "#2E2622", size = 104, weight = 800, spacing = 0 } = {}) {
  const c = document.createElement("canvas"); c.width = w; c.height = h;
  const g = c.getContext("2d");
  g.fillStyle = fg; g.font = `${weight} ${size}px ${FONT}`; g.textAlign = "center"; g.textBaseline = "middle";
  if ("letterSpacing" in g) g.letterSpacing = `${spacing}px`;
  g.fillText(text, w / 2, h / 2 + size * 0.04);
  return tex(c);
}
// placa com o nome da instituição em letra simples (sem logótipos): uma ou mais linhas { t: texto, s: tamanho }
export function signTexture(lines, { w = 512, h = 128, bg = "#3F73B0", fg = "#FBF7EE", weight = 800 } = {}) {
  const c = document.createElement("canvas"); c.width = w; c.height = h;
  const g = c.getContext("2d");
  g.fillStyle = bg; g.fillRect(0, 0, w, h);
  g.fillStyle = fg; g.textAlign = "center"; g.textBaseline = "middle";
  const L = (Array.isArray(lines) ? lines : [{ t: lines, s: h * 0.56 }]).map((l) => { g.font = `${weight} ${l.s}px ${FONT}`; const tw = g.measureText(l.t).width; return { t: l.t, s: tw > w * 0.86 ? Math.floor((l.s * w * 0.86) / tw) : l.s }; });
  const tot = L.reduce((a, l) => a + l.s * 1.18, 0); let y = (h - tot) / 2;
  L.forEach((l) => { g.font = `${weight} ${l.s}px ${FONT}`; g.fillText(l.t, w / 2, y + l.s * 0.6); y += l.s * 1.18; });
  return tex(c);
}
// cruz clara (saúde) sobre verde-azulado
export function crossTexture() {
  const c = document.createElement("canvas"); c.width = c.height = 128;
  const g = c.getContext("2d");
  g.fillStyle = "#2C5D66"; g.fillRect(0, 0, 128, 128);
  g.fillStyle = "#F7F0E0"; g.fillRect(50, 20, 28, 88); g.fillRect(20, 50, 88, 28);
  return tex(c);
}
// rosa-dos-ventos pintada no recreio (fundo transparente)
export function compassTexture() {
  const c = document.createElement("canvas"); c.width = c.height = 256;
  const g = c.getContext("2d"), m = 128;
  const cols = ["#4E86B8", "#E8B84B", "#C8543F", "#5B9E6B"];
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * TAU, big = i % 2 === 0, R = big ? 120 : 78, w = big ? 0.3 : 0.24;
    g.fillStyle = cols[(i >> 1) % 4]; g.beginPath(); g.moveTo(m, m);
    g.lineTo(m + Math.sin(a - w) * R * 0.34, m - Math.cos(a - w) * R * 0.34); g.lineTo(m + Math.sin(a) * R, m - Math.cos(a) * R); g.lineTo(m + Math.sin(a + w) * R * 0.34, m - Math.cos(a + w) * R * 0.34);
    g.closePath(); g.fill();
  }
  g.fillStyle = "#F7F0E0"; g.beginPath(); g.arc(m, m, 15, 0, TAU); g.fill();
  return tex(c);
}

// plano com textura (alphaTest) — decalque
export const decal = (t, w, h) => new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshStandardMaterial({ map: t, roughness: 0.85, alphaTest: 0.5 }));

// logótipos (ficheiros em public/world/logos/<nome>.webp: placas já compostas a partir dos logótipos públicos de cada instituição) — carregados à parte, fora do bake
const logoLoader = new THREE.TextureLoader();
export function logoTexture(M, name) {
  const t = logoLoader.load(`${(M && M.assetBase) || "/world"}/logos/${name}.webp`);
  t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
}
// plano sem iluminação (as cores do logótipo têm de ser fiéis), ligeiramente abaixo do branco para assentar na luz cozida da ilha
export function logoDecal(M, name, w, h) {
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: logoTexture(M, name), color: "#EFEBE2" }));
  m.userData.live = true; // fica fora do bake (a textura só carrega depois; no export ainda não existe imagem)
  return m;
}
