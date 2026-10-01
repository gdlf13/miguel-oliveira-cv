// Ilha 2 — Pensamento: um neurónio-árvore (Cajal) sobre um prado, com uma rede de ideias suspensa.
import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { PAL } from "../materials.js";
import { makeIsland } from "../island.js";
import { mesh, rbox, TAU, rng, taperedTube } from "../util.js";
import { popper, cypress, bush, pebble, contact } from "./kit.js";

export function buildPensamento(M) {
  const g = new THREE.Group(), pops = [], P = popper(g, pops), R = rng(21);
  const isl = makeIsland(M, { R: 7.0, top: "#BCCBAA", soil: "#B99A74", rock: ["#A79A82", "#7B6E5E"], seed: 23, depth: 8.0, wob: 0.07 });
  g.add(isl.group);

  // relvado: manchas de erva mais escura
  [[-2.5, 1.8, 2.2], [2.8, 2.6, 1.7], [-3.6, -2.0, 1.5]].forEach(([x, z, r]) => { const d = mesh(new THREE.CylinderGeometry(r, r, 0.03, 40), M.clay("#A9BC98", { rough: 1 }), { cast: false }); d.position.set(x, 0.02, z); g.add(d); });

  // ---- neurónio ----
  const neuron = P(-0.4, -0.3, 0.05);
  const SOMA = new THREE.Vector3(0, 2.7, 0);
  const geos = [], tipPts = [];
  const base = "#2F3B2C", tipC = "#6F8567";
  function branch(start, dir, len, r0, depth, seed) {
    const Rn = rng(seed), bend = new THREE.Vector3((Rn() - 0.5), (Rn() - 0.2) * 0.6, (Rn() - 0.5)).multiplyScalar(len * 0.45);
    const mid = start.clone().addScaledVector(dir, len * 0.5).add(bend), end = start.clone().addScaledVector(dir, len).addScaledVector(bend, 0.6);
    end.y += len * 0.12;
    const curve = new THREE.CatmullRomCurve3([start, mid, end], false, "catmullrom", 0.5);
    const r1 = Math.max(0.045, r0 * 0.5);
    geos.push(taperedTube(curve, r0, r1, { seg: 14, radial: 7, c0: depth > 2 ? base : depth > 1 ? "#3A4A36" : "#4B5F45", c1: depth > 2 ? "#3A4A36" : depth > 1 ? "#4B5F45" : tipC }));
    if (depth > 0) {
      const n = depth > 1 ? 2 : (Rn() > 0.4 ? 3 : 2), t = curve.getTangent(1);
      for (let i = 0; i < n; i++) {
        const d = t.clone().add(new THREE.Vector3((Rn() - 0.5) * 1.5, (Rn() - 0.25) * 0.9 + 0.1, (Rn() - 0.5) * 1.5)).normalize();
        branch(end, d, len * (0.66 + Rn() * 0.1), r1, depth - 1, seed * 7 + i * 13 + depth);
      }
    } else tipPts.push(end);
  }
  const prim = [[-0.9, 0.3, 0.5], [0.8, 0.5, 0.3], [0.0, 0.9, -0.4], [-0.35, 0.55, 0.9], [0.55, 0.45, -0.7], [-1.0, 0.35, -0.5], [0.15, 0.35, 1.0]];
  prim.forEach((v, i) => { const d = new THREE.Vector3(...v).normalize(), s0 = SOMA.clone().addScaledVector(d, 1.15); branch(s0, d, 2.5 + (i % 3) * 0.35, 0.33, 3, 31 + i * 5); });
  const branchGeo = mergeGeometries(geos);
  neuron.add(mesh(branchGeo, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.78, envMapIntensity: 0.5 })));
  // botões sinápticos
  const boutonGeo = new THREE.SphereGeometry(0.115, 12, 9);
  const bouton = new THREE.InstancedMesh(boutonGeo, M.glow("#FFF3D9", { ei: 0.9 }), tipPts.length), m4 = new THREE.Matrix4();
  tipPts.forEach((p, i) => { m4.makeTranslation(p.x, p.y, p.z); bouton.setMatrixAt(i, m4); });
  bouton.castShadow = true; neuron.add(bouton);
  // uma sinapse "activa" a vermelhão
  const active = tipPts[Math.floor(tipPts.length * 0.62)];
  const act = mesh(new THREE.SphereGeometry(0.2, 20, 14), M.glow("#FF4A28", { ei: 2.0 }), { cast: false }); act.position.copy(active); neuron.add(act);

  // soma
  const soma = mesh(new THREE.SphereGeometry(1.35, 48, 36), M.clay("#7E9273", { rough: 0.7, bump: 0.3 })); soma.position.copy(SOMA); neuron.add(soma);
  const nuc = mesh(new THREE.SphereGeometry(0.62, 32, 24), M.clay("#F0E3C8", { rough: 0.5, noBump: true })); nuc.position.set(0.55, 3.0, 0.7); neuron.add(nuc);
  const nucleolus = mesh(new THREE.SphereGeometry(0.2, 20, 16), M.glow("#FF7A4D", { ei: 1.2 }), { cast: false }); nucleolus.position.set(0.72, 3.1, 1.16); neuron.add(nucleolus);
  const mound = mesh(new THREE.CylinderGeometry(1.4, 2.0, 0.9, 40), M.clay(PAL.sand2, { rough: 0.9 })); mound.position.y = 0.45; neuron.add(mound);
  const neck = mesh(new THREE.CylinderGeometry(0.55, 0.85, 1.2, 28), M.clay("#7E9273", { rough: 0.75 })); neck.position.y = 1.35; neuron.add(neck);

  // axónio com bainhas de mielina até à orla direita
  const axon = new THREE.CatmullRomCurve3([new THREE.Vector3(0.4, 1.9, 0.6), new THREE.Vector3(1.8, 0.9, 1.6), new THREE.Vector3(3.5, 0.45, 2.0), new THREE.Vector3(5.2, 0.5, 1.3), new THREE.Vector3(6.6, 1.0, 0.2)], false, "catmullrom", 0.5);
  neuron.add(mesh(taperedTube(axon, 0.14, 0.11, { seg: 60, radial: 10, c0: "#8FA283", c1: "#8FA283" }), new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.75 })));
  for (let i = 0; i < 7; i++) {
    const u = 0.18 + i * 0.115, p = axon.getPointAt(u), t = axon.getTangentAt(u);
    const sh = mesh(new THREE.CapsuleGeometry(0.32, 0.42, 8, 16), M.clay(PAL.cream, { rough: 0.55, noBump: true })); sh.position.copy(p);
    sh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), t); neuron.add(sh);
  }
  const term = mesh(new THREE.SphereGeometry(0.3, 20, 14), M.clay("#8FA283", { rough: 0.7 })); term.position.set(6.7, 1.05, 0.2); neuron.add(term);

  // ---- rede de ideias suspensa ----
  const net = new THREE.Group(); g.add(net);
  const nodes = []; const N = 15;
  for (let i = 0; i < N; i++) {
    const a = (i / N) * TAU + R(), rr = 6.2 + R() * 3.6, y = 3.5 + R() * 7.0;
    nodes.push(new THREE.Vector3(Math.cos(a) * rr - 0.4, y, Math.sin(a) * rr * 0.75 - 1.5));
  }
  const nodeM = [M.clay(PAL.paper, { rough: 0.5, noBump: true }), M.clay(PAL.ochreL, { rough: 0.5, noBump: true }), M.clay(PAL.sageL, { rough: 0.5, noBump: true })];
  nodes.forEach((p, i) => { const s = mesh(new THREE.SphereGeometry(0.18 + R() * 0.2, 20, 14), nodeM[i % 3]); s.position.copy(p); s.userData = { y0: p.y, ph: R() * TAU }; net.add(s); });
  const lineGeos = [];
  nodes.forEach((a, i) => { const near = nodes.map((b, j) => [j, a.distanceTo(b)]).filter(([j, d]) => j > i && d < 6.5).sort((x, y) => x[1] - y[1]).slice(0, 2);
    near.forEach(([j]) => { const b = nodes[j], c = new THREE.LineCurve3(a, b); lineGeos.push(new THREE.TubeGeometry(c, 1, 0.022, 5, false)); }); });
  if (lineGeos.length) net.add(mesh(mergeGeometries(lineGeos), M.clay("#E6D3B3", { rough: 0.6, noBump: true }), { cast: false }));

  // vegetação
  const t1 = P(-5.6, 1.0, 0.5); t1.add(cypress(M, { h: 3.8, r: 0.55, seed: 5 }));
  const t2 = P(5.2, -3.6, 0.6); t2.add(cypress(M, { h: 3.2, r: 0.5, seed: 6 }));
  const b1 = P(-2.6, 4.2, 0.65); b1.add(bush(M, { s: 0.9, color: "#9DB093" }));
  const b2 = P(3.6, 4.0, 0.7); b2.add(bush(M, { s: 0.75, color: "#B3C4A2" }));
  for (let i = 0; i < 7; i++) { const a = 2.2 + i * 0.26; const p = P(Math.cos(a) * 5.5 - 0.4, Math.sin(a) * 5.2 + 0.5, 0.75); p.add(pebble(M, 0.2 + R() * 0.15, "#DCCDB2")); }
  const cs = contact(2.6, 0.9); cs.position.set(-0.4, 0.012, -0.3); g.add(cs);

  const update = (t, u) => {
    isl.update(t);
    nucleolus.scale.setScalar(1 + Math.sin(t * 2.4) * 0.12); act.scale.setScalar(1 + Math.sin(t * 3.1) * 0.25);
    net.children.forEach((c) => { if (c.userData.y0 != null) c.position.y = c.userData.y0 + Math.sin(t * 0.6 + c.userData.ph) * 0.22; });
  };
  // só as partes grossas (soma, núcleo, monte, pescoço) respondem: os dendritos são finos demais para acertar com o cursor
  const hot = [{ id: "pensamento.neuron", obj: [soma, nuc, mound, neck], ring: mound }];
  return { group: g, update, pops, thread: [[act.position.x - 0.4, act.position.y, act.position.z - 0.3]], hot };
}
