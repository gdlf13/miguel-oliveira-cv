// Ilha 5 — Percurso: "o caminho". Um caminho de lajes sobe por terraços de altura crescente, ligando os marcos de uma carreira:
// consultório (2001) → escola → instituições (arcadas) → um rio atravessado por uma ponte em arco (Luís I) → FMUP e dados de saúde.
// No último terraço, um gráfico de barras crescente e uma baliza cujo topo é o ponto vivo vermelhão.
import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { PAL } from "../materials.js";
import { makeIsland } from "../island.js";
import { mesh, rbox, TAU, rng, clamp, lerp, smooth } from "../util.js";
import { popper, cypress, bush, contact } from "./kit.js";

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
// fundir geometrias por material (poucos draw calls)
function bucket() {
  const map = new Map(), m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(0, 0, 0, "YXZ"), pv = new THREE.Vector3(), sv = new THREE.Vector3();
  const api = {
    add(geo, mat, { p = [0, 0, 0], r = [0, 0, 0], s = 1, cast = true } = {}) {
      const g = geo.index ? geo.toNonIndexed() : geo.clone();
      for (const k of Object.keys(g.attributes)) if (k !== "position" && k !== "normal" && k !== "uv") g.deleteAttribute(k);
      if (!g.attributes.uv) g.setAttribute("uv", new THREE.BufferAttribute(new Float32Array(g.attributes.position.count * 2), 2));
      e.set(r[0], r[1], r[2]); q.setFromEuler(e); pv.set(p[0], p[1], p[2]);
      if (typeof s === "number") sv.set(s, s, s); else sv.set(s[0], s[1], s[2]);
      g.applyMatrix4(m4.compose(pv, q, sv));
      const key = mat.uuid + (cast ? "c" : "n");
      let ent = map.get(key); if (!ent) map.set(key, (ent = { mat, cast, geos: [] }));
      ent.geos.push(g);
      return api;
    },
    box(w, h, d, mat, p, o = {}) { return api.add(o.flat ? new THREE.BoxGeometry(w, h, d) : rbox(w, h, d, o.r ?? 0.04, o.seg ?? 2), mat, { p, r: o.rot, cast: o.cast }); },
    build(parent) { map.forEach((ent) => parent.add(mesh(ent.geos.length > 1 ? mergeGeometries(ent.geos) : ent.geos[0], ent.mat, { cast: ent.cast }))); map.clear(); return parent; },
  };
  return api;
}

// telhado de duas águas: cumeeira ao longo de x, profundidade em z, base em y=0
function gable(len, depth, rise, over = 0.14) {
  const s = new THREE.Shape(), hd = depth / 2 + over;
  s.moveTo(-hd, 0); s.lineTo(hd, 0); s.lineTo(0, rise); s.lineTo(-hd, 0);
  const g = new THREE.ExtrudeGeometry(s, { depth: len, bevelEnabled: true, bevelSize: 0.045, bevelThickness: 0.045, bevelSegments: 2, curveSegments: 2 });
  g.translate(0, 0, -len / 2); g.rotateY(-Math.PI / 2);
  return g;
}

// laje/terraço a partir de um polígono no plano xz, de y0 a y1 (topo e lados com materiais distintos)
function slab(poly, y0, y1, mats, bev = 0.07) {
  const sh = new THREE.Shape(poly.map(([x, z]) => V2(x, -z)));
  const g = new THREE.ExtrudeGeometry(sh, { depth: Math.max(0.01, y1 - y0 - 2 * bev), bevelEnabled: true, bevelSize: bev, bevelThickness: bev, bevelOffset: -bev, bevelSegments: 2, curveSegments: 4 });
  g.rotateX(-Math.PI / 2); g.translate(0, y0 + bev, 0);
  return mesh(g, mats);
}

