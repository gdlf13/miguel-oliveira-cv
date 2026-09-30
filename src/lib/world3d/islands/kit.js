// Peças reutilizáveis para compor as ilhas (árvores, plantas, candeeiros, cadeiras…).
import * as THREE from "three";
import { PAL, radialTexture } from "../materials.js";
import { mesh, rbox, TAU, rng } from "../util.js";

// wrapper que "nasce" do chão no ponto (x,z)
export function popper(g, pops) {
  return (x, z, at = 0, y = 0) => { const w = new THREE.Group(); w.position.set(x, y, z); g.add(w); pops.push({ obj: w, at, base: 1 }); return w; };
}

export function tree(M, { h = 2.6, crown = PAL.sage, crown2 = PAL.sageL, trunk = "#8B6446", seed = 1, r = 1 } = {}) {
  const R = rng(seed), g = new THREE.Group();
  const t = mesh(new THREE.CylinderGeometry(0.11 * r, 0.17 * r, h * 0.6, 12), M.clay(trunk, { rough: 1 })); t.position.y = h * 0.3; g.add(t);
  const n = 3;
  for (let i = 0; i < n; i++) {
    const s = (0.95 - i * 0.2) * r * (0.9 + R() * 0.2);
    const c = mesh(new THREE.SphereGeometry(s, 24, 18), M.clay(i % 2 ? crown2 : crown, { rough: 0.9, bump: 0.5 }));
    c.position.set((R() - 0.5) * 0.25, h * 0.55 + i * 0.62 * r, (R() - 0.5) * 0.25); c.scale.y = 0.92; g.add(c);
  }
  return g;
}

export function pine(M, { h = 3, c1 = PAL.sageD, c2 = PAL.sage, seed = 1 } = {}) {
  const g = new THREE.Group();
  const t = mesh(new THREE.CylinderGeometry(0.09, 0.13, h * 0.3, 8), M.clay("#8B6446", { rough: 1 })); t.position.y = h * 0.15; g.add(t);
  for (let i = 0; i < 3; i++) {
    const s = 0.85 - i * 0.2, c = mesh(new THREE.ConeGeometry(s, h * 0.42, 20), M.clay(i % 2 ? c1 : c2, { rough: 0.9 })); c.position.y = h * (0.34 + i * 0.22); g.add(c);
  }
  return g;
}

export function bush(M, { s = 0.6, color = PAL.sageL } = {}) {
  const g = new THREE.Group();
  [[0, 0.55, 0, 1], [0.5, 0.42, 0.15, 0.7], [-0.45, 0.38, 0.2, 0.62]].forEach(([x, y, z, k]) => { const m = mesh(new THREE.SphereGeometry(s * k, 18, 14), M.clay(color, { rough: 0.9 })); m.position.set(x * s, y * s, z * s); g.add(m); });
  return g;
}

export function plant(M, { h = 1.2, pot = PAL.terraD, leaf = PAL.sage, leaf2 = PAL.sageL, seed = 3, n = 9 } = {}) {
  const R = rng(seed), g = new THREE.Group();
  const p = mesh(new THREE.CylinderGeometry(0.42, 0.3, 0.6, 24), M.clay(pot, { rough: 0.7 })); p.position.y = 0.3; g.add(p);
  const rim = mesh(new THREE.TorusGeometry(0.42, 0.055, 10, 32), M.clay(pot, { rough: 0.7 })); rim.rotation.x = Math.PI / 2; rim.position.y = 0.6; g.add(rim);
  for (let i = 0; i < n; i++) {
    const a = (i / n) * TAU + R(), tilt = 0.25 + R() * 0.6, L = h * (0.7 + R() * 0.5);
    const l = mesh(new THREE.SphereGeometry(1, 14, 10), M.clay(i % 2 ? leaf : leaf2, { rough: 0.8, bump: 0.2 }));
    l.scale.set(0.16, L * 0.5, 0.05); l.position.set(Math.sin(a) * tilt * L * 0.45, 0.6 + Math.cos(tilt) * L * 0.5, Math.cos(a) * tilt * L * 0.45);
    l.rotation.set(Math.cos(a) * tilt, a, -Math.sin(a) * tilt); g.add(l);
  }
  return g;
}

export function armchair(M, color = PAL.ochre, dark = PAL.ochreD) {
  const g = new THREE.Group(), c = M.clay(color, { rough: 0.95, bump: 0.6 }), d = M.clay(dark, { rough: 0.9 });
  const seat = mesh(rbox(1.7, 0.5, 1.55, 0.18), c); seat.position.y = 0.62; g.add(seat);
  const back = mesh(rbox(1.7, 1.35, 0.42, 0.18), c); back.position.set(0, 1.2, -0.62); back.rotation.x = -0.12; g.add(back);
  [-0.92, 0.92].forEach((x) => { const a = mesh(rbox(0.34, 0.95, 1.55, 0.15), c); a.position.set(x, 0.85, 0); g.add(a); });
  const cush = mesh(rbox(1.35, 0.22, 1.2, 0.1), M.clay(PAL.cream, { rough: 1, bump: 0.7 })); cush.position.set(0, 0.97, 0.06); g.add(cush);
  [[-0.7, -0.6], [0.7, -0.6], [-0.7, 0.6], [0.7, 0.6]].forEach(([x, z]) => { const l = mesh(new THREE.CylinderGeometry(0.06, 0.045, 0.42, 10), d); l.position.set(x, 0.21, z); g.add(l); });
  return g;
}

