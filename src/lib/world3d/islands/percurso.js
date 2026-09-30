// Ilha 5 — Percurso: "o caminho". Um caminho de lajes sobe por terraços de altura crescente, ligando as instituições de uma carreira,
// cada uma moldada em barro a partir dos traços do edifício real (ver percurso-edificios.js), por ordem cronológica:
// ISMAI (2001) → EB 2/3 Napoleão Sousa Marques (2002/03) → Programa Escolhas (2004/09) → EB/S de Pinheiro (2009–) → Ordem dos Psicólogos (2016–24)
// → um rio atravessado por uma ponte em arco (Luís I) → FMUP (2022–), com um gráfico de barras crescente e uma baliza cujo topo é o ponto vivo vermelhão.
import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { PAL } from "../materials.js";
import { makeIsland } from "../island.js";
import { mesh, rbox, TAU, rng, clamp, lerp, smooth } from "../util.js";
import { popper, cypress, bush } from "./kit.js";
import { bucket, textTexture, decal } from "./percurso-kit.js";
import { ismai, eb23, escolhas, pinheiro, opp, fmup } from "./percurso-edificios.js";

const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
const V2 = (x, y) => new THREE.Vector2(x, y);
const hyp = Math.hypot;

// ---------- cores ----------
const C = {
  top: "#A9B79B", soil: "#B99A74", rock: ["#AE9A80", "#7C6A58"],
  slabTop: "#DBC395", slabSide: "#CDB68E", slabCap: "#F2E9D3", stone: "#F4ECDD", stone2: "#E6D6B6",
  ochre: "#E2B45C", ochreD: "#BE9042", roof: "#B0644A", roofD: "#9C5238",
  ink: "#2E2622", dark: "#5B4538", sage: "#95AC90", teal: "#3E7F89", tealD: "#2C5D66", tealL: "#86B9BA", water: "#4C939D",
};

// ---------- utilitários locais ----------
// laje/terraço a partir de um polígono no plano xz, de y0 a y1 (topo e lados com materiais distintos)
function slab(poly, y0, y1, mats, bev = 0.07) {
  const sh = new THREE.Shape(poly.map(([x, z]) => V2(x, -z)));
  const g = new THREE.ExtrudeGeometry(sh, { depth: Math.max(0.01, y1 - y0 - 2 * bev), bevelEnabled: true, bevelSize: bev, bevelThickness: bev, bevelOffset: -bev, bevelSegments: 2, curveSegments: 4 });
  g.rotateX(-Math.PI / 2); g.translate(0, y0 + bev, 0);
  return mesh(g, mats);
}

// escada maciça: (x,z) = centro da aresta superior; dir = sentido de descida; n degraus de altura rise entre y0 e y0+n*rise
function stairFlight(grp, x, z, dir, w, n, rise, run, y0, mat) {
  const B = bucket(), yaw = Math.atan2(dir[0], dir[1]), yTop = y0 + n * rise, sn = Math.sin(yaw), cs = Math.cos(yaw);
  for (let j = 1; j < n; j++) {
    const top = yTop - j * rise, h = top - y0 + 0.12, d = (j - 0.5) * run;
    B.box(w, h, run + 0.03, mat, [x + sn * d, y0 - 0.12 + h / 2, z + cs * d], { r: 0.03, rot: [0, yaw, 0] });
  }
  B.build(grp);
}

// arredonda os cantos de um polígono (curvas quadráticas); keep(i) preserva vértices (ex.: pontos da margem do rio)
function roundPoly(pts, r = 0.6, seg = 4, keep = () => false) {
  const n = pts.length, out = [];
  for (let i = 0; i < n; i++) {
    if (keep(i)) { out.push(pts[i]); continue; }
    const p0 = pts[(i + n - 1) % n], p1 = pts[i], p2 = pts[(i + 1) % n];
    const d0 = hyp(p1[0] - p0[0], p1[1] - p0[1]), d2 = hyp(p2[0] - p1[0], p2[1] - p1[1]);
    const k0 = Math.min(r, d0 * 0.45) / d0, k2 = Math.min(r, d2 * 0.45) / d2;
    const a = [p1[0] + (p0[0] - p1[0]) * k0, p1[1] + (p0[1] - p1[1]) * k0], b = [p1[0] + (p2[0] - p1[0]) * k2, p1[1] + (p2[1] - p1[1]) * k2];
    for (let k = 0; k <= seg; k++) { const t = k / seg, u = 1 - t; out.push([u * u * a[0] + 2 * u * t * p1[0] + t * t * b[0], u * u * a[1] + 2 * u * t * p1[1] + t * t * b[1]]); }
  }
  return out;
}