// fachada de arcos de volta perfeita (com janelas quadradas por cima), frente em +z, base em y=0, centrada em x
function arcade(W, H, nA, ow, archRect, winY, winW, winH, thick) {
  const s = new THREE.Shape();
  s.moveTo(-W / 2, 0); s.lineTo(W / 2, 0); s.lineTo(W / 2, H); s.lineTo(-W / 2, H); s.lineTo(-W / 2, 0);
  const pw = (W - nA * ow) / (nA + 1);
  for (let i = 0; i < nA; i++) {
    const cx = -W / 2 + pw + ow / 2 + i * (ow + pw);
    const h = new THREE.Path();
    h.moveTo(cx - ow / 2, 0.07); h.lineTo(cx - ow / 2, archRect); h.absarc(cx, archRect, ow / 2, Math.PI, 0, true); h.lineTo(cx + ow / 2, 0.07); h.lineTo(cx - ow / 2, 0.07);
    s.holes.push(h);
    if (winW) { const w = new THREE.Path(); w.moveTo(cx - winW / 2, winY); w.lineTo(cx + winW / 2, winY); w.lineTo(cx + winW / 2, winY + winH); w.lineTo(cx - winW / 2, winY + winH); w.lineTo(cx - winW / 2, winY); s.holes.push(w); }
  }
  const g = new THREE.ExtrudeGeometry(s, { depth: thick, bevelEnabled: false, curveSegments: 14 });
  return g; // z de 0 a thick
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

// texturas de canvas: placas com algarismos, relógio, sigla Ψ
function textTexture(text, { w = 512, h = 256, bg = "#3A2E28", fg = "#F4ECDD", size = 168, weight = 700 } = {}) {
  const c = document.createElement("canvas"); c.width = w; c.height = h;
  const g = c.getContext("2d");
  g.fillStyle = bg; g.fillRect(0, 0, w, h);
  g.strokeStyle = fg; g.globalAlpha = 0.35; g.lineWidth = 6; g.strokeRect(14, 14, w - 28, h - 28); g.globalAlpha = 1;
  g.fillStyle = fg; g.font = `${weight} ${size}px "Helvetica Neue", Helvetica, Arial, "DejaVu Sans", sans-serif`; g.textAlign = "center"; g.textBaseline = "middle";
  g.fillText(text, w / 2, h / 2 + size * 0.04);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
}
function clockTexture() {
  const c = document.createElement("canvas"); c.width = c.height = 160;
  const g = c.getContext("2d"), m = 80;
  g.fillStyle = "#2E2622"; g.beginPath(); g.arc(m, m, 78, 0, TAU); g.fill();
  g.fillStyle = "#F7F0E0"; g.beginPath(); g.arc(m, m, 66, 0, TAU); g.fill();
  g.strokeStyle = "#2E2622"; g.lineCap = "round";
  for (let i = 0; i < 12; i++) { const a = (i / 12) * TAU; g.lineWidth = i % 3 ? 4 : 8; g.beginPath(); g.moveTo(m + Math.sin(a) * 52, m - Math.cos(a) * 52); g.lineTo(m + Math.sin(a) * 61, m - Math.cos(a) * 61); g.stroke(); }
  g.lineWidth = 9; g.beginPath(); g.moveTo(m, m); g.lineTo(m + Math.sin(-0.5) * 34, m - Math.cos(-0.5) * 34); g.stroke();
  g.lineWidth = 6; g.beginPath(); g.moveTo(m, m); g.lineTo(m + Math.sin(2.0) * 50, m - Math.cos(2.0) * 50); g.stroke();
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
}
function psiTexture() {
  const c = document.createElement("canvas"); c.width = c.height = 160;
  const g = c.getContext("2d"), m = 80;
  g.fillStyle = "#F4ECDD"; g.beginPath(); g.arc(m, m, 78, 0, TAU); g.fill();
  g.strokeStyle = "#2C5D66"; g.lineWidth = 12; g.lineCap = "round";
  g.beginPath(); g.moveTo(m, 30); g.lineTo(m, 132); g.stroke();
  g.beginPath(); g.moveTo(m - 36, 42); g.lineTo(m - 36, 72); g.arc(m, 72, 36, Math.PI, 0, true); g.lineTo(m + 36, 42); g.stroke();
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
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
const decal = (tex, w, h) => new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshStandardMaterial({ map: tex, roughness: 0.85, alphaTest: 0.5 }));

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
    // T0: do consultório até ao pé da escada
    pathRun([[-3.9, 6.05], [-3.0, 6.35], [-1.9, 6.3], [s0[0] - 0.1, s0[1] + 0.05]], 0, 1.0);
    // T1: escada -> ao longo do terraço -> pé da escada da ponte
    pathRun([[ST0.x, ST0.z - 0.1], [-1.0, 3.9], [-1.9, 2.8], [-2.2, 1.5], [bf[0] + 0.15, bf[1] + 0.1]], Y1, 1.0);
    // ramais: escola e instituições
    pathRun([[-1.85, 3.0], [-2.8, 3.1], [-3.6, 3.15]], Y1, 0.85);
    pathRun([[-2.2, 0.9], [-3.0, 0.2], [-3.7, -0.5]], Y1, 0.85);
    // T3: da ponte ao edifício
    pathRun([[be[0] + 0.25, be[1] - 0.05], [2.55, -1.0], [2.8, -1.7], [2.95, -2.3]], Y3, 0.95);
    grpTiles = P(0, 0, 0.5); grpTiles.add(mesh(mergeGeometries(tiles), mTile, { cast: false }));
  }

  // ================= MARCOS =================
  // ---- 1. Clínica (2001) ----
  const clinic = P(-4.2, 4.8, 0.15); clinic.rotation.y = 0.5;
  {
    const B = bucket(), mBody = M.clay(C.ochre, { rough: 0.85, bump: 0.35 }), mRoof = M.clay(C.roof, { rough: 0.85, bump: 0.4 });
    B.box(2.3, 0.1, 2.0, mStone2, [0, 0.05, 0.1], { r: 0.04 });
    B.box(1.7, 1.1, 1.35, mBody, [0, 0.1 + 0.55, 0], { r: 0.05 });
    B.add(gable(1.9, 1.35, 0.74, 0.12), mRoof, { p: [0, 1.2, 0] });
    B.box(0.28, 0.65, 0.28, mStone, [0.5, 1.62, -0.2], { r: 0.03 });
    B.box(0.4, 0.74, 0.06, mInk, [-0.4, 0.1 + 0.37, 0.7], { r: 0.02 });
    B.box(0.54, 0.06, 0.1, mStone, [-0.4, 0.1 + 0.78, 0.71], { r: 0.02 });
    B.box(0.44, 0.4, 0.06, mWin, [0.52, 0.1 + 0.66, 0.7], { r: 0.02 });
    B.box(0.56, 0.05, 0.12, mStone, [0.52, 0.1 + 0.43, 0.73], { r: 0.02 });
    B.box(0.66, 0.1, 0.42, mStone, [-0.4, 0.15, 0.94], { r: 0.03 });
    B.build(clinic);
    const psi = decal(psiTexture(), 0.3, 0.3); psi.position.set(0.05, 0.1 + 0.66, 0.705); clinic.add(psi);
    const cs = contact(1.7, 0.8); cs.scale.set(1.2, 1, 1); clinic.add(cs);
  }
  // placa "2001"
  const plaque1 = P(-2.4, 4.9, 0.6); plaque1.rotation.y = 0.22;
  {
    const B = bucket(); B.box(1.5, 0.8, 0.16, mInk, [0, 0.4, 0], { r: 0.05 }); B.box(1.75, 0.1, 0.5, mStone2, [0, 0.05, 0.06], { r: 0.04 }); B.build(plaque1);
    const d = decal(textTexture("2001"), 1.3, 0.65); d.position.set(0, 0.43, 0.085); plaque1.add(d);
  }

  // ---- 2. Escola ----
  const school = P(-4.6, 1.1, 0.2, Y1); school.rotation.y = 0.25;
  {
    const B = bucket(), mBody = M.clay("#F1E6CE", { rough: 0.85, bump: 0.3 }), mRoof = M.clay(C.roof, { rough: 0.85, bump: 0.4 }), mCap = M.clay(C.ochreD, { rough: 0.8, bump: 0.3 });
    B.box(3.2, 0.14, 2.2, mStone2, [0, 0.07, 0.05], { r: 0.04 });
    B.box(2.9, 1.2, 1.6, mBody, [0, 0.14 + 0.6, 0], { r: 0.05 });
    B.add(gable(3.15, 1.6, 0.65, 0.15), mRoof, { p: [0, 1.34, 0] });
    B.box(0.95, 1.2, 0.28, mBody, [0.35, 0.14 + 0.6, 0.9], { r: 0.05 });
    B.box(0.44, 0.8, 0.06, mInk, [0.35, 0.14 + 0.4, 1.06], { r: 0.02 });
    B.box(0.66, 0.08, 0.12, mStone, [0.35, 0.14 + 0.86, 1.06], { r: 0.02 });
    B.box(0.85, 0.08, 0.34, mStone, [0.35, 0.18, 1.2], { r: 0.03 });
    [-0.35, 0.05, 0.95, 1.25].forEach((x) => { if (Math.abs(x) < 1.4) { B.box(0.3, 0.5, 0.06, mWin, [x, 0.14 + 0.7, 0.82], { r: 0.02 }); B.box(0.4, 0.05, 0.1, mStone, [x, 0.14 + 0.43, 0.84], { r: 0.02 }); } });
    // torre do relógio no extremo esquerdo
    const tx = -1.0;
    B.box(0.9, 1.3, 0.9, mBody, [tx, 1.25 + 0.65, 0.05], { r: 0.05 });
    B.box(1.05, 0.1, 1.05, mStone, [tx, 2.6, 0.05], { r: 0.03 });
    B.add(new THREE.ConeGeometry(0.78, 0.75, 4), mCap, { p: [tx, 2.65 + 0.375, 0.05], r: [0, Math.PI / 4, 0] });
    B.add(new THREE.SphereGeometry(0.065, 10, 8), mCap, { p: [tx, 3.5, 0.05] });
    B.build(school);
    const cl = decal(clockTexture(), 0.56, 0.56); cl.position.set(tx, 2.0, 0.05 + 0.455); school.add(cl);
    const cs = contact(2.2, 0.7); cs.scale.set(1.3, 1, 0.85); school.add(cs);
  }

  // ---- 3. Instituições (arcadas) ----
  const inst = P(-3.4, -3.5, 0.25, Y1); inst.rotation.y = -0.25;
  {
    const B = bucket(), mBody = M.clay("#F1E6CE", { rough: 0.85, bump: 0.3 }), mFac = M.clay("#F6EEDC", { rough: 0.8, bump: 0.25 }), mDome = M.clay(C.tealL, { rough: 0.7, bump: 0.2 }), mCor = M.clay("#DCC79F", { rough: 0.8, bump: 0.3 }), mOchre = M.clay(C.ochreD, { rough: 0.7, bump: 0.2 });
    const W = 3.5, H = 2.3, PODH = 0.8, D = 1.5;
    B.box(W + 0.5, PODH, 2.3, mStone2, [0, PODH / 2, -0.15], { r: 0.05 });
    for (let i = 0; i < 3; i++) { const h = PODH - (i + 1) * 0.2; B.box(W + 0.3 - i * 0.2, h, 0.42, mStone, [0, h / 2, 1.0 + 0.21 + i * 0.42], { r: 0.03 }); }
    B.box(W, H, D, mBody, [0, PODH + H / 2, -0.4], { r: 0.04 });
    B.box(W - 0.08, H - 0.1, 0.05, mDark, [0, PODH + H / 2 - 0.02, 0.375], { r: 0.01 });
    B.box(W + 0.3, 0.17, D + 0.5, mCor, [0, PODH + H + 0.085, 0.0], { r: 0.04 });
    B.box(1.4, 0.5, 0.9, mFac, [0, PODH + H + 0.17 + 0.25, -0.2], { r: 0.04 });
    B.add(new THREE.CylinderGeometry(0.56, 0.6, 0.28, 32), mFac, { p: [0, PODH + H + 0.17 + 0.5 + 0.14, -0.2] });
    B.add(new THREE.SphereGeometry(0.56, 32, 16, 0, TAU, 0, Math.PI / 2), mDome, { p: [0, PODH + H + 0.17 + 0.78, -0.2] });
    B.add(new THREE.SphereGeometry(0.075, 12, 10), mOchre, { p: [0, PODH + H + 0.17 + 0.78 + 0.6, -0.2] });
    B.build(inst);
    const fac = mesh(arcade(W, H, 4, 0.54, 1.15, 1.7, 0.3, 0.4, 0.62), mFac); fac.position.set(0, PODH, 0.32); inst.add(fac);
    const cs = contact(2.7, 0.7); cs.scale.set(1.3, 1, 1.0); inst.add(cs);
  }

  // ---- 5. FMUP ----
  const fmup = P(3.85, -3.3, 0.1, Y3); fmup.rotation.y = 0.2;
  {
    const B = bucket(), mSage = M.clay(C.sage, { rough: 0.8, bump: 0.3 }), mCore = M.clay(C.teal, { rough: 0.7, bump: 0.25 }), mRoofP = M.clay(C.stone, { rough: 0.7, bump: 0.2 });
    B.box(3.6, 0.16, 2.0, mStone2, [0, 0.08, 0], { r: 0.04 });
    B.box(2.3, 3.1, 1.7, mSage, [-0.5, 0.16 + 1.55, 0], { r: 0.05 });
    B.box(1.0, 4.8, 1.7, mCore, [1.15, 0.16 + 2.4, 0], { r: 0.05 });
    B.box(2.55, 0.14, 1.95, mRoofP, [-0.5, 0.16 + 3.1 + 0.07, 0.02], { r: 0.04 });
    B.box(1.2, 0.14, 1.95, mRoofP, [1.15, 0.16 + 4.8 + 0.07, 0.02], { r: 0.04 });
    [0.8, 1.45, 2.1, 2.75].forEach((y) => { B.box(1.85, 0.32, 0.07, mWin, [-0.5, y + 0.16, 0.84], { r: 0.02 }); });
    B.box(0.28, 0.98, 0.12, mStone, [1.15, 0.16 + 3.85, 0.9], { r: 0.03 });
    B.box(0.98, 0.28, 0.12, mStone, [1.15, 0.16 + 3.97, 0.9], { r: 0.03 });
    B.box(0.5, 0.86, 0.06, mInk, [-1.1, 0.16 + 0.43, 0.86], { r: 0.02 });
    B.box(1.0, 0.07, 0.55, mRoofP, [-1.1, 0.16 + 1.02, 1.08], { r: 0.02 });
    B.box(0.06, 0.96, 0.06, mStone, [-1.52, 0.16 + 0.5, 1.3], { r: 0.02 });
    B.build(fmup);
    const cs = contact(2.6, 0.7); cs.scale.set(1.35, 1, 0.9); fmup.add(cs);
  }
  // gráfico de barras crescente (à frente do edifício)
  const barsInfo = [], chart = P(4.6, -1.1, 0.4, Y3); chart.rotation.y = 0.2;
  {
    const mBase = M.clay(C.stone2, { rough: 0.85, bump: 0.25 }), B = bucket();
    B.box(2.7, 0.08, 0.66, mBase, [0, 0.04, 0], { r: 0.03 }); B.build(chart);
    const H = [0.5, 0.85, 1.2, 1.6, 2.05, 2.55], cols = ["#EDDDB6", "#E9CC82", "#E0B75E", "#D0A03E", "#BB8528", "#9C6B1D"];
    H.forEach((h, i) => {
      const geo = rbox(0.34, h, 0.36, 0.05, 2); geo.translate(0, h / 2, 0);
      const b = mesh(geo, M.clay(cols[i], { rough: 0.6, bump: 0.15 })); b.position.set(-1.05 + i * 0.42, 0.08, 0); chart.add(b); barsInfo.push({ m: b, i });
    });
  }
  // placa "2026"
  const plaque2 = P(3.75, 0.3, 0.7, Y3); plaque2.rotation.y = 0.12;
  {
    const B = bucket(); B.box(1.3, 0.74, 0.14, mInk, [0, 0.37, 0], { r: 0.05 }); B.box(1.5, 0.1, 0.46, mStone2, [0, 0.05, 0.05], { r: 0.04 }); B.build(plaque2);
    const d = decal(textTexture("2026"), 1.14, 0.58); d.position.set(0, 0.4, 0.075); plaque2.add(d);
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