export function floorLamp(M, { h = 3.4, shade = "#FFD9A6", ink = PAL.ink } = {}) {
  const g = new THREE.Group();
  const base = mesh(new THREE.CylinderGeometry(0.42, 0.46, 0.09, 32), M.clay(ink, { rough: 0.5 })); base.position.y = 0.045; g.add(base);
  const pole = mesh(new THREE.CylinderGeometry(0.04, 0.04, h, 10), M.clay(ink, { rough: 0.5 })); pole.position.y = h / 2; g.add(pole);
  const sh = mesh(new THREE.CylinderGeometry(0.42, 0.68, 0.74, 32, 1, true), new THREE.MeshStandardMaterial({ color: shade, emissive: shade, emissiveIntensity: 1.0, side: THREE.DoubleSide, roughness: 0.8 }), { cast: false });
  sh.position.y = h + 0.1; g.add(sh);
  const bulb = mesh(new THREE.SphereGeometry(0.2, 16, 12), M.glow("#FFF1D0", { ei: 2.5 }), { cast: false }); bulb.position.y = h + 0.02; g.add(bulb);
  return g;
}

export function sideTable(M, { color = PAL.cream, h = 1.0, r = 0.55 } = {}) {
  const g = new THREE.Group();
  const top = mesh(new THREE.CylinderGeometry(r, r, 0.09, 40), M.clay(color, { rough: 0.6 })); top.position.y = h; g.add(top);
  const leg = mesh(new THREE.CylinderGeometry(0.07, 0.1, h, 12), M.clay(PAL.ink, { rough: 0.5 })); leg.position.y = h / 2; g.add(leg);
  const foot = mesh(new THREE.CylinderGeometry(r * 0.55, r * 0.6, 0.07, 32), M.clay(PAL.ink, { rough: 0.5 })); foot.position.y = 0.035; g.add(foot);
  return g;
}

export function mug(M, color = PAL.terra) {
  const g = new THREE.Group();
  const b = mesh(new THREE.CylinderGeometry(0.13, 0.11, 0.24, 20), M.glaze(color)); b.position.y = 0.12; g.add(b);
  const h = mesh(new THREE.TorusGeometry(0.07, 0.022, 8, 16, Math.PI), M.glaze(color)); h.rotation.z = -Math.PI / 2; h.position.set(0.14, 0.12, 0); g.add(h);
  return g;
}

export function books(M, colors, { w = 1.1, d = 0.8 } = {}) {
  const g = new THREE.Group(); let y = 0; const R = rng(9);
  colors.forEach((c, i) => { const t = 0.16 + R() * 0.1, b = mesh(rbox(w * (0.9 + R() * 0.15), t, d * (0.9 + R() * 0.1), 0.04), M.clay(c, { rough: 0.7 })); b.position.set((R() - 0.5) * 0.1, y + t / 2, (R() - 0.5) * 0.1); b.rotation.y = (R() - 0.5) * 0.3; g.add(b); y += t; });
  return g;
}

export function pebble(M, s = 0.25, color = PAL.sand2) { const m = mesh(new THREE.SphereGeometry(s, 14, 10), M.clay(color, { rough: 1 })); m.scale.y = 0.6; return m; }

// disco de "sombra de contacto" para assentar objectos no chão
const shadowTex = radialTexture([[0, "rgba(60,35,20,0.42)"], [0.55, "rgba(60,35,20,0.18)"], [1, "rgba(60,35,20,0)"]]);
export function contact(r = 1, opacity = 1) {
  const m = new THREE.Mesh(new THREE.PlaneGeometry(r * 2, r * 2), new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false, opacity, fog: false }));
  m.rotation.x = -Math.PI / 2; m.position.y = 0.012; m.renderOrder = 1; return m;
}

// cipreste: silhueta esbelta em cones/elipsoide (sóbrio, ao estilo mediterrânico)
export function cypress(M, { h = 3.6, r = 0.55, color = "#6F8467", color2 = "#829677", seed = 1 } = {}) {
  const R = rng(seed), g = new THREE.Group();
  const t = mesh(new THREE.CylinderGeometry(0.07, 0.1, h * 0.18, 8), M.clay("#7B5B43", { rough: 1 }), { cast: false }); t.position.y = h * 0.09; g.add(t);
  const body = mesh(new THREE.SphereGeometry(1, 20, 16), M.clay(color, { rough: 0.95, bump: 0.5 })); body.scale.set(r, h * 0.42, r); body.position.y = h * 0.18 + h * 0.4; g.add(body);
  const top = mesh(new THREE.SphereGeometry(1, 16, 12), M.clay(color2, { rough: 0.95, bump: 0.5 })); top.scale.set(r * 0.62, h * 0.24, r * 0.62); top.position.set((R() - 0.5) * 0.06, h * 0.18 + h * 0.66, 0); g.add(top);
  return g;
}
