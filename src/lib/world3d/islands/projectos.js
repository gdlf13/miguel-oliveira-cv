// Ilha 4 — Projectos: "o campus dos projectos". Uma maquete de praça com pavilhões, um por projecto:
// templo (Tutor de Filosofia), lente sobre folha (AI Fact Checker), praça com agentes em rede (OASIS),
// portão com escudo (Internet Segura), ondas de voz (Verbi), peças de letras (JogaLetras).
import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { PAL } from "../materials.js";
import { makeIsland } from "../island.js";
import { mesh, rbox, TAU, rng } from "../util.js";
import { popper, cypress, bush } from "./kit.js";

const V3 = THREE.Vector3;

// ---------- helpers locais ----------
// devolve uma cópia não-indexada, transformada (para poder fundir com outras)
function place(geo, { p = [0, 0, 0], r = [0, 0, 0], s = [1, 1, 1] } = {}) {
  const g = geo.index ? geo.toNonIndexed() : geo.clone();
  g.applyMatrix4(new THREE.Matrix4().compose(new V3(...p), new THREE.Quaternion().setFromEuler(new THREE.Euler(...r)), new V3(...s)));
  return g;
}
const merge = (list) => mergeGeometries(list.map((g) => (g.index ? g.toNonIndexed() : g)));

// extrusão centrada em z (espessura total = depth + 2*bevel)
function extrude(shape, depth, bevel = 0.05) {
  const g = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: bevel > 0, bevelSize: bevel, bevelThickness: bevel, bevelSegments: 2, curveSegments: 28 });
  g.translate(0, 0, -depth / 2);
  return g;
}

function archShape(hw, straight, holeHw = 0, holeStraight = 0) {
  const s = new THREE.Shape();
  s.moveTo(-hw, 0); s.lineTo(-hw, straight); s.absarc(0, straight, hw, Math.PI, 0, true); s.lineTo(hw, 0); s.lineTo(-hw, 0);
  if (holeHw) {
    const h = new THREE.Path();
    h.moveTo(-holeHw, 0); h.lineTo(-holeHw, holeStraight); h.absarc(0, holeStraight, holeHw, Math.PI, 0, true); h.lineTo(holeHw, 0); h.lineTo(-holeHw, 0);
    s.holes.push(h);
  }
  return s;
}

function shieldShape(w = 0.68, top = 0.82, bot = 0.98) {
  const s = new THREE.Shape();
  s.moveTo(0, top + 0.08);
  s.bezierCurveTo(w * 0.35, top, w * 0.7, top - 0.02, w, top - 0.02);
  s.lineTo(w, 0.05);
  s.bezierCurveTo(w, -bot * 0.5, w * 0.45, -bot * 0.8, 0, -bot);
  s.bezierCurveTo(-w * 0.45, -bot * 0.8, -w, -bot * 0.5, -w, 0.05);
  s.lineTo(-w, top - 0.02);
  s.bezierCurveTo(-w * 0.7, top - 0.02, -w * 0.35, top, 0, top + 0.08);
  return s;
}

// disco/plataforma redonda com aresta arredondada (Lathe: de baixo para cima, depois para o centro)
function pad(r, h, bevel = 0.05) {
  const pts = [new THREE.Vector2(r, 0)];
  for (let i = 0; i <= 5; i++) { const a = (i / 5) * Math.PI / 2; pts.push(new THREE.Vector2(r - bevel + Math.cos(a) * bevel, h - bevel + Math.sin(a) * bevel)); }
  pts.push(new THREE.Vector2(0.001, h));
  return new THREE.LatheGeometry(pts, 96);
}

// pilha de meshes fundidos por cor: [{geo, mat}] -> Group
function mergedByMat(items) {
  const byMat = new Map();
  items.forEach(({ geo, mat }) => { if (!byMat.has(mat)) byMat.set(mat, []); byMat.get(mat).push(geo); });
  const grp = new THREE.Group();
  byMat.forEach((geos, mat) => grp.add(mesh(merge(geos), mat)));
  return grp;
}