// aparelho de pedra: fiadas horizontais com juntas desencontradas (u = metros no muro, v = altura em metros)
function masonryTexture() {
  const W = 256, c = document.createElement("canvas"); c.width = c.height = W;
  const g = c.getContext("2d"), r = rng(12);
  g.fillStyle = "#FFFFFF"; g.fillRect(0, 0, W, W);
  for (let row = 0; row < 4; row++) {
    const y = row * 64;
    for (let k = 0; k < 2; k++) {
      const x = (k * 128 + (row % 2) * 64) % W;
      g.fillStyle = `rgba(110,80,40,${0.03 + r() * 0.1})`; g.fillRect(x, y, 128, 64);
    }
    g.fillStyle = "rgba(96,66,34,0.62)"; g.fillRect(0, y, W, 5);
    for (let k = 0; k < 2; k++) g.fillRect((k * 128 + (row % 2) * 64) % W, y, 5, 64);
  }
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(0.4, 0.72); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
}
// água: riscos longos e suaves ao longo da corrente (a textura desliza com o tempo)
function waterTexture(base) {
  const W = 128, H = 256, c = document.createElement("canvas"); c.width = W; c.height = H;
  const g = c.getContext("2d"), r = rng(7);
  g.fillStyle = base; g.fillRect(0, 0, W, H); g.lineCap = "round";
  for (let i = 0; i < 44; i++) {
    const x = 6 + r() * (W - 12), y = r() * H, len = 30 + r() * 80, amp = 1.5 + r() * 2.5, ph = r() * TAU, light = r() > 0.4;
    g.strokeStyle = light ? "rgba(196,236,230,0.24)" : "rgba(28,84,96,0.20)"; g.lineWidth = 2.6 + r() * 2;
    for (const oy of [-H, 0, H]) { g.beginPath(); for (let k = 0; k <= 12; k++) { const u = k / 12, yy = y + oy + u * len, xx = x + Math.sin(ph + u * 4) * amp; k ? g.lineTo(xx, yy) : g.moveTo(xx, yy); } g.stroke(); }
  }
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t;
}

