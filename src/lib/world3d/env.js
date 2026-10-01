// Céu, nuvens, poeira dourada e ilhas distantes (profundidade atmosférica).
import * as THREE from "three";
import { radialTexture } from "./materials.js";
import { rng, TAU, lerp } from "./util.js";
import { ISLANDS } from "./layout.js";
import { makeIsland } from "./island.js";

export const SKY = { top: "#EAD8C4", mid: "#E9C4A2", low: "#DA9F7C", fog: "#E6C7A9" };

export function skyTexture() {
  const c = document.createElement("canvas"); c.width = 4; c.height = 512;
  const g = c.getContext("2d"), gr = g.createLinearGradient(0, 0, 0, 512);
  gr.addColorStop(0, SKY.top); gr.addColorStop(0.55, SKY.mid); gr.addColorStop(1, SKY.low);
  g.fillStyle = gr; g.fillRect(0, 0, 4, 512);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

// névoa em camadas: manchas suaves e planas (sem arestas), por baixo e ao longe do arquipélago
export function makeClouds(seed = 7) {
  const r = rng(seed), group = new THREE.Group();
  const tex = radialTexture([[0, "rgba(255,238,218,0.62)"], [0.45, "rgba(255,232,208,0.30)"], [1, "rgba(255,230,206,0)"]], 256);
  const geo = new THREE.PlaneGeometry(1, 1); geo.rotateX(-Math.PI / 2);
  const pts = ISLANDS.map((i) => i.pos);
  const mats = [0.55, 0.8, 1].map((o) => new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, fog: false, opacity: o }));
  for (let b = 0; b < 44; b++) {
    const seg = r() * (pts.length - 1), i0 = Math.floor(seg), t = seg - i0, a = pts[i0], c = pts[Math.min(pts.length - 1, i0 + 1)];
    const m = new THREE.Mesh(geo, mats[b % 3]);
    const S = 26 + r() * 46;
    m.scale.set(S, 1, S * (0.5 + r() * 0.4));
    m.position.set(lerp(a.x, c.x, t) + (r() - 0.5) * 110, lerp(a.y, c.y, t) - 15 - r() * 22, lerp(a.z, c.z, t) + (r() - 0.5) * 80);
    m.rotation.y = r() * Math.PI; m.renderOrder = -2;
    group.add(m);
  }
  return { group, update: (t) => { group.position.x = Math.sin(t * 0.03) * 3; group.position.z = Math.cos(t * 0.025) * 2; } };
}

// poeira/pólen: pontos suaves espalhados ao longo do caminho
export function makeDust(seed = 11, count = 520) {
  const r = rng(seed), pos = new Float32Array(count * 3), pts = ISLANDS.map((i) => i.pos);
  for (let i = 0; i < count; i++) {
    const seg = r() * (pts.length - 1), i0 = Math.floor(seg), t = seg - i0, a = pts[i0], c = pts[Math.min(pts.length - 1, i0 + 1)];
    pos[i * 3] = lerp(a.x, c.x, t) + (r() - 0.5) * 46; pos[i * 3 + 1] = lerp(a.y, c.y, t) + (r() - 0.35) * 26; pos[i * 3 + 2] = lerp(a.z, c.z, t) + (r() - 0.5) * 40;
  }
  const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  const m = new THREE.PointsMaterial({ size: 0.16, map: radialTexture([[0, "rgba(255,246,228,0.95)"], [0.4, "rgba(255,236,206,0.5)"], [1, "rgba(255,230,200,0)"]]), transparent: true, depthWrite: false, sizeAttenuation: true, opacity: 0.6 });
  const pts3 = new THREE.Points(g, m); pts3.frustumCulled = false;
  return { obj: pts3, update: (t) => { pts3.position.y = Math.sin(t * 0.2) * 0.4; pts3.rotation.y = Math.sin(t * 0.05) * 0.03; } };
}

// ilhas distantes em silhueta, para dar escala e profundidade
export function makeFarIslands(M, seed = 21) {
  const r = rng(seed), group = new THREE.Group();
  const mats = { rock: ["#C9A489", "#A98069"] };
  for (let i = 0; i < 9; i++) {
    const side = i % 2 ? 1 : -1, k = r() * (ISLANDS.length - 1), i0 = Math.floor(k), t = k - i0, a = ISLANDS[i0].pos, c = ISLANDS[Math.min(ISLANDS.length - 1, i0 + 1)].pos;
    const base = a.clone().lerp(c, t), R = 2.2 + r() * 3.6;
    const isl = makeIsland(M, { R, top: i % 3 ? "#C6CFB4" : "#E9CFA9", soil: "#C9A27F", rock: mats.rock, seed: 100 + i, depth: 2.5 + r() * 3 });
    isl.group.position.set(base.x + side * (34 + r() * 30), base.y + (r() - 0.4) * 22 - 4, base.z - 20 - r() * 45);
    isl.group.traverse((o) => { o.castShadow = false; o.receiveShadow = false; });
    group.add(isl.group);
  }
  return { group };
}