// peça de jogo com letra (CanvasTexture)
function letterTex(letter, bg, fg = "#FFFCF6") {
  const c = document.createElement("canvas"); c.width = c.height = 128;
  const x = c.getContext("2d");
  x.fillStyle = bg; x.fillRect(0, 0, 128, 128);
  x.strokeStyle = "rgba(255,255,255,0.32)"; x.lineWidth = 3; x.strokeRect(9, 9, 110, 110);
  x.fillStyle = fg; x.font = "700 82px 'Helvetica Neue', Helvetica, Arial, sans-serif"; x.textAlign = "center"; x.textBaseline = "middle";
  x.fillText(letter, 64, 70);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
  return t;
}

export function buildProjectos(M) {
  const g = new THREE.Group(), pops = [], P = popper(g, pops), R = rng(41);
  const isl = makeIsland(M, { R: 7.3, top: "#CDB08C", soil: "#B98F6B", rock: ["#BB9A7D", "#87664F"], seed: 37, depth: 8.4, wob: 0.06 });
  g.add(isl.group);

  const PC = [0, 1.0]; // centro da praça (x,z)
  const PLAZA_Y = 0.3, PR = 3.0; // altura e raio do tampo da praça


  // ============ caminhos (faixas claras) ============
  {
    const strip = (x0, z0, x1, z1, w) => {
      const dx = x1 - x0, dz = z1 - z0, L = Math.hypot(dx, dz);
      return place(rbox(w, 0.05, L, 0.02, 1), { p: [(x0 + x1) / 2, 0.025, (z0 + z1) / 2], r: [0, Math.atan2(dx, dz), 0] });
    };
    const geos = [
      strip(0.2, PC[1] - PR - 0.1, 0.2, -4.6, 1.05), // -> portão
      strip(-PR + 0.1, 1.0, -4.0, 1.05, 0.95),       // -> templo
      strip(PR - 0.1, 0.95, 4.15, 0.4, 0.95),        // -> lente
      strip(1.95, 3.1, 3.05, 4.25, 0.95),            // -> ondas de voz
      strip(-2.0, 3.0, -3.3, 3.55, 0.8),             // -> peças de letras
      strip(0.0, PC[1] + PR - 0.1, 0.0, 6.7, 1.2),   // entrada, à frente
    ];
    const paths = mesh(merge(geos), M.clay("#F1E6CE", { rough: 0.95, bump: 0.25 }), { cast: false });
    g.add(paths);
  }

  // ============ OASIS — praça com agentes em rede (herói) ============
  const plaza = P(PC[0], PC[1], 0.0);
  const hubY = 0.62, HS = 2.4; // topo do pedestal e escala da figura viva
    {
    const step = mesh(pad(PR + 0.22, 0.14, 0.05), M.clay("#E6D6B8", { rough: 0.9, bump: 0.3 })); plaza.add(step);
    const top = mesh(pad(PR, PLAZA_Y, 0.06), M.clay("#F6EFDF", { rough: 0.85, bump: 0.3 })); plaza.add(top);
    const ring = (r0, r1, c) => { const m = mesh(new THREE.RingGeometry(r0, r1, 96), M.clay(c, { rough: 0.9, noBump: true }), { cast: false }); m.rotation.x = -Math.PI / 2; m.position.y = PLAZA_Y + 0.003; return m; };
    plaza.add(ring(PR - 0.32, PR - 0.24, "#C98F74"), ring(1.4, 1.45, "#D9C7A4"));
    // pedestal da figura viva
    const ped = mesh(pad(0.62, hubY - PLAZA_Y, 0.05), M.clay("#F7F0E1", { rough: 0.7, noBump: true })); ped.position.y = PLAZA_Y; plaza.add(ped);
    const pedRing = mesh(new THREE.TorusGeometry(0.6, 0.03, 8, 48), M.clay("#D9A184", { rough: 0.8, noBump: true }), { cast: false }); pedRing.rotation.x = Math.PI / 2; pedRing.position.y = PLAZA_Y + 0.06; plaza.add(pedRing);
  }

  // figurinhas (cápsula + cabeça esférica), instanciadas
  const tones = ["#8FA283", "#6E9EA2", "#A8809A", "#D6B877", "#8FA283", "#6E9EA2", "#A8809A", "#C9A48A", "#B3A898"];
  const figs = [];
  [[6, 1.05, 0.3], [9, 1.78, 0.0], [12, 2.5, 0.32]].forEach(([n, r, a0]) => {
    for (let i = 0; i < n; i++) {
      const a = a0 + (i / n) * TAU + (R() - 0.5) * 0.3, rr = r + (R() - 0.5) * 0.16;
      figs.push({ x: Math.cos(a) * rr, z: Math.sin(a) * rr, s: 1.05 + R() * 0.22, ph: R() * TAU, col: tones[Math.floor(R() * tones.length)] });
    }
  });
  const NF = figs.length;
  const bodyGeo = new THREE.CapsuleGeometry(0.19, 0.44, 4, 12); bodyGeo.translate(0, 0.41, 0); // base em y=0, altura 0.82
  const headGeo = new THREE.SphereGeometry(0.16, 14, 10);
  const hubBodyGeo = new THREE.CapsuleGeometry(0.19, 0.44, 8, 24); hubBodyGeo.translate(0, 0.41, 0); // versão fina, só para a figura viva
  const hubHeadGeo = new THREE.SphereGeometry(0.16, 30, 22);
  const figMat = M.clay("#FFFFFF", { rough: 0.62, noBump: true });
  const bodies = new THREE.InstancedMesh(bodyGeo, figMat, NF), heads = new THREE.InstancedMesh(headGeo, figMat, NF);
  bodies.frustumCulled = heads.frustumCulled = false;
  bodies.castShadow = heads.castShadow = true; bodies.receiveShadow = heads.receiveShadow = true;
  const _m = new THREE.Matrix4(), _q = new THREE.Quaternion(), _p = new V3(), _s = new V3(), _c = new THREE.Color();
  figs.forEach((f, i) => {
    bodies.setColorAt(i, _c.set(f.col));
    heads.setColorAt(i, _c.set(f.col).lerp(new THREE.Color("#FBF6EC"), 0.42));
  });
  bodies.instanceColor.needsUpdate = heads.instanceColor.needsUpdate = true;
  const setFigs = (t) => {
    for (let i = 0; i < NF; i++) {
      const f = figs[i], b = 1 + 0.028 * Math.sin(t * 1.15 + f.ph);
      _m.compose(_p.set(f.x, PLAZA_Y, f.z), _q.identity(), _s.set(f.s, f.s * b, f.s)); bodies.setMatrixAt(i, _m);
      _m.compose(_p.set(f.x, PLAZA_Y + 0.9 * f.s * b, f.z), _q.identity(), _s.set(f.s, f.s, f.s)); heads.setMatrixAt(i, _m);
    }
    bodies.instanceMatrix.needsUpdate = heads.instanceMatrix.needsUpdate = true;
  };
  setFigs(0);
  plaza.add(bodies, heads);

  // linhas finas da rede (arcos entre cabeças)
  const nodes = figs.map((f) => new V3(f.x, PLAZA_Y + 0.9 * f.s, f.z));
  const hubNode = new V3(0, hubY + 0.72 * HS, 0);
  const edges = new Set(); const addE = (a, b) => edges.add(a < b ? a + "-" + b : b + "-" + a);
  nodes.forEach((a, i) => {
    nodes.map((b, j) => [j, Math.hypot(a.x - b.x, a.z - b.z)]).filter(([j]) => j !== i).sort((x, y) => x[1] - y[1]).slice(0, 2).forEach(([j]) => addE(i, j));
  });
  const lineGeos = [];
  edges.forEach((k) => {
    const [i, j] = k.split("-").map(Number), a = nodes[i], b = nodes[j], L = a.distanceTo(b);
    const mid = a.clone().add(b).multiplyScalar(0.5); mid.y += 0.1 + L * 0.1;
    lineGeos.push(new THREE.TubeGeometry(new THREE.QuadraticBezierCurve3(a, mid, b), 6, 0.026, 4, false));
  });
  for (let i = 0; i < 5; i++) { // o hub liga-se ao primeiro anel
    const b = nodes[i], mid = hubNode.clone().add(b).multiplyScalar(0.5); mid.y += 0.2;
    lineGeos.push(new THREE.TubeGeometry(new THREE.QuadraticBezierCurve3(hubNode.clone(), mid, b), 10, 0.03, 4, false));
  }
  const lineMat = new THREE.MeshStandardMaterial({ color: "#8B7866", roughness: 0.6, emissive: "#FFB48A", emissiveIntensity: 0.2, envMapIntensity: 0.4 });
  const lines = mesh(mergeGeometries(lineGeos), lineMat, { cast: false }); plaza.add(lines);

  // figura viva (vermelhão emissivo) — o ponto por onde passa o fio
  const hub = new THREE.Group(); hub.position.y = hubY; hub.scale.setScalar(HS); plaza.add(hub);
  const hubBody = mesh(hubBodyGeo, M.glow("#F23C1C", { ei: 0.45 }), { cast: true }); hub.add(hubBody);
  const hubHd = mesh(hubHeadGeo, M.glow("#FF4A28", { ei: 1.5 }), { cast: false }); hubHd.position.y = 0.9; hub.add(hubHd);
  // ondas de "difusão" no chão da praça
  const rippleGeo = new THREE.RingGeometry(0.93, 1.0, 96);
  const ripples = [0, 0.5].map((ph) => {
    const m = new THREE.Mesh(rippleGeo, new THREE.MeshBasicMaterial({ color: "#FF6A44", transparent: true, opacity: 0, depthWrite: false })); m.rotation.x = -Math.PI / 2; m.position.y = PLAZA_Y + 0.008; m.renderOrder = 2; m.userData.ph = ph; plaza.add(m); return m;
  });

  // ============ Tutor de Filosofia — templo ============
  {
    const tw = P(-4.95, -0.6, 0.15), t = new THREE.Group(); tw.add(t); t.rotation.y = 0.5; t.scale.setScalar(1.1);
    const cream = M.clay("#F6EEDE", { rough: 0.78 }), sand = M.clay("#E5D3B2", { rough: 0.85 }), sand2 = M.clay("#DCC6A0", { rough: 0.9 });
    const roofM = M.clay("#D9A88A", { rough: 0.88 }), terraM = M.clay("#B8593E", { rough: 0.85 }), ochreM = M.clay(PAL.ochre, { rough: 0.7, noBump: true }), doorM = M.clay("#6A5240", { rough: 0.8, noBump: true });
    // degraus
    [[2.8, 3.0, sand2], [2.6, 2.8, cream], [2.4, 2.6, sand2]].forEach(([w, d, m], i) => { const s = mesh(rbox(w, 0.14, d, 0.04), m); s.position.y = 0.07 + i * 0.14; t.add(s); });
    const Y0 = 0.42;
    // cela
    const cella = mesh(rbox(1.5, 1.72, 1.9, 0.04), sand); cella.position.set(0, Y0 + 0.86, -0.15); t.add(cella);
    const door = mesh(rbox(0.5, 1.0, 0.08, 0.03), doorM, { cast: false }); door.position.set(0, Y0 + 0.5, 0.82); t.add(door);
    // colunas (fundidas)
    const cols = [], xs = [-0.9, -0.3, 0.3, 0.9], zs = [-1.05, -0.35, 0.35, 1.05];
    const spots = [];
    xs.forEach((x) => { spots.push([x, 1.05], [x, -1.05]); });
    zs.slice(1, 3).forEach((z) => { spots.push([-0.9, z], [0.9, z]); });
    spots.forEach(([x, z]) => {
      cols.push(place(new THREE.CylinderGeometry(0.105, 0.13, 1.6, 20), { p: [x, Y0 + 0.06 + 0.8, z] }));
      cols.push(place(new THREE.CylinderGeometry(0.17, 0.17, 0.06, 20), { p: [x, Y0 + 0.03, z] }));
      cols.push(place(rbox(0.34, 0.1, 0.34, 0.03, 1), { p: [x, Y0 + 1.66 + 0.05, z] }));
    });
    t.add(mesh(merge(cols), cream));
    // entablamento + cornija
    const ent = mesh(rbox(2.3, 0.3, 2.5, 0.04), cream); ent.position.y = Y0 + 1.76 + 0.15; t.add(ent);
    const cor = mesh(rbox(2.44, 0.08, 2.64, 0.03), sand); cor.position.y = Y0 + 2.06 + 0.04; t.add(cor);
    // telhado triangular (frontão na frente)
    const tri = new THREE.Shape(); tri.moveTo(-1.22, 0); tri.lineTo(1.22, 0); tri.lineTo(0, 0.66); tri.lineTo(-1.22, 0);
    const roof = mesh(extrude(tri, 2.6, 0.03), roofM); roof.position.y = Y0 + 2.14; t.add(roof);
    const tym = new THREE.Shape(); tym.moveTo(-0.9, 0); tym.lineTo(0.9, 0); tym.lineTo(0, 0.42); tym.lineTo(-0.9, 0);
    const tymM = mesh(extrude(tym, 0.03, 0.015), terraM, { cast: false }); tymM.position.set(0, Y0 + 2.14 + 0.06, 1.33 + 0.02); t.add(tymM);
    const orb = mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.05, 24), ochreM, { cast: false }); orb.rotation.x = Math.PI / 2; orb.position.set(0, Y0 + 2.14 + 0.24, 1.33 + 0.06); t.add(orb);
  }

  // ============ JogaLetras — peças com letras, ao pé do templo ============
  {
    const jw = P(-4.15, 3.75, 0.6), tiles = [["J", "#BC6248", -0.95, -0.7, 0.2], ["O", "#3E7F89", -0.3, -0.24, -0.12], ["G", "#D9A441", 0.4, 0.2, 0.08], ["A", "#8A5878", 1.15, 0.6, -0.2]];
    const S = 0.68;
    tiles.forEach(([ch, col, x, z, rot]) => {
      const tg = new THREE.Group(); tg.position.set(x, S / 2, z); tg.rotation.y = rot; jw.add(tg);
      tg.add(mesh(rbox(S, S, S, 0.08), M.clay(col, { rough: 0.6, noBump: true })));
      const tex = letterTex(ch, col), fm = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.65, envMapIntensity: 0.4 });
      const topP = mesh(new THREE.PlaneGeometry(S * 0.72, S * 0.72), fm, { cast: false }); topP.rotation.x = -Math.PI / 2; topP.position.y = S / 2 + 0.002; tg.add(topP);
      const frP = mesh(new THREE.PlaneGeometry(S * 0.72, S * 0.72), fm, { cast: false }); frP.position.z = S / 2 + 0.002; tg.add(frP);
    });
  }

  // ============ AI Fact Checker — lente sobre folha ============
  {
    const fw = P(4.85, -0.75, 0.25), f = new THREE.Group(); fw.add(f); f.rotation.y = -0.5; f.scale.setScalar(1.05);
    const platTop = 0.3;
    const plat = mesh(rbox(2.4, 0.3, 2.2, 0.1), M.clay("#EFE3CB", { rough: 0.85 })); plat.position.y = 0.15; f.add(plat);
    const page = new THREE.Group(); page.position.set(0, platTop, -0.5); page.rotation.x = -0.07; f.add(page);
    const PH = 2.9, PW = 2.1;
    const sheet = mesh(rbox(PW, PH, 0.14, 0.05), M.clay("#FBF6EC", { rough: 0.85, bump: 0.15 })); sheet.position.y = PH / 2 + 0.04; page.add(sheet);
    // linhas de texto (fundidas por cor)
    const lineItems = [], mGrey = M.clay("#CDBB9C", { rough: 0.9, noBump: true }), mInk = M.clay("#7A6A58", { rough: 0.8, noBump: true }), mTerra = M.clay("#D9866A", { rough: 0.8, noBump: true }), mSage = M.clay("#7E9078", { rough: 0.8, noBump: true }), mSageL = M.clay("#D6DFCC", { rough: 0.85, noBump: true });
    const bar = (len, h, y, mat, x0 = -0.85) => lineItems.push({ geo: place(new THREE.BoxGeometry(len, h, 0.04), { p: [x0 + len / 2, y, 0.08] }), mat });
    bar(1.05, 0.13, 2.72, mInk);
    [[1.7, 2.45], [1.5, 2.25], [1.62, 2.05]].forEach(([l, y]) => bar(l, 0.07, y, mGrey));
    bar(0.9, 0.035, 2.17, mTerra, -0.85); // sublinhado a terra (afirmação suspeita)
    [[1.7, 1.02], [1.35, 0.84], [1.6, 0.66]].forEach(([l, y]) => bar(l, 0.07, y, mGrey));
    bar(1.7, 0.1, 0.34, mSageL); bar(1.25, 0.1, 0.34, mSage);       // barra de verificação (sage)
    page.add(mergedByMat(lineItems));
    // lente: aro + disco + visto, apoiada no cabo
    const lens = new THREE.Group(); lens.position.set(-0.05, 1.78, 0.55); f.add(lens);
    lens.add(mesh(new THREE.TorusGeometry(0.72, 0.1, 12, 44), M.clay("#D9A441", { rough: 0.55, noBump: true })));
    const disc = mesh(new THREE.CylinderGeometry(0.68, 0.68, 0.06, 56), M.glaze("#E7EFE0"), { cast: false }); disc.rotation.x = Math.PI / 2; disc.position.z = -0.01; lens.add(disc);
    const sageD = M.clay("#5B8266", { rough: 0.7, noBump: true });
    const arm = (x0, y0, x1, y1) => { const L = Math.hypot(x1 - x0, y1 - y0), m = mesh(rbox(L + 0.12, 0.15, 0.08, 0.06), sageD, { cast: false }); m.position.set((x0 + x1) / 2, (y0 + y1) / 2, 0.05); m.rotation.z = Math.atan2(y1 - y0, x1 - x0); return m; };
    lens.add(arm(-0.34, 0.0, -0.13, -0.22), arm(-0.13, -0.22, 0.34, 0.3));
    const ang = -1.0, dx = Math.cos(ang), dy = Math.sin(ang), start = 0.78, y0 = lens.position.y + dy * start, L = (y0 - platTop) / -dy;
    const handle = mesh(new THREE.CapsuleGeometry(0.085, L, 6, 14), M.clay("#7A5641", { rough: 0.6, noBump: true }));
    handle.position.set(lens.position.x + dx * (start + L / 2), y0 + dy * (L / 2), lens.position.z); handle.rotation.z = ang + Math.PI / 2; f.add(handle);
  }

  // ============ Internet Segura — portão com escudo e fechadura ============
  {
    const gw = P(0.2, -5.2, 0.1), gt = new THREE.Group(); gw.add(gt); gt.scale.setScalar(1.1);
    const wallM = M.clay("#D6C6AA", { rough: 0.88 }), trimM = M.clay("#F3EAD8", { rough: 0.8 }), plinthM = M.clay("#E0D0B2", { rough: 0.9 });
    const plinth = mesh(rbox(4.1, 0.28, 1.5, 0.08), plinthM); plinth.position.y = 0.14; gt.add(plinth);
    const body = mesh(extrude(archShape(1.8, 2.35, 0.95, 1.9), 0.9, 0.06), wallM); body.position.y = 0.28; gt.add(body);
    // aduelas decorativas no arco (friso) — anel fino a toda a volta da abertura
    const doorM = M.clay("#2E5F68", { rough: 0.75, noBump: true });
    const door = mesh(extrude(archShape(0.93, 1.9), 0.26, 0.02), doorM); door.position.set(0, 0.28, -0.08); gt.add(door);
    const groove = mesh(rbox(0.035, 2.75, 0.03, 0.012), M.clay("#183A41", { rough: 0.8, noBump: true }), { cast: false }); groove.position.set(0, 0.28 + 1.35, 0.075); gt.add(groove);
    // escudo extrudido
    const sh = new THREE.Group(); sh.position.set(0, 0.28 + 1.62, 0.12); gt.add(sh);
    const shO = mesh(extrude(shieldShape(0.68, 0.82, 0.98), 0.1, 0.05), M.clay("#8CC0BF", { rough: 0.55, noBump: true })); sh.add(shO);
    const shI = mesh(extrude(shieldShape(0.53, 0.66, 0.78), 0.06, 0.03), M.clay("#3E7F89", { rough: 0.55, noBump: true })); shI.position.set(0, -0.01, 0.1); sh.add(shI);
    // fechadura
    const lockM = M.clay("#F6EEDE", { rough: 0.6, noBump: true });
    const kc = mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.05, 28), lockM, { cast: false }); kc.rotation.x = Math.PI / 2; kc.position.set(0, 0.12, 0.2); sh.add(kc);
    const ks = new THREE.Shape(); ks.moveTo(-0.06, 0.06); ks.lineTo(0.06, 0.06); ks.lineTo(0.1, -0.3); ks.lineTo(-0.1, -0.3); ks.lineTo(-0.06, 0.06);
    const kst = mesh(extrude(ks, 0.03, 0.01), lockM, { cast: false }); kst.position.set(0, 0.06, 0.2); sh.add(kst);
    // pequenos muretes laterais, para o portão "fechar" o campus
    const frame = mesh(extrude(archShape(1.1, 1.9, 0.95, 1.9), 0.9, 0.05), trimM); frame.position.set(0, 0.28, 0.06); gt.add(frame);
    [-1, 1].forEach((sx) => {
      const w = mesh(rbox(1.5, 0.95, 0.5, 0.07), wallM); w.position.set(sx * 2.62, 0.28 + 0.475, -0.05); gt.add(w);
      const cap = mesh(rbox(1.6, 0.1, 0.6, 0.04), trimM); cap.position.set(sx * 2.62, 0.28 + 0.95 + 0.05, -0.05); gt.add(cap);
    });
  }

  // ============ Verbi — ondas de voz ============
  const ARC = { r: 4.9, a0: 0.36, a1: 1.27 }, aMid = (ARC.a0 + ARC.a1) / 2;
  const mx = PC[0] + Math.cos(aMid) * ARC.r, mz = PC[1] + Math.sin(aMid) * ARC.r;
  const NB = 15, BR = 0.125; // nº de barras e raio
  const voice = P(mx, mz, 0.3);
  const bars = [];
  {
    // pódio em arco
    const pts = [], seg = 44, rI = ARC.r - 0.42, rO = ARC.r + 0.42, aA = ARC.a0 - 0.06, aB = ARC.a1 + 0.06;
    for (let i = 0; i <= seg; i++) { const a = aA + (aB - aA) * (i / seg); pts.push(new THREE.Vector2(Math.cos(a) * rO + PC[0] - mx, -(Math.sin(a) * rO + PC[1] - mz))); }
    for (let i = seg; i >= 0; i--) { const a = aA + (aB - aA) * (i / seg); pts.push(new THREE.Vector2(Math.cos(a) * rI + PC[0] - mx, -(Math.sin(a) * rI + PC[1] - mz))); }
    const pg = new THREE.ExtrudeGeometry(new THREE.Shape(pts), { depth: 0.18, bevelEnabled: true, bevelSize: 0.03, bevelThickness: 0.03, bevelSegments: 2 });
    pg.rotateX(-Math.PI / 2); pg.translate(0, 0.03, 0);
    voice.add(mesh(pg, M.clay("#E3CFA9", { rough: 0.9, bump: 0.3 })));
    const stemGeo = new THREE.CylinderGeometry(BR, BR, 1, 18); stemGeo.translate(0, 0.5, 0);
    const capGeo = new THREE.SphereGeometry(BR, 14, 8);
    const mat = M.clay("#FFFFFF", { rough: 0.55, noBump: true });
    const stems = new THREE.InstancedMesh(stemGeo, mat, NB), caps = new THREE.InstancedMesh(capGeo, mat, NB);
    stems.frustumCulled = caps.frustumCulled = false; stems.castShadow = caps.castShadow = true; stems.receiveShadow = caps.receiveShadow = true;
    const cL = new THREE.Color(PAL.plumL), cD = new THREE.Color("#7C4A6A");
    for (let i = 0; i < NB; i++) {
      const u = i / (NB - 1), a = ARC.a0 + (ARC.a1 - ARC.a0) * u, env = Math.exp(-Math.pow((u - 0.5) / 0.27, 2));
      const b = { x: Math.cos(a) * ARC.r + PC[0] - mx, z: Math.sin(a) * ARC.r + PC[1] - mz, env, ph: R() * 0.6 };
      bars.push(b);
      _c.copy(cL).lerp(cD, 0.15 + 0.85 * env); stems.setColorAt(i, _c); caps.setColorAt(i, _c);
    }
    stems.instanceColor.needsUpdate = caps.instanceColor.needsUpdate = true;
    voice.userData = { stems, caps };
    voice.add(stems, caps);
  }
  const setBars = (t) => {
    const { stems, caps } = voice.userData;
    for (let i = 0; i < NB; i++) {
      const b = bars[i], w = 0.5 + 0.5 * Math.sin(t * 1.5 - i * 0.62 + Math.sin(t * 0.55 + b.ph * 4) * 0.7);
      const h = 0.7 + (0.4 + 1.75 * b.env) * (0.35 + 0.65 * w), base = 0.2;
      _m.compose(_p.set(b.x, base, b.z), _q.identity(), _s.set(1, h - BR, 1)); stems.setMatrixAt(i, _m);
      _m.compose(_p.set(b.x, base + h - BR, b.z), _q.identity(), _s.set(1, 1, 1)); caps.setMatrixAt(i, _m);
    }
    stems.instanceMatrix.needsUpdate = caps.instanceMatrix.needsUpdate = true;
  };
  setBars(0);

  // ============ vegetação mínima: ciprestes ============
  P(-6.2, -2.1, 0.7).add(cypress(M, { h: 3.3, r: 0.46, seed: 3 }));
  P(-3.1, -3.5, 0.75).add(cypress(M, { h: 3.2, r: 0.46, seed: 5 }));
  P(6.0, -3.2, 0.8).add(cypress(M, { h: 3.4, r: 0.48, seed: 7 }));
  P(-2.3, 5.7, 0.85).add(bush(M, { s: 0.5, color: "#9DB093" }));

  // ============ animação ============
  const update = (t) => {
    isl.update(t);
    setBars(t);
    setFigs(t);
    const pulse = 1 + Math.sin(t * 2.6) * 0.07;
    hubHd.scale.setScalar(pulse); hubBody.scale.set(1 + Math.sin(t * 2.6) * 0.02, 1 + Math.sin(t * 2.6 + 0.4) * 0.02, 1 + Math.sin(t * 2.6) * 0.02);
    lineMat.emissiveIntensity = 0.22 + 0.16 * Math.sin(t * 1.5);
    ripples.forEach((m) => { const k = ((t / 3.4) + m.userData.ph) % 1; m.scale.setScalar(0.72 + k * 1.85); m.material.opacity = 0.5 * Math.pow(1 - k, 1.6) * Math.min(1, k * 8); });
  };

  const thread = [[PC[0], hubY + 0.9 * HS, PC[1]]];
  return { group: g, update, pops, thread };
}
