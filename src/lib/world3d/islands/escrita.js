// Ilha 3 — Escrita: "o arquivo". Um livro aberto num atril de pedra, folhas que sobem em espiral,
// uma estante de arquivo (40+ lombadas), pilhas de revistas/jornais e uma caneta-tinteiro como obelisco.
import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { PAL } from "../materials.js";
import { makeIsland } from "../island.js";
import { mesh, rbox, TAU, rng } from "../util.js";
import { popper, contact, cypress } from "./kit.js";

/* ------------------------------------------------------------------------------------------------
   Texto simulado: faixas finas (ribbons) coladas a uma superfície, acumuladas num só BufferGeometry
   com cor por vértice. Tudo o que é "escrita" nesta ilha (livro, folhas, revistas) passa por aqui.
------------------------------------------------------------------------------------------------ */
function makeBatch() {
  const pos = [], nrm = [], uv = [], col = [], idx = [], c = new THREE.Color();
  const B = {
    // faixa entre pontos consecutivos; wv = vector unitário da largura; half = meia-largura
    strip(pts, nrms, wv, half, color) {
      c.set(color); const base = pos.length / 3;
      pts.forEach((p, i) => {
        const n = nrms[i];
        pos.push(p[0] - wv[0] * half, p[1] - wv[1] * half, p[2] - wv[2] * half, p[0] + wv[0] * half, p[1] + wv[1] * half, p[2] + wv[2] * half);
        nrm.push(n[0], n[1], n[2], n[0], n[1], n[2]); uv.push(0, 0, 0, 0); col.push(c.r, c.g, c.b, c.r, c.g, c.b);
      });
      const a = pts[0], b = pts[1], e1 = [wv[0] * 2 * half, wv[1] * 2 * half, wv[2] * 2 * half], e2 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
      const cr = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]];
      const flip = cr[0] * nrms[0][0] + cr[1] * nrms[0][1] + cr[2] * nrms[0][2] < 0;
      for (let i = 0; i < pts.length - 1; i++) { const k = base + i * 2; if (!flip) idx.push(k, k + 1, k + 2, k + 1, k + 3, k + 2); else idx.push(k, k + 2, k + 1, k + 1, k + 2, k + 3); }
    },
    // linha de texto ao longo de x (segue a superfície surf(x) -> y)
    line(x0, x1, zc, th, surf, color, lift = 0) {
      const n = Math.max(1, Math.ceil(Math.abs(x1 - x0) / 0.28)), pts = [], nr = [], e = 0.01;
      for (let i = 0; i <= n; i++) { const x = x0 + ((x1 - x0) * i) / n, s = (surf(x + e) - surf(x - e)) / (2 * e), l = Math.hypot(s, 1); pts.push([x, surf(x) + lift, zc]); nr.push([-s / l, 1 / l, 0]); }
      B.strip(pts, nr, [0, 0, 1], th / 2, color);
    },
    // filete vertical (ao longo de z) a x fixo
    vrule(x, z0, z1, tx, surf, color) {
      const e = 0.01, s = (surf(x + e) - surf(x - e)) / (2 * e), l = Math.hypot(s, 1), n = [-s / l, 1 / l, 0], y = surf(x);
      B.strip([[x, y, z0], [x, y, z1]], [n, n], [1, 0, 0], tx / 2, color);
    },
    geo() {
      const g = new THREE.BufferGeometry();
      g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute("normal", new THREE.Float32BufferAttribute(nrm, 3));
      g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2)); g.setAttribute("color", new THREE.Float32BufferAttribute(col, 3)); g.setIndex(idx);
      return g.toNonIndexed();   // rbox() é não-indexado: todas as peças fundidas têm de o ser
    },
  };
  return B;
}

const paint = (geo, color) => { const c = new THREE.Color(color), n = geo.attributes.position.count, a = new Float32Array(n * 3); for (let i = 0; i < n; i++) a.set([c.r, c.g, c.b], i * 3); geo.setAttribute("color", new THREE.BufferAttribute(a, 3)); return geo; };