export function buildPercurso(M) {
  const g = new THREE.Group(), pops = [], P = popper(g, pops), Rn = rng(41);
  const RI = 8.0;
  const isl = makeIsland(M, { R: RI, top: C.top, soil: C.soil, rock: C.rock, seed: 47, depth: 8.6, wob: 0.03 });
  g.add(isl.group);
  const edgeR = (x, z) => { const [sx, sz] = isl.shape(x, z); return RI * hyp(sx, sz) / Math.max(1e-6, hyp(x, z)); };

  const clampPoly = (poly, m = 0.45) => poly.map(([x, z]) => { const r = hyp(x, z), lim = edgeR(x, z) - m; return r > lim ? [x * lim / r, z * lim / r] : [x, z]; });

  // materiais
  const mTop = M.clay(C.slabTop, { rough: 0.9, bump: 0.22 });
  const masonry = masonryTexture();
  const mSide = new THREE.MeshStandardMaterial({ color: C.slabSide, map: masonry, bumpMap: masonry, bumpScale: 1.1, roughness: 0.95, envMapIntensity: 0.5 });
  const mStone = M.clay(C.stone, { rough: 0.8, bump: 0.25 }), mStone2 = M.clay(C.stone2, { rough: 0.85, bump: 0.25 });
  const mInk = M.clay(C.ink, { rough: 0.6, noBump: true }), mDark = M.clay(C.dark, { rough: 0.95, noBump: true });
  const mWin = M.glaze(C.tealD);
  const stairMat = M.clay(C.stone, { rough: 0.8, bump: 0.3 });

  // ================= RIO =================
  const RW = 1.2, BANK = 1.28; // meia-largura da água e afastamento das margens
  const RC = [0.9, -0.6], rl = hyp(0.3, 0.954), RD = [0.3 / rl, 0.954 / rl], RN = [RD[1], -RD[0]];
  const rvCtrl = [];
  for (let t = -9; t <= 13.01; t += 1.25) { const w = 0.45 * Math.sin(t * 0.4); rvCtrl.push(V3(RC[0] + RD[0] * t + RN[0] * w, 0, RC[1] + RD[1] * t + RN[1] * w)); }
  const rvCurve = new THREE.CatmullRomCurve3(rvCtrl, false, "centripetal");
  const NS = 320, S = [];
  for (let i = 0; i <= NS; i++) {
    const u = i / NS, p = rvCurve.getPointAt(u), tg = rvCurve.getTangentAt(u);
    if (hyp(p.x, p.z) < edgeR(p.x, p.z) - 0.5) S.push({ p: [p.x, p.z], n: [tg.z, -tg.x], t: [tg.x, tg.z] });
  }
  const bank = (d, zMin, zMax) => S.filter((s) => s.p[1] >= zMin && s.p[1] <= zMax).map((s) => [s.p[0] + s.n[0] * d, s.p[1] + s.n[1] * d]);
  const bi = S.reduce((b, s, i) => (hyp(s.p[0] - RC[0], s.p[1] - RC[1]) < hyp(S[b].p[0] - RC[0], S[b].p[1] - RC[1]) ? i : b), 0);
  const BC = S[bi].p, BN = S[bi].n; // centro e eixo (perpendicular ao rio) da ponte
  const bAng = Math.atan2(-BN[1], BN[0]);

  // fita de água (com UV: u atravessa o leito, v acompanha a corrente; a textura desliza em update)
  const RIVER_Y = 0.06, flowTex = waterTexture(C.water);
  const mWater = new THREE.MeshPhysicalMaterial({ color: "#FFFFFF", map: flowTex, roughness: 0.3, metalness: 0, clearcoat: 0.5, clearcoatRoughness: 0.4, envMapIntensity: 0.8 });
  let vEnd = 0;
  {
    const pos = [], nrm = [], uv = [], idx = [];
    S.forEach((s, i) => {
      if (i) vEnd += hyp(s.p[0] - S[i - 1].p[0], s.p[1] - S[i - 1].p[1]) / 5;
      pos.push(s.p[0] - s.n[0] * (RW + 0.1), RIVER_Y, s.p[1] - s.n[1] * (RW + 0.1), s.p[0] + s.n[0] * (RW + 0.1), RIVER_Y, s.p[1] + s.n[1] * (RW + 0.1));
      nrm.push(0, 1, 0, 0, 1, 0); uv.push(0, vEnd, 1, vEnd);
      if (i) { const a = (i - 1) * 2; idx.push(a, a + 2, a + 1, a + 1, a + 2, a + 3); }
    });
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3)); geo.setAttribute("normal", new THREE.Float32BufferAttribute(nrm, 3)); geo.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2)); geo.setIndex(idx);
    const river = P(0, 0, 0.02); river.add(mesh(geo, mWater, { cast: false }));
  }

  // ================= TERRAÇOS =================
  const Y1 = 0.7, Y3 = 2.0, DECK = Y3; // o tabuleiro da ponte fica à cota do último terraço
  const bk1 = bank(-BANK, -7.5, 4.7), bk3 = bank(BANK, -7.5, 0.9);
  const o1 = [[-1.5, 5.0], [-1.7, 3.4], [-5.0, 3.3], [-6.8, 2.2], [-7.3, -1.0], [-6.4, -4.3], [-4.2, -6.3]];
  const o3 = [[3.6, 1.2], [5.6, 0.9], [6.9, -1.0], [6.5, -3.2], [5.2, -5.0], [3.3, -6.6]];
  const keepBank = (nb) => (i) => i >= 1 && i <= nb - 2;
  const T1 = clampPoly(roundPoly([...bk1, ...o1], 0.7, 4, keepBank(bk1.length)));
  const grow = (pts, k) => { const cx = pts.reduce((a, p) => a + p[0], 0) / pts.length, cz = pts.reduce((a, p) => a + p[1], 0) / pts.length; return pts.map(([x, z]) => [cx + (x - cx) * k, cz + (z - cz) * k]); };
  const T3 = clampPoly(roundPoly([...bk3, ...o3], 0.9, 4, keepBank(bk3.length)), 0.65);
  const T3tier = clampPoly(roundPoly([...bk3, ...grow(o3, 1.07)], 0.9, 4, keepBank(bk3.length)), 0.4);
  const mCapTop = M.clay("#EAD8AF", { rough: 0.85, bump: 0.25 }), mCapSide = M.clay("#DCC7A0", { rough: 0.9, bump: 0.35 });
  const terrace = (poly, y0, y1, mats, at) => {
    const cx = poly.reduce((a, p) => a + p[0], 0) / poly.length, cz = poly.reduce((a, p) => a + p[1], 0) / poly.length;
    const w = P(cx, cz, at); w.add(slab(poly.map(([x, z]) => [x - cx, z - cz]), y0, y1, mats)); return w;
  };
  terrace(T1, -0.05, Y1, [mTop, mSide], 0.0);
  terrace(T3tier, -0.05, 1.1, [mTop, mSide], 0.06);
  terrace(T3, -0.05, Y3 - 0.1, [mTop, mSide], 0.08);
  terrace(clampPoly(grow(T3, 1.012), 0.5), Y3 - 0.12, Y3, [mCapTop, mCapSide], 0.08);

  // ================= PONTE (Luís I) =================
  const bridgeTop = [BC[0] - BN[0] * BANK, BC[1] - BN[1] * BANK]; // extremo oeste do tabuleiro (aresta superior da escada)
  const westDir = [-BN[0], -BN[1]], N_BR = 5, RUN_BR = 0.4;
  const bridgeFoot = [bridgeTop[0] + westDir[0] * N_BR * RUN_BR, bridgeTop[1] + westDir[1] * N_BR * RUN_BR];
  const bridgeEast = [BC[0] + BN[0] * BANK, BC[1] + BN[1] * BANK];
  {
    const br = P(BC[0], BC[1], 0.35); br.rotation.y = bAng;
    const B = bucket(), mIron = M.clay("#3B302A", { rough: 0.55, noBump: true }), mDeck = M.clay(C.stone, { rough: 0.7, bump: 0.2 });
    const half = BANK + 0.1, len = BANK * 2;
    B.box(len, 0.16, 1.2, mDeck, [0, DECK - 0.08, 0], { r: 0.04 });
    // guardas
    [-0.55, 0.55].forEach((z) => { B.box(len, 0.07, 0.07, mIron, [0, DECK + 0.28, z], { flat: true }); B.box(len, 0.05, 0.05, mIron, [0, DECK + 0.1, z], { flat: true }); for (let i = -3; i <= 3; i++) B.box(0.06, 0.3, 0.06, mIron, [i * (len / 6.2), DECK + 0.15, z], { flat: true }); });
    // dois arcos (crescente achatado), suspensórios verticais até ao tabuleiro
    const y0 = 0.42, rise = DECK - 0.16 - y0 - 0.03;
    const yAt = (u) => y0 + rise * (1 - Math.pow(Math.abs(u), 2.4));
    const arch = (z) => {
      const pts = []; for (let i = 0; i <= 44; i++) { const u = (i / 44) * 2 - 1; pts.push(V3(u * half, yAt(u), z)); }
      B.add(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, false, "catmullrom", 0.5), 40, 0.09, 6, false), mIron);
      for (let k = -5; k <= 5; k++) { const u = k / 6.2, yy = yAt(u), h = DECK - 0.16 - yy; if (h > 0.06) B.add(new THREE.CylinderGeometry(0.045, 0.045, h + 0.03, 6), mIron, { p: [u * half, yy + h / 2 - 0.015, z] }); }
    };
    arch(-0.5); arch(0.5);
    for (let k = -2; k <= 2; k++) { const u = k / 2.7; B.box(0.06, 0.06, 1.0, mIron, [u * half, yAt(u), 0], { flat: true }); }
    B.build(br);
  }
  // escadas: ponte (T1 -> tabuleiro), T0 -> T1
  const ST0 = { x: -0.5, z: 4.9, n: 3 };
  {
    const sg = P(0, 0, 0.4); stairFlight(sg, bridgeTop[0], bridgeTop[1], westDir, 1.1, N_BR, (DECK - Y1) / N_BR, RUN_BR, Y1, stairMat);
    const sg3 = P(0, 0, 0.35); stairFlight(sg3, ST0.x, ST0.z, [0, 1], 1.3, ST0.n, Y1 / ST0.n, 0.42, 0, stairMat);
  }

  // ================= LAYOUT DOS MARCOS =================
  // [x, z, escala, yaw] de cada edifício; as placas ficam no canto da frente, junto ao caminho
  const L_ISMAI = [-4.1, 5.0, 0.95, 0.4], L_EB = [-4.5, 1.55, 0.88, 0.3], L_ESC = [-4.4, -1.1, 0.88, 0.25], L_PIN = [-4.1, -3.85, 0.88, 0.2], L_OPP = [5.0, -1.15, 0.88, 0.1], L_FM = [3.25, -4.05, 0.82, 0.12];
  const PL = { ismai: [-2.55, 5.55, 0.3], eb: [-2.7, 2.7, 0.3], esc: [-2.7, 0.05, 0.25], pin: [-2.7, -2.55, 0.2], opp: [3.95, 0.05, 0.15], fm: [3.75, -2.15, 0.15] };

  // ================= CAMINHO (lajes) =================
  const tiles = [];
  function pathRun(ctrl, y, width = 1.0, step = 0.7) {
    const curve = new THREE.CatmullRomCurve3(ctrl.map(([x, z]) => V3(x, 0, z)), false, "centripetal");
    const L = curve.getLength(), n = Math.max(2, Math.round(L / step));
    const cols = ["#FFFCF4", "#F6EDD8", "#FBF4E2"].map((c) => new THREE.Color(c)), tmp = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(0, 0, 0);
    for (let i = 0; i <= n; i++) {
      const u = i / n, p = curve.getPointAt(u), tg = curve.getTangentAt(u), ang = Math.atan2(tg.x, tg.z) + (Rn() - 0.5) * 0.12;
      const len = (L / n) * (0.82 + Rn() * 0.1), wid = width * (0.92 + Rn() * 0.14), th = 0.08;
      const g0 = rbox(len, th, wid, 0.035, 1), gg = g0.index ? g0.toNonIndexed() : g0;
      for (const k of Object.keys(gg.attributes)) if (k !== "position" && k !== "normal" && k !== "uv") gg.deleteAttribute(k);
      const col = cols[i % 3], arr = new Float32Array(gg.attributes.position.count * 3); for (let k = 0; k < arr.length; k += 3) { arr[k] = col.r; arr[k + 1] = col.g; arr[k + 2] = col.b; }
      gg.setAttribute("color", new THREE.BufferAttribute(arr, 3));
      e.set(0, ang, 0); q.setFromEuler(e); tmp.compose(V3(p.x + (Rn() - 0.5) * 0.05, y + th / 2 - 0.005, p.z + (Rn() - 0.5) * 0.05), q, V3(1, 1, 1)); gg.applyMatrix4(tmp);
      tiles.push(gg);
    }
  }
  let grpTiles;
  const mTile = M.clay("#FFFFFF", { rough: 0.85, bump: 0.3, vertexColors: true });
  {
    const bf = bridgeFoot, be = bridgeEast, s0 = [ST0.x, ST0.z + ST0.n * 0.42];
    // T0: da entrada do ISMAI até ao pé da escada
    pathRun([[-3.2, 6.55], [-2.4, 6.5], [-1.9, 6.3], [s0[0] - 0.1, s0[1] + 0.05]], 0, 1.0);
    // T1: escada -> ao longo do terraço -> pé da escada da ponte
    pathRun([[ST0.x, ST0.z - 0.1], [-1.0, 3.9], [-1.9, 2.8], [-2.2, 1.5], [bf[0] + 0.15, bf[1] + 0.1]], Y1, 1.0);
    // espinha para norte, ao longo das fachadas
    pathRun([[-2.2, 1.0], [-2.3, -0.8], [-2.35, -2.6], [-2.4, -4.4]], Y1, 0.9);
    // T3: da ponte ao adro do FMUP
    pathRun([[be[0] + 0.25, be[1] - 0.05], [2.7, -1.6], [3.0, -2.4], [3.25, -2.85]], Y3, 0.95);
    pathRun([[2.65, -1.35], [3.4, -0.85], [4.1, -0.5]], Y3, 0.8);
    grpTiles = P(0, 0, 0.5); grpTiles.add(mesh(mergeGeometries(tiles), mTile, { cast: false }));
  }

  // ================= MARCOS =================
  // seis instituições por ordem cronológica: T0 → T1 (de frente para trás) → ponte → T3. Cada uma "nasce" do chão em momentos escalonados.
  const site = (x, z, at, y, yaw, sc, build) => {
    const w = P(x, z, at, y); w.rotation.y = yaw;
    const inner = new THREE.Group(); inner.scale.setScalar(sc); w.add(inner); build(inner, M); return w;
  };
  const plaque = (x, z, at, y, yaw, text) => {
    const w = P(x, z, at, y); w.rotation.y = yaw;
    const inner = new THREE.Group(); inner.scale.setScalar(0.85); w.add(inner);
    const B = bucket(); B.box(1.5, 0.56, 0.13, mInk, [0, 0.28, 0], { r: 0.04 }); B.box(1.7, 0.08, 0.42, mStone2, [0, 0.04, 0.05], { r: 0.03 }); B.build(inner);
    const d = decal(textTexture(text, { w: 640, h: 256, size: 150 }), 1.36, 0.5); d.position.set(0, 0.3, 0.07); inner.add(d); return w;
  };
  site(L_ISMAI[0], L_ISMAI[1], 0.15, 0, L_ISMAI[3], L_ISMAI[2], ismai);
  site(L_EB[0], L_EB[1], 0.2, Y1, L_EB[3], L_EB[2], eb23);
  site(L_ESC[0], L_ESC[1], 0.25, Y1, L_ESC[3], L_ESC[2], escolhas);
  site(L_PIN[0], L_PIN[1], 0.3, Y1, L_PIN[3], L_PIN[2], pinheiro);
  site(L_OPP[0], L_OPP[1], 0.15, Y3, L_OPP[3], L_OPP[2], opp);
  site(L_FM[0], L_FM[1], 0.1, Y3, L_FM[3], L_FM[2], fmup);
  plaque(PL.ismai[0], PL.ismai[1], 0.55, 0, PL.ismai[2], "2001");
  plaque(PL.eb[0], PL.eb[1], 0.55, Y1, PL.eb[2], "2002–03");
  plaque(PL.esc[0], PL.esc[1], 0.6, Y1, PL.esc[2], "2004–09");
  plaque(PL.pin[0], PL.pin[1], 0.65, Y1, PL.pin[2], "2009–");
  plaque(PL.opp[0], PL.opp[1], 0.7, Y3, PL.opp[2], "2016–24");
  plaque(PL.fm[0], PL.fm[1], 0.75, Y3, PL.fm[2], "2022–");
  // gráfico de barras crescente (à frente do edifício)
  const barsInfo = [], chart = P(4.9, 4.4, 0.4, 0); chart.rotation.y = -0.15;
  {
    const mBase = M.clay(C.stone2, { rough: 0.85, bump: 0.25 }), B = bucket();
    B.box(2.7, 0.08, 0.66, mBase, [0, 0.04, 0], { r: 0.03 }); B.build(chart);
    const H = [0.5, 0.85, 1.2, 1.6, 2.05, 2.55], cols = ["#EDDDB6", "#E9CC82", "#E0B75E", "#D0A03E", "#BB8528", "#9C6B1D"];
    H.forEach((h, i) => {
      const geo = rbox(0.34, h, 0.36, 0.05, 2); geo.translate(0, h / 2, 0);
      const b = mesh(geo, M.clay(cols[i], { rough: 0.6, bump: 0.15 })); b.position.set(-1.05 + i * 0.42, 0.08, 0); chart.add(b); barsInfo.push({ m: b, i });
    });
  }
  // ---- baliza / bandeirola com o ponto vivo ----
  const FX = 6.15, FZ = -0.05, POLE = 5.9;
  const flagG = P(FX, FZ, 0.2, Y3);
  let bead, pennant, pennantBase;
  {
    const B = bucket();
    B.add(new THREE.CylinderGeometry(0.28, 0.34, 0.22, 20), mStone, { p: [0, 0.11, 0] });
    B.add(new THREE.CylinderGeometry(0.07, 0.09, POLE, 10), mInk, { p: [0, POLE / 2, 0] });
    B.build(flagG);
    bead = mesh(new THREE.SphereGeometry(0.2, 24, 16), M.glow("#FF4A28", { ei: 2.0 }), { cast: false }); bead.position.set(0, POLE + 0.05, 0); flagG.add(bead);
    const pg = new THREE.PlaneGeometry(1.9, 0.95, 14, 2); pg.translate(0.95, 0, 0);
    pennantBase = Float32Array.from(pg.attributes.position.array);
    for (let i = 0; i < pg.attributes.position.count; i++) { const u = pennantBase[i * 3] / 1.9; pennantBase[i * 3 + 1] *= (1 - u * 0.9); }
    pg.attributes.position.array.set(pennantBase);
    pennant = mesh(pg, new THREE.MeshStandardMaterial({ color: C.tealD, roughness: 0.7, side: THREE.DoubleSide }), { cast: true }); pennant.position.set(0.05, POLE - 0.7, 0); flagG.add(pennant);
  }
  const thread = [[FX, Y3 + POLE + 0.05, FZ]];

  // ---- queda de água na extremidade da frente do rio ----
  {
    const last = S[S.length - 1], tx = last.t[0], tz = last.t[1];
    let sLip = 0; while (sLip < 3 && hyp(last.p[0] + tx * sLip, last.p[1] + tz * sLip) < edgeR(last.p[0] + tx * sLip, last.p[1] + tz * sLip) - 0.1) sLip += 0.02;
    const prof = [[0, RIVER_Y, 1], [sLip - 0.5, RIVER_Y, 0.98], [sLip - 0.1, -0.05, 0.8], [sLip + 0.1, -0.32, 0.72], [sLip + 0.2, -0.7, 0.68], [sLip + 0.24, -1.3, 0.62], [sLip + 0.28, -2.0, 0.5], [sLip + 0.3, -2.6, 0.3], [sLip + 0.3, -2.9, 0.08], [sLip + 0.3, -3.05, 0.01]];
    const pos = [], uv = [], idx = []; let vv = vEnd;
    prof.forEach(([s, y, k], i) => {
      const px = last.p[0] + tx * s, pz = last.p[1] + tz * s, hw = (RW + 0.1) * k;
      if (i) vv += hyp(s - prof[i - 1][0], y - prof[i - 1][1]) / 5;
      pos.push(px - last.n[0] * hw, y, pz - last.n[1] * hw, px + last.n[0] * hw, y, pz + last.n[1] * hw); uv.push(0, vv, 1, vv);
      if (i) { const a = (i - 1) * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
    });
    const geo = new THREE.BufferGeometry(); geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3)); geo.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2)); geo.setIndex(idx); geo.computeVertexNormals();
    const wm = mWater.clone(); wm.side = THREE.DoubleSide;
    const fall = P(0, 0, 0.6); fall.add(mesh(geo, wm, { cast: false }));
  }

  // ---- vegetação mínima ----
  const c1 = P(-6.6, -0.3, 0.7, Y1); c1.add(cypress(M, { h: 3.3, r: 0.5, seed: 3 }));
  const c2 = P(6.1, 3.1, 0.75); c2.add(cypress(M, { h: 3.1, r: 0.48, seed: 8 }));
  const b1 = P(3.7, 4.6, 0.8); b1.add(bush(M, { s: 0.6, color: C.sage }));

  const update = (t) => {
    isl.update(t);
    flowTex.offset.y = -t * 0.06;
    barsInfo.forEach(({ m, i }) => { m.scale.y = 1 + (0.09 + i * 0.012) * Math.sin(t * 1.1 - i * 0.7) + 0.035 * Math.sin(t * 0.47 + i * 1.3); });
    bead.scale.setScalar(1 + Math.sin(t * 2.6) * 0.16);
    const p = pennant.geometry.attributes.position;
    for (let i = 0; i < p.count; i++) { const x = pennantBase[i * 3], u = x / 1.9; p.setZ(i, Math.sin(u * 5.5 - t * 3.4) * 0.16 * u); p.setY(i, pennantBase[i * 3 + 1] + Math.sin(u * 4 - t * 2.6) * 0.03 * u); }
    p.needsUpdate = true; pennant.geometry.computeVertexNormals();
  };
  return { group: g, update, pops, thread, focus: [0.4, 3.0, 0] };
}
