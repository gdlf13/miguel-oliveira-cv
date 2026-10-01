// Ilha 1 — Início: Psicologia + IA. Um perfil humano em barro com uma rede de nós acesa dentro do crânio,
// sobre um palco de degraus semicirculares (aula / conversa). Um único ponto vivo a vermelhão.
import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { PAL } from "../materials.js";
import { makeIsland } from "../island.js";
import { mesh, rbox, TAU, rng } from "../util.js";
import { popper, cypress, bush, pebble, contact } from "./kit.js";

// coroa circular (parcial) extrudida para cima: y de 0 a h
function ringSector(rIn, rOut, a0, a1, h, seg = 48) {
  const s = new THREE.Shape();
  s.absarc(0, 0, rOut, a0, a1, false);
  s.absarc(0, 0, rIn, a1, a0, true);
  const g = new THREE.ExtrudeGeometry(s, { depth: h, bevelEnabled: true, bevelSize: 0.05, bevelThickness: 0.05, bevelSegments: 2, curveSegments: seg });
  g.rotateX(-Math.PI / 2); // y do shape -> -z do mundo, extrusão -> +y
  return g;
}

export function buildInicio(M) {
  const g = new THREE.Group(), pops = [], P = popper(g, pops), R = rng(5);
  const isl = makeIsland(M, { R: 7.2, top: "#D2B08A", soil: PAL.soil, rock: ["#C09777", "#8C6650"], seed: 11, depth: 8.2 });
  g.add(isl.group);

  const HX = 1.3, HZ = 0.3; // centro do palco

  // ---- palco: degraus semicirculares ao fundo (anfiteatro) ----
  const amph = P(HX, HZ, 0.1);
  {
    const cols = [PAL.cream, PAL.sand2, PAL.cream];
    for (let k = 0; k < 3; k++) {
      const rIn = 3.55 + k * 0.82, h = 0.34 * (k + 1);
      const m = mesh(ringSector(rIn, rIn + 0.8, -0.16, Math.PI + 0.16, h), M.clay(cols[k], { rough: 0.9, bump: 0.25 }));
      amph.add(m);
      // filete de terracota a marcar o degrau superior
      const band = mesh(ringSector(rIn + 0.72, rIn + 0.8, -0.16, Math.PI + 0.16, h + 0.04), M.clay(PAL.terra, { rough: 0.85, bump: 0.2 }), { cast: false });
      amph.add(band);
    }
  }
  // disco do palco
  const stage = P(HX, HZ, 0.0);
  {
    const d0 = mesh(new THREE.CylinderGeometry(3.15, 3.25, 0.26, 72), M.clay(PAL.sand2, { rough: 0.9, bump: 0.3 })); d0.position.y = 0.13; stage.add(d0);
    const d1 = mesh(new THREE.CylinderGeometry(2.55, 2.65, 0.26, 64), M.clay(PAL.cream, { rough: 0.85, bump: 0.25 })); d1.position.y = 0.39; stage.add(d1);
  }

  // ---- escultura: perfil humano com a rede no crânio ----
  const bust = P(HX, HZ, 0.05);
  const BS = 1.35, ST = 0.52 / BS, headScale = 0.92, headY = ST + 0.95 + 0.14 + 2.35 - 0.02;
  pops.find((q) => q.obj === bust).base = BS;
  let core, nodePos;
  const netGroup = new THREE.Group();
  {
    const ped = mesh(new THREE.CylinderGeometry(1.25, 1.4, 0.95, 56), M.clay(PAL.cream, { rough: 0.7 })); ped.position.y = ST + 0.475; bust.add(ped);
    const cap = mesh(new THREE.CylinderGeometry(1.45, 1.45, 0.14, 56), M.clay(PAL.sand2, { rough: 0.7 })); cap.position.y = ST + 0.95 + 0.07; bust.add(cap);

    const pts = [[-0.75, -2.55], [-0.82, -1.7], [-1.22, -0.7], [-1.38, 0.35], [-1.0, 1.4], [-0.15, 1.95], [0.7, 1.62], [1.08, 0.85], [1.17, 0.36], [1.13, 0.02], [1.68, -0.47], [1.2, -0.63], [1.27, -0.84], [1.19, -0.99], [1.24, -1.13], [1.02, -1.46], [0.6, -1.62], [0.36, -1.9], [0.32, -2.55]];
    const crv = new THREE.CatmullRomCurve3(pts.map(([x, y]) => new THREE.Vector3(x, y, 0)), true, "centripetal");
    const sp = crv.getSpacedPoints(180), sh = new THREE.Shape(sp.map((v) => new THREE.Vector2(v.x, v.y)));
    // janela em forma de cérebro no crânio, por onde se vê o interior
    const BEAN = [[-0.98, 0.3], [-1.02, 0.85], [-0.66, 1.42], [-0.06, 1.62], [0.54, 1.42], [0.86, 0.95], [0.8, 0.38], [0.36, 0.06], [-0.4, 0.02]];
    const beanCurve = new THREE.CatmullRomCurve3(BEAN.map(([x, y]) => new THREE.Vector3(x, y, 0)), true, "centripetal");
    const beanPts = beanCurve.getSpacedPoints(90).map((v) => new THREE.Vector2(v.x, v.y));
    sh.holes.push(new THREE.Path(beanPts));
    const geo = new THREE.ExtrudeGeometry(sh, { depth: 1.15, bevelEnabled: true, bevelSize: 0.13, bevelThickness: 0.16, bevelSegments: 6, curveSegments: 4 });
    geo.translate(0, 0, -0.575);
    const head = new THREE.Group(); head.position.y = headY; head.scale.setScalar(headScale); bust.add(head);
    const headMesh = mesh(geo, M.clay("#EFDCC3", { rough: 0.6, bump: 0.16 }));
    // dados para o modelo "herói" em Blender (ver .harness/hero.py): contorno do perfil + janela
    headMesh.userData.hero = { kind: "head", outline: sp.map((v) => [+v.x.toFixed(4), +v.y.toFixed(4)]), bean: beanPts.map((v) => [+v.x.toFixed(4), +v.y.toFixed(4)]), color: "#EFDCC3", depth: 1.15 };
    head.add(headMesh);

    // interior: painel escuro recuado + rede neuronal em camadas (a "IA" dentro da cabeça)
    const panelShape = new THREE.Shape(beanPts.map((v) => new THREE.Vector2(v.x * 0.985, (v.y - 0.8) * 0.985 + 0.8)));
    const panel = mesh(new THREE.ExtrudeGeometry(panelShape, { depth: 0.08, bevelEnabled: false }), new THREE.MeshStandardMaterial({ color: "#3A2C28", roughness: 0.95, emissive: "#5A3A2C", emissiveIntensity: 0.25 }), { cast: false });
    panel.position.z = 0.2; head.add(panel);
    const LAYERS = [[-0.72, [0.4, 0.82, 1.22]], [-0.28, [0.3, 0.66, 1.02, 1.38]], [0.16, [0.28, 0.62, 0.96, 1.3]], [0.6, [0.5, 0.86, 1.2]]];
    nodePos = [];
    const layerIdx = LAYERS.map(([x, ys]) => ys.map((y) => nodePos.push(new THREE.Vector3(x, y, 0.44)) - 1));
    const nodeGeo = new THREE.SphereGeometry(1, 14, 10), nodeMat = M.glow("#FFEBC8", { ei: 1.05 }), nodeMat2 = M.glow("#F2B45A", { ei: 1.1 });
    nodePos.forEach((p, i) => { const s = mesh(nodeGeo, i % 3 === 0 ? nodeMat2 : nodeMat, { cast: false }); s.scale.setScalar(0.07); s.position.copy(p); netGroup.add(s); });
    const lines = [];
    for (let l = 0; l < layerIdx.length - 1; l++) layerIdx[l].forEach((i) => layerIdx[l + 1].forEach((j) => lines.push(new THREE.TubeGeometry(new THREE.LineCurve3(nodePos[i], nodePos[j]), 1, 0.012, 4, false))));
    netGroup.add(mesh(mergeGeometries(lines), new THREE.MeshBasicMaterial({ color: "#EBD3A6", transparent: true, opacity: 0.8, fog: false }), { cast: false }));
    // o ponto vivo (vermelhão) — nó central da rede
    core = mesh(new THREE.SphereGeometry(0.12, 24, 16), M.glow("#FF4A28", { ei: 2.2 }), { cast: false }); core.position.copy(nodePos[layerIdx[2][2]]); core.position.z = 0.5; netGroup.add(core);
    head.add(netGroup);
    bust.userData.head = head;
  }
  const corePos = [HX + 0.16 * headScale * BS, (headY + 0.96 * headScale) * BS, HZ + 0.5 * headScale * BS];

  const cs = contact(2.6, 0.9); cs.position.set(HX, 0.012, HZ); g.add(cs);

  // ---- vegetação e detalhes: mínimo ----
  const c1 = P(-5.0, -3.4, 0.6); c1.add(cypress(M, { h: 4.4, r: 0.62, seed: 2 }));
  const c2 = P(6.0, -3.2, 0.65); c2.add(cypress(M, { h: 3.6, r: 0.52, seed: 4 }));
  const c3 = P(-5.7, 1.2, 0.7); c3.add(cypress(M, { h: 2.9, r: 0.46, seed: 6 }));
  const b1 = P(-2.6, 4.7, 0.75); b1.add(bush(M, { s: 0.7, color: PAL.sage }));
  const b2 = P(4.8, 4.0, 0.8); b2.add(bush(M, { s: 0.55, color: PAL.sageL }));
  for (let i = 0; i < 6; i++) { const a = 0.5 + i * 0.3; const p = P(Math.cos(a) * 5.6 + 0.2, Math.sin(a) * 4.4 + 2.6, 0.9); p.add(pebble(M, 0.16 + R() * 0.1, "#D4C1A0")); }

  const update = (t) => {
    isl.update(t);
    const head = bust.userData.head; if (head) head.rotation.y = Math.sin(t * 0.35) * 0.05;
    core.scale.setScalar(1 + Math.sin(t * 2.6) * 0.16);
  };
  const hot = [{ id: "inicio.bust", obj: bust, ring: stage }];
  return { group: g, update, pops, thread: [corePos], focus: [1.4, 3.0, 0], hot };
}