// parágrafos: blocos de 3–7 linhas, a última mais curta, com uma linha de intervalo
function layoutLines(rnd, slots) {
  const out = []; let k = 0;
  while (k < slots) { const len = 3 + Math.floor(rnd() * 5); for (let j = 0; j < len && k < slots; j++, k++) out.push({ k, f: j === len - 1 ? 0.22 + rnd() * 0.5 : 1 }); k += 1; }
  return out;
}
const INK = ["#6A5B4F", "#76675A", "#62544A"];
function textCol(B, surf, xa, xb, z0, slots, pitch, th, rnd, { off = {}, mark = -1 } = {}) {
  let marked = null;
  layoutLines(rnd, slots).forEach(({ k, f }) => {
    const zc = z0 + k * pitch, xs = xa + (off[k] || 0);
    if (k === mark) { B.line(xs, xb, zc, th * 1.35, surf, "#3B302A"); marked = { x0: xs, x1: xb, zc }; return; }
    B.line(xs, xs + (xb - xs) * f, zc, th, surf, INK[Math.floor(rnd() * INK.length)]);
  });
  return marked;
}

/* Folhas soltas. Geometria "deitada" (normal +y, topo da página em −z), espessura t centrada em y=0. */
function makeSheet(kind, w, d, t, seed, accent = PAL.teal, paperCol = "#FAF3E3", markK = -1) {
  const rnd = rng(seed), B = makeBatch(), y = t / 2 + 0.006, flat = () => y, zt = -d / 2, mx = w / 2 - 0.2;
  let mark = null;
  if (kind === "essay") {
    B.line(-w / 2 + 0.02, w / 2 - 0.02, zt + 0.15, 0.26, flat, accent);                    // faixa de cabeçalho
    B.line(-mx, mx * 0.55, zt + 0.46, 0.1, flat, "#3B302A");                               // título
    B.line(-mx, mx * 0.05, zt + 0.62, 0.1, flat, "#3B302A");
    B.line(-mx, -mx * 0.35, zt + 0.79, 0.045, flat, accent);                               // assinatura
    const z0 = zt + 0.98, pitch = 0.15, slots = Math.floor((d - 0.98 - 0.18) / pitch);
    mark = textCol(B, flat, -mx, -0.04, z0, slots, pitch, 0.068, rnd, { mark: markK });
    textCol(B, flat, 0.04, mx, z0, slots, pitch, 0.068, rnd);
  } else if (kind === "magazine") {
    const cw = w - 0.14, ch = d - 0.14;
    B.line(-cw / 2, cw / 2, 0, ch, flat, accent);                                          // capa a cor
    B.line(-cw / 2 + 0.1, cw / 2 - 0.1, zt + 0.32, 0.22, flat, "#FBF6EC", 0.004);          // título da revista
    B.line(-cw / 2 + 0.1, -0.05, zt + 0.5, 0.045, flat, "#F1E1BF", 0.004);
    B.line(-cw / 2 + 0.1, cw / 2 - 0.1, -0.02, 0.56, flat, "#E9D9BD", 0.004);              // imagem
    B.line(-cw / 2 + 0.1, 0.02, 0.1, 0.34, flat, "#7E9078", 0.008);
    B.line(-0.05, cw / 2 - 0.1, -0.14, 0.24, flat, "#EBC878", 0.012);
    B.line(-cw / 2 + 0.1, cw / 2 - 0.25, 0.5, 0.075, flat, "#FBF6EC", 0.004);
    B.line(-cw / 2 + 0.1, cw / 2 - 0.5, 0.65, 0.075, flat, "#FBF6EC", 0.004);
    B.line(-cw / 2 + 0.1, cw / 2 - 0.85, 0.8, 0.05, flat, "#F1E1BF", 0.004);
  } else { // jornal
    B.line(-w / 2 + 0.16, w / 2 - 0.16, zt + 0.22, 0.2, flat, "#2E2622");                   // cabeçalho
    B.line(-w / 2 + 0.16, w / 2 - 0.16, zt + 0.38, 0.03, flat, "#5A4B40");
    const c0 = -w / 2 + 0.16, cw = (w - 0.32 - 0.24) / 3;
    B.line(c0, c0 + cw * 2 + 0.12, zt + 0.55, 0.14, flat, "#3B302A");                      // manchete
    B.line(c0, c0 + cw * 1.3, zt + 0.74, 0.14, flat, "#3B302A");
    B.line(c0, c0 + cw * 2 + 0.12, zt + 1.12, 0.6, flat, "#CDBFA5");                       // fotografia
    B.line(c0 + 0.15, c0 + cw + 0.4, zt + 1.22, 0.3, flat, "#A7A08A", 0.004);
    for (let k = 0; k < 3; k++) { const x0 = c0 + k * (cw + 0.12), z0 = k === 2 ? zt + 0.58 : zt + 1.58, slots = Math.floor((d / 2 - 0.15 - z0) / 0.12); textCol(B, flat, x0, x0 + cw, z0, slots, 0.12, 0.05, rnd); }
  }
  const paper = paint(rbox(w, t, d, Math.min(0.02, t * 0.4), 2), paperCol);
  return { geo: mergeGeometries([paper, B.geo()]), mark };
}

export function buildEscrita(M) {
  const g = new THREE.Group(), pops = [], P = popper(g, pops), R = rng(41);
  const isl = makeIsland(M, { R: 7.0, top: "#C9B08A", soil: PAL.soil, rock: ["#C09777", "#8C6650"], seed: 31, depth: 8.0, wob: 0.06 });
  g.add(isl.group);

  const stone = M.clay("#F1E7D2", { rough: 0.85, bump: 0.3 }), stone2 = M.clay(PAL.sand2, { rough: 0.9, bump: 0.3 });
  const pageM = M.clay("#F8F1E0", { rough: 0.8, bump: 0.12 });
  const inkM = M.clay("#ffffff", { vertexColors: true, rough: 0.85, noBump: true });
  const sheetM = M.clay("#ffffff", { vertexColors: true, rough: 0.86, bump: 0.1 });
  const leather = M.clay("#8E3F2C", { rough: 0.7, bump: 0.45 });

  /* ============================== HERÓI: livro aberto sobre atril ============================== */
  const HX = 0.3, HZ = 0.3, plinth = P(HX, HZ, 0.0), hero = P(HX, HZ, 0.1);   // plinto primeiro, livro a seguir
  const STEP_TOP = 0.62, ZF = 1.95, ZB = -1.75, HF = 0.35, HB = 3.25, WW = 5.9;
  {
    const b1 = mesh(rbox(6.9, 0.3, 5.0, 0.1), stone2); b1.position.y = 0.15; plinth.add(b1);
    const b2 = mesh(rbox(6.3, 0.32, 4.5, 0.1), stone); b2.position.y = 0.46; plinth.add(b2);
    const sh = new THREE.Shape(); sh.moveTo(-ZF, 0); sh.lineTo(-ZF, HF); sh.lineTo(-ZB, HB); sh.lineTo(-ZB, 0); sh.closePath();
    const wg = new THREE.ExtrudeGeometry(sh, { depth: WW, bevelEnabled: true, bevelSize: 0.08, bevelThickness: 0.08, bevelSegments: 3, curveSegments: 1 });
    wg.translate(0, 0, -WW / 2); wg.rotateY(Math.PI / 2);
    const wedge = mesh(wg, stone); wedge.position.y = STEP_TOP; plinth.add(wedge);
    const cs = contact(1, 0.95); cs.scale.set(4.1, 3.2, 1); plinth.add(cs);

    // livro (referencial próprio: y = normal ao atril, z = profundidade, topo da página em −z)
    const th = Math.atan2(HB - HF, ZF - ZB), n = [Math.cos(th), Math.sin(th)], mid = [(ZF + ZB) / 2, STEP_TOP + (HF + HB) / 2];
    const bk = new THREE.Group(); bk.position.set(0, mid[1] + n[0] * 0.085, mid[0] + n[1] * 0.085); bk.rotation.x = th; hero.add(bk);

    const D = 3.8, Wp = 2.5, bs = 0.03, bt = 0.03;
    const topY = (x) => { x = Math.abs(x); return 0.14 + 0.5 * (1 - Math.exp(-x / 0.7)) - 0.04 * x; };   // perfil da página (do vinco para fora)
    const surf = (x) => topY(x) + 2 * bs + 0.014;                                                       // superfície onde assenta o texto
    const block = (side) => {
      const s = new THREE.Shape(), N = 22, xs = []; for (let i = 0; i <= N; i++) xs.push(0.03 + ((Wp - 0.03) * i) / N);
      s.moveTo(side * 0.03, 0); s.lineTo(side * Wp, 0); for (let i = N; i >= 0; i--) s.lineTo(side * xs[i], topY(xs[i])); s.lineTo(side * 0.03, 0);
      const geo = new THREE.ExtrudeGeometry(s, { depth: D, bevelEnabled: true, bevelSize: bs, bevelThickness: bt, bevelSegments: 2, curveSegments: 1 });
      geo.translate(0, bs, -D / 2); return geo;
    };
    [-1, 1].forEach((side) => { const m = mesh(block(side), pageM); bk.add(m); });
    // capas (couro) + lombada
    [-1, 1].forEach((side) => { const c = mesh(rbox(2.8, 0.11, D + 0.36, 0.05), leather); c.position.set(side * 1.4, -0.055, 0); bk.add(c); });
    const spine = mesh(new THREE.CylinderGeometry(0.1, 0.1, D + 0.36, 16), leather); spine.rotation.x = Math.PI / 2; spine.position.y = -0.05; bk.add(spine);
    const lip = mesh(rbox(WW - 0.3, 0.26, 0.22, 0.06), stone2); lip.position.set(0, 0.03, D / 2 + 0.36); bk.add(lip);

    // texto: duas colunas por página (margem interior 0.3, exterior 0.22, colunas de 0.93)
    const B = makeBatch(), rnd = rng(77), pitch = 0.18, th2 = 0.085, INKD = "#3B302A", FAINT = "#B9A88F";
    const C1 = [0.3, 1.23], C2 = [1.35, 2.28], OUT = 2.28;
    // página esquerda: título, subtítulo, filete, colunas com capitular
    B.line(-OUT, -1.6, -1.72, 0.05, surf, FAINT);
    B.line(-OUT, -0.7, -1.3, 0.22, surf, INKD); B.line(-OUT, -1.45, -0.98, 0.22, surf, INKD);
    B.line(-OUT, -1.35, -0.66, 0.08, surf, "#B65A3D"); B.line(-OUT, -0.3, -0.47, 0.025, surf, FAINT);
    B.line(-OUT, -1.95, -0.16, 0.34, surf, "#B65A3D");
    textCol(B, surf, -C2[1], -C2[0], -0.3, 11, pitch, th2, rnd, { off: { 0: 0.45, 1: 0.45 } });
    textCol(B, surf, -C1[1], -C1[0], -0.3, 11, pitch, th2, rnd);
    B.line(-1.45, -1.2, 1.7, 0.05, surf, FAINT);
    // página direita: figura, legenda, citação, colunas
    B.line(0.3, 2.28, -1.72, 0.05, surf, FAINT); B.line(0.3, 0.8, -1.72, 0.05, surf, FAINT);
    B.line(C1[0], C1[1], -1.0, 0.95, surf, "#7DB4B6"); B.line(C1[0], C1[1], -0.72, 0.4, surf, "#3E7F89", 0.006); B.line(0.78, 1.04, -1.25, 0.24, surf, "#EBC878", 0.012);
    B.line(C1[0], 1.0, -0.34, 0.05, surf, "#9C8B78");
    textCol(B, surf, C1[0], C1[1], -0.1, 8, pitch, th2, rnd);
    B.vrule(C2[0] + 0.02, -1.45, -0.62, 0.06, surf, "#D9A441");
    B.line(C2[0] + 0.16, C2[1], -1.36, 0.12, surf, "#B07F26"); B.line(C2[0] + 0.16, C2[1], -1.16, 0.12, surf, "#B07F26"); B.line(C2[0] + 0.16, 2.0, -0.96, 0.12, surf, "#B07F26");
    textCol(B, surf, C2[0], C2[1], -0.3, 11, pitch, th2, rnd);
    B.line(1.95, OUT, 1.7, 0.05, surf, FAINT);
    B.vrule(0, -D / 2 + 0.05, D / 2 - 0.05, 0.05, () => topY(0.03) + 2 * bs + 0.03, "#B5A489");     // vinco
    bk.add(mesh(B.geo(), inkM, { cast: false }));
    // marcador de fita
    const rib = mesh(rbox(0.13, 0.03, 1.9, 0.012), M.clay(PAL.teal, { rough: 0.6, noBump: true }), { cast: false }); rib.position.set(0.22, surf(0.22) + 0.006, 1.05); bk.add(rib);
    const rib2 = mesh(rbox(0.13, 0.03, 0.62, 0.012), M.clay(PAL.teal, { rough: 0.6, noBump: true }), { cast: false }); rib2.geometry.translate(0, 0, 0.31); rib2.position.set(0.22, 0.17, D / 2 + 0.02); rib2.rotation.x = -0.75; bk.add(rib2);
  }

  /* ============================== Folhas a subir em espiral ============================== */
  // hélice que se alarga ao subir. Projecção no ecrã: ys = 0.868·y − 0.497·z (câmara ~30° acima do plano).
  const ROOT_Y = 2.42, leafRootA = P(HX, HZ, 0.24, ROOT_Y), leafRootB = P(HX, HZ, 0.38, ROOT_Y), leaves = [];   // as folhas altas nascem um pouco depois
  const liveMat = M.glow("#FF4A28", { ei: 1.8 }).clone();
  const NL = 9, LIVE = 8, LW = 1.6, LD = 2.24;
  const acc = [PAL.ochre, PAL.teal, PAL.terra, PAL.sage, PAL.ochre, PAL.teal, PAL.terra, PAL.sage, PAL.ochre];
  const paperT = ["#FAF3E3", "#F6EEDA", "#FBF6EC"];
  let under = null;
  const HEL = { th0: 43, dth: 44, r0: 2.6, r1: 3.6, ys0: 5.5, ys1: 8.8, cx: 0.0 };
  for (let i = 0; i < NL; i++) {
    const k = i / (NL - 1), th = ((HEL.th0 + i * HEL.dth) * Math.PI) / 180, rr = HEL.r0 + (HEL.r1 - HEL.r0) * Math.pow(k, 0.9);
    const x = HEL.cx + Math.sin(th) * rr, zl = Math.cos(th) * rr * 0.85 - 0.2, ys = HEL.ys0 + (HEL.ys1 - HEL.ys0) * k;
    const y = (ys + 0.497 * (HZ + zl)) / 0.868 - ROOT_Y, sc = 0.95 + 0.32 * k + (R() - 0.5) * 0.06;
    const { geo, mark } = makeSheet("essay", LW, LD, 0.045, 300 + i * 7, acc[i], paperT[i % 3], i === LIVE ? 3 : -1);
    geo.rotateX(Math.PI / 2);
    const leaf = new THREE.Group(); leaf.rotation.order = "YXZ";
    leaf.add(mesh(geo, sheetM)); leaf.scale.setScalar(sc);
    if (i === LIVE && mark) {
      // sublinhado vermelhão emissivo sob a linha marcada (a "linha viva"); o geometry foi rodado: (x, y, z) -> (x, -z, y)
      const len = (mark.x1 - mark.x0) * 0.96, u = mesh(rbox(len, 0.085, 0.05, 0.03), liveMat, { cast: false });
      u.position.set((mark.x0 + mark.x1) / 2 - (mark.x1 - mark.x0) * 0.02, -(mark.zc + 0.085), 0.05); leaf.add(u); under = u;
    }
    // as primeiras folhas descolam quase deitadas; as altas viram-se para a câmara
    const rx = -1.05 + 0.75 * Math.pow(k, 0.7) - R() * 0.06, ry = Math.sin(th) * 0.32 + (R() - 0.5) * 0.25, rz = -Math.cos(th) * 0.16 + (R() - 0.5) * 0.14;
    leaf.userData = { x, y, z: zl, ph: R() * TAU, ph2: R() * TAU, rx, ry, rz };
    if (i === LIVE) Object.assign(leaf.userData, { rx: -0.55, ry: -0.08, rz: 0.04, live: true });
    leaf.position.set(x, y, zl); leaf.rotation.set(leaf.userData.rx, leaf.userData.ry, leaf.userData.rz);
    (i < 5 ? leafRootA : leafRootB).add(leaf); leaves.push(leaf);
  }
  g.updateMatrixWorld(true);
  const tp = new THREE.Vector3(); under.getWorldPosition(tp); tp.add(new THREE.Vector3(0, 0, 1).transformDirection(under.matrixWorld).multiplyScalar(0.3));

  /* ============================== Estante de arquivo (fundo-esquerda) ============================== */
  const shelf = P(-4.7, -2.3, 0.4); shelf.rotation.y = 0.45;
  {
    const SW = 3.9, SD = 0.95, F0 = 0.36, TH = 1.12, top = F0 + TH * 3;
    const frame = [], back = [];
    const box = (arr, w, h, d, x, y, z, r = 0.04) => { const b = rbox(w, h, d, r, 2); b.translate(x, y, z); arr.push(b); };
    box(frame, SW + 0.36, 0.22, SD + 0.16, 0, 0.11, 0.02, 0.05);
    for (let k = 0; k <= 3; k++) box(frame, SW, 0.14, SD, 0, F0 + TH * k - 0.07, 0);
    [-1, 1].forEach((s) => box(frame, 0.16, top, SD, s * (SW / 2 + 0.08), top / 2, 0));
    box(back, SW, top - 0.22, 0.06, 0, 0.22 + (top - 0.22) / 2, -SD / 2 + 0.05, 0.02);
    shelf.add(mesh(mergeGeometries(frame), M.clay("#EFE3CA", { rough: 0.85, bump: 0.3 })), mesh(mergeGeometries(back), M.clay("#6B5142", { rough: 0.95, bump: 0.3 }), { cast: false }));

    const SPN = ["#EFE3CA", "#EFE3CA", "#E2D0AB", "#E2D0AB", "#CF9A3F", "#B9553A", "#8E3F2C", "#7E9078", "#A9B99C", "#3E7F89", "#2C5D66", "#8A5878", "#4A3E36"];
    const LBL = ["#FBF6EC", "#EBC878", "#E9D9BD"];
    const items = [], rs = rng(19);
    for (let k = 0; k < 3; k++) {
      let x = -SW / 2 + 0.07; const fl = F0 + TH * k;
      while (x < SW / 2 - 0.55) { const w = 0.12 + rs() * 0.11, h = 0.66 + rs() * 0.3, d = 0.62 + rs() * 0.18; items.push({ x: x + w / 2, fl, w, h, d, c: SPN[Math.floor(rs() * SPN.length)], lean: 0 }); x += w + 0.008 + (rs() < 0.06 ? 0.08 : 0); }
      const nl = k === 1 ? 0 : 2; for (let j = 0; j < nl; j++) { const w = 0.17 + rs() * 0.06, h = 0.78 + rs() * 0.12; items.push({ x: x + w / 2 + 0.1 + j * 0.2, fl, w, h, d: 0.7, c: SPN[Math.floor(rs() * SPN.length)], lean: 0.2 + j * 0.05 }); }
    }
    const nS = items.length, spines = new THREE.InstancedMesh(rbox(1, 1, 1, 0.14, 1), M.clay("#ffffff", { rough: 0.78, bump: 0.3 }), nS);
    const labels = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), M.clay("#ffffff", { rough: 0.8, noBump: true }), nS * 2);
    const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), pv = new THREE.Vector3(), sv = new THREE.Vector3(), col = new THREE.Color(), ax = new THREE.Vector3(0, 0, 1);
    let li = 0; const zf = SD / 2 - 0.08;
    items.forEach((b, i) => {
      const sn = Math.sin(b.lean), cn = Math.cos(b.lean);
      q.setFromAxisAngle(ax, b.lean); pv.set(b.x - sn * b.h / 2, b.fl + cn * b.h / 2, zf - b.d / 2);
      m4.compose(pv, q, sv.set(b.w, b.h, b.d)); spines.setMatrixAt(i, m4); spines.setColorAt(i, col.set(b.c));
      const nb = rs() < 0.85 ? (rs() < 0.5 ? 1 : 2) : 0;
      for (let j = 0; j < 2; j++) {
        if (j >= nb) { m4.compose(pv.set(0, -9, 0), q.identity(), sv.set(0.0001, 0.0001, 0.0001)); labels.setMatrixAt(li, m4); labels.setColorAt(li++, col.set("#000")); continue; }
        const hh = 0.06 + rs() * 0.05, fy = j === 0 ? 0.68 : 0.34;
        q.setFromAxisAngle(ax, b.lean); pv.set(b.x - sn * b.h * fy, b.fl + cn * b.h * fy, zf + 0.008);
        m4.compose(pv, q, sv.set(b.w + 0.004, hh, 0.02)); labels.setMatrixAt(li, m4); labels.setColorAt(li++, col.set(LBL[Math.floor(rs() * LBL.length)]));
      }
    });
    [spines, labels].forEach((im) => { im.instanceMatrix.needsUpdate = true; im.instanceColor.needsUpdate = true; im.castShadow = true; im.receiveShadow = true; im.frustumCulled = false; shelf.add(im); });
    // duas revistas deitadas no topo
    const tp2 = mesh(rbox(1.0, 0.12, 0.72, 0.03, 2), M.clay(PAL.teal, { rough: 0.7 })); tp2.position.set(0.9, top + 0.06, 0.02); tp2.rotation.y = 0.12; shelf.add(tp2);
    const tp3 = mesh(rbox(0.95, 0.11, 0.7, 0.03, 2), M.clay("#E2D0AB", { rough: 0.7 })); tp3.position.set(0.86, top + 0.175, 0.0); tp3.rotation.y = -0.06; shelf.add(tp3);
    const cs = contact(1, 0.9); cs.scale.set(2.6, 1.0, 1); cs.position.set(0.1, 0, 0.15); shelf.add(cs);
  }

  /* ============================== Caneta-tinteiro como obelisco ============================== */
  const pen = P(4.9, -2.6, 0.5);
  {
    const s1 = mesh(rbox(1.8, 0.3, 1.8, 0.08), stone2); s1.position.y = 0.15; pen.add(s1);
    const s2 = mesh(rbox(1.35, 0.3, 1.35, 0.08), stone); s2.position.y = 0.45; pen.add(s2);
    const body = new THREE.Group(); body.position.y = 0.6; pen.add(body);
    const V2 = (arr) => arr.map(([r, y]) => new THREE.Vector2(r, y));
    const barrel = mesh(new THREE.LatheGeometry(V2([[0.001, 0], [0.3, 0], [0.39, 0.05], [0.42, 0.16], [0.42, 3.4], [0.4, 3.62]]), 44), M.glaze("#2C5D66")); body.add(barrel);
    const grip = mesh(new THREE.LatheGeometry(V2([[0.4, 3.62], [0.36, 3.9], [0.3, 4.15], [0.26, 4.3], [0.001, 4.3]]), 44), M.glaze("#1E3F47")); body.add(grip);
    const rings = [], ring = (y, r, t) => { const tg = new THREE.TorusGeometry(r, t, 10, 44); tg.rotateX(Math.PI / 2); tg.translate(0, y, 0); rings.push(tg); };
    ring(0.5, 0.425, 0.045); ring(3.22, 0.425, 0.045); ring(3.42, 0.43, 0.06);
    body.add(mesh(mergeGeometries(rings), M.glaze(PAL.ochre)));
    // aparo
    const ns = new THREE.Shape(), pts = [], Nn = 22;
    for (let i = 0; i <= Nn; i++) { const y = (i / Nn) * 2.0; let w; if (y < 0.55) w = 0.22 + 0.15 * Math.sin((y / 0.55) * Math.PI / 2); else { const s = (y - 0.55) / 1.45; w = 0.37 * Math.pow(1 - s, 0.82) * (1 - 0.1 * s); } pts.push([Math.max(w, 0.012), y]); }
    ns.moveTo(-pts[0][0], 0); pts.forEach(([w, y]) => ns.lineTo(w, y)); for (let i = pts.length - 1; i >= 0; i--) ns.lineTo(-pts[i][0], pts[i][1]);
    const ng = new THREE.ExtrudeGeometry(ns, { depth: 0.06, bevelEnabled: true, bevelSize: 0.014, bevelThickness: 0.014, bevelSegments: 2, curveSegments: 1 }); ng.translate(0, 0, -0.03);
    const nib = mesh(ng, M.glaze("#E3B759")); nib.position.y = 4.12; body.add(nib);
    const inkD = M.clay(PAL.ink, { rough: 0.6, noBump: true });
    const hole = mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.02, 16), inkD, { cast: false }); hole.rotation.x = Math.PI / 2; hole.position.set(0, 4.12 + 0.95, 0.05); body.add(hole);
    const slit = mesh(new THREE.BoxGeometry(0.03, 0.95, 0.02), inkD, { cast: false }); slit.position.set(0, 4.12 + 1.45, 0.05); body.add(slit);
    const cs = contact(1, 0.9); cs.scale.set(1.5, 1.5, 1); pen.add(cs);
  }

  /* ============================== Pilhas de revistas e jornais ============================== */
  const stack = (x, z, ry, kind, layers, w, d, t, colors, seed) => {
    const w0 = P(x, z, 0.62 + (seed % 3) * 0.1), rs = rng(seed), geos = [], H = layers * t;
    for (let i = 0; i < layers; i++) {
      const last = i === layers - 1, j = () => (rs() - 0.5);
      const m = new THREE.Matrix4().compose(new THREE.Vector3(j() * 0.1, i * t + t / 2, j() * 0.1), new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), j() * 0.14 + (last ? 0 : 0)), new THREE.Vector3(1, 1, 1));
      const geo = last ? makeSheet(kind, w, d, t, seed * 3, colors[i % colors.length], colors[0] === "#F2EAD6" ? "#F2EAD6" : "#FAF3E3").geo : paint(rbox(w * (1 + j() * 0.04), t, d * (1 + j() * 0.04), 0.02, 2), colors[i % colors.length]);
      geo.applyMatrix4(m); geos.push(geo);
    }
    if (kind === "news") [-0.4, 0.42].forEach((sx) => geos.push(paint(rbox(0.07, H + 0.03, d + 0.03, 0.02, 2), "#A07A3C").translate(sx, H / 2, 0)));
    w0.add(mesh(mergeGeometries(geos), sheetM)); w0.rotation.y = ry;
    const cs = contact(1, 0.85); cs.scale.set(1.3, 1.3, 1); w0.add(cs);
    return w0;
  };
  const stTek = stack(3.5, 4.2, -0.32, "magazine", 7, 1.45, 1.95, 0.1, [PAL.teal, "#F6EEDA", PAL.terraL, "#F6EEDA", PAL.ochre, "#F6EEDA", PAL.terra], 5);
  const stNews = stack(5.1, 2.3, 0.5, "news", 9, 1.75, 2.3, 0.065, ["#F2EAD6", "#DCD1BA"], 8);
  const stMag = stack(1.6, 4.9, 0.25, "magazine", 4, 1.3, 1.75, 0.1, [PAL.sage, "#F6EEDA", PAL.ochreL], 11);

  /* ============================== Vegetação mínima ============================== */
  const c1 = P(6.05, 0.5, 0.85); c1.add(cypress(M, { h: 3.5, r: 0.5, seed: 3 }));
  const c2 = P(-5.7, 2.3, 0.9); c2.add(cypress(M, { h: 2.8, r: 0.44, seed: 7 }));

  /* ============================== Folhas caídas (frente-esquerda) ============================== */
  {
    const w = P(0, 0, 0.78), specs = [[-2.5, 4.55, 0.5, PAL.sage, 611], [-1.15, 5.15, -0.32, PAL.teal, 619]];
    specs.forEach(([x, z, r, ac, sd]) => { const { geo } = makeSheet("essay", 1.35, 1.85, 0.04, sd, ac, "#FAF3E3"); const m = mesh(geo, sheetM); m.position.set(x, 0.022, z); m.rotation.y = r; w.add(m); });
    const cs = contact(1, 0.7); cs.scale.set(2.6, 1.6, 1); cs.position.set(-1.8, 0, 4.8); w.add(cs);
  }

  const update = (t) => {
    isl.update(t);
    leaves.forEach((L) => {
      const u = L.userData, a = u.live ? 0.3 : 1;   // a folha do ponto vivo quase não se mexe (o fio está preso a ela)
      L.position.set(u.x + Math.sin(t * 0.35 + u.ph2) * 0.09 * a, u.y + Math.sin(t * 0.62 + u.ph) * 0.16 * a, u.z + Math.cos(t * 0.3 + u.ph) * 0.07 * a);
      L.rotation.set(u.rx + Math.sin(t * 0.5 + u.ph) * 0.05 * a, u.ry + Math.sin(t * 0.28 + u.ph2) * 0.14 * a, u.rz + Math.sin(t * 0.41 + u.ph) * 0.08 * a);
    });
    liveMat.emissiveIntensity = 1.9 + Math.sin(t * 3.0) * 0.55;
  };
  const hot = [{ id: "escrita.book", obj: hero }, { id: "escrita.arquivo", obj: shelf }, { id: "escrita.pen", obj: pen }, { id: "escrita.tek", obj: stTek }, { id: "escrita.je", obj: stNews }, { id: "escrita.ensaios", obj: stMag }];
  return { group: g, update, pops, thread: [[tp.x, tp.y, tp.z]], hot };
}
