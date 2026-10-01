// Ilha 6 — Contacto: "A ligação". Um envelope de barro aberto sobre um plinto em degraus, com o CV (A4) a subir da abertura;
// o selo de lacre vermelhão é o ponto onde o fio termina. À volta: cartas dobradas, um carimbo, um mastro de sinal discreto
// e folhas de papel a derivar. Base circular (plaza) que assenta o conjunto sobre o tampo verde-acinzentado.
import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { PAL } from "../materials.js";
import { makeIsland } from "../island.js";
import { mesh, rbox, TAU, rng } from "../util.js";
import { popper, contact, cypress, bush } from "./kit.js";

// ---------- helpers locais ----------
// disco/cilindro com arestas suavizadas (eixo y, base em y=0)
function puck(r, h, b = 0.05, seg = 48) {
  b = Math.min(b, h / 2 - 1e-3, r * 0.5);
  const pts = [[0, 0]], n = 4;
  for (let i = 0; i <= n; i++) { const a = (i / n) * Math.PI / 2; pts.push([r - b + Math.sin(a) * b, b - Math.cos(a) * b]); }
  for (let i = 0; i <= n; i++) { const a = (i / n) * Math.PI / 2; pts.push([r - b + Math.cos(a) * b, h - b + Math.sin(a) * b]); }
  pts.push([0, h]);
  return new THREE.LatheGeometry(pts.map(([x, y]) => new THREE.Vector2(x, y)), seg);
}
// polígono com cantos arredondados (Shape)
function roundedPoly(pts, r) {
  const s = new THREE.Shape(), n = pts.length;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i + n - 1) % n], p1 = pts[i], p2 = pts[(i + 1) % n];
    const d1 = new THREE.Vector2(p0[0] - p1[0], p0[1] - p1[1]), d2 = new THREE.Vector2(p2[0] - p1[0], p2[1] - p1[1]);
    const l1 = d1.length(), l2 = d2.length(); d1.normalize(); d2.normalize();
    const a = Math.min(r, l1 * 0.45, l2 * 0.45);
    const A = [p1[0] + d1.x * a, p1[1] + d1.y * a], B = [p1[0] + d2.x * a, p1[1] + d2.y * a];
    if (i === 0) s.moveTo(A[0], A[1]); else s.lineTo(A[0], A[1]);
    s.quadraticCurveTo(p1[0], p1[1], B[0], B[1]);
  }
  s.closePath(); return s;
}
// placa extrudida com bisel (z de -bev a depth+bev)
function plate(pts, depth, { r = 0.1, bev = 0.035 } = {}) {
  return new THREE.ExtrudeGeometry(roundedPoly(pts, r), { depth, bevelEnabled: true, bevelSize: bev, bevelThickness: bev, bevelSegments: 3, curveSegments: 6 });
}
// cor por vértice numa geometria
function tint(geo, color) {
  const c = new THREE.Color(color), n = geo.attributes.position.count, arr = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) { arr[i * 3] = c.r; arr[i * 3 + 1] = c.g; arr[i * 3 + 2] = c.b; }
  geo.setAttribute("color", new THREE.BufferAttribute(arr, 3)); return geo;
}

export function buildContacto(M) {
  const g = new THREE.Group(), pops = [], P = popper(g, pops), R = rng(61);
  const isl = makeIsland(M, { R: 7.0, top: "#BFC5A8", soil: "#BFA27E", rock: ["#BE9A7A", "#8A6650"], seed: 47, depth: 8.0, wob: 0.05 });
  g.add(isl.group);

  // ---------- geometria-mãe do envelope ----------
  const W = 5.8, H = 3.7, T = 0.5;              // corpo do envelope
  const LEAN = 0.52, ALPHA = 0.2, FH = 2.7;      // inclinação para trás; abertura extra da aba; altura da aba
  const yZ = 0.2;                                // topo da plaza circular
  const yA = 0.26, yP = 0.52;                    // topo do degrau A e do degrau B (relativos à plaza)
  const zO = -0.3, yO = yZ + yP + 0.145;         // origem (aresta inferior) do envelope
  const eul = new THREE.Euler(-LEAN, 0, 0), O = new THREE.Vector3(0, yO, zO);
  const E = (x, y, z) => new THREE.Vector3(x, y, z).applyEuler(eul).add(O);   // coords do envelope -> ilha

  // ---------- paleta local ----------
  const cPaper = "#FAF6EA", cCream = "#F3EAD6", cSand = "#E6D0A6";
  const cOchre = "#CE9D4B", cOchreL = "#EDCF8E", cOchreD = "#B0832F";
  const mBody = M.clay(cOchre, { rough: 0.8, bump: 0.3 });
  const mFlapL = M.clay("#DFB363", { rough: 0.8, bump: 0.3 });
  const mFlapB = M.clay(cOchreL, { rough: 0.78, bump: 0.3 });
  const mOchreD = M.clay(cOchreD, { rough: 0.8, bump: 0.3 });
  const mTeal = M.clay(PAL.teal, { rough: 0.75, bump: 0.25 });
  const mTerra = M.clay(PAL.terra, { rough: 0.8, bump: 0.3 });
  const mInk = M.clay("#3A2E27", { rough: 0.8, noBump: true });

  // ---------- plaza circular (base da maqueta) ----------
  const plaza = P(0, -0.5, 0.0);
  {
    const t1 = mesh(puck(5.3, 0.12, 0.04, 96), M.clay("#DCC39A", { rough: 0.9, bump: 0.3 })); plaza.add(t1);
    const t2 = mesh(puck(4.9, 0.08, 0.03, 96), M.clay("#E9D8B4", { rough: 0.88, bump: 0.3 })); t2.position.y = 0.12; plaza.add(t2);
    const ring = mesh(new THREE.TorusGeometry(4.52, 0.032, 8, 128), M.clay(PAL.ochre, { rough: 0.8, noBump: true }), { cast: false });
    ring.rotation.x = Math.PI / 2; ring.position.y = 0.2; plaza.add(ring);
  }

  // ---------- plinto em degraus ----------
  const plinth = P(0, -0.6, 0.02, yZ);
  const stepA = mesh(rbox(8.2, 0.26, 5.6, 0.1), M.clay(cCream, { rough: 0.85, bump: 0.3 })); stepA.position.y = 0.13; plinth.add(stepA);
  const stepB = mesh(rbox(6.6, 0.26, 3.5, 0.1), M.clay(cSand, { rough: 0.85, bump: 0.3 })); stepB.position.set(0, 0.39, -0.65); plinth.add(stepB);
  // fiada de ocre na base do degrau A
  const trim = mesh(rbox(8.24, 0.06, 5.64, 0.03), M.clay(PAL.ochre, { rough: 0.85, bump: 0.3 }), { cast: false }); trim.position.y = 0.06; plinth.add(trim);
  // ressalto à frente do envelope
  const ledge = mesh(rbox(W + 0.3, 0.26, 0.6, 0.08), M.clay("#C9A46A", { rough: 0.85, bump: 0.3 })); ledge.position.set(0, yP + 0.13, zO + 0.32 + 0.6); plinth.add(ledge);
  // contrafortes triangulares atrás do envelope
  {
    const Q0 = E(0, 0, -0.27), Q1 = E(0, 2.4, -0.27), y0 = yP;
    const tri = [[Q0.z + 0.02, y0], [Q1.z, Q1.y - yZ], [Q1.z, y0]];
    [-2.0, 2.0].forEach((x) => {
      const w = mesh(plate(tri, 0.34, { r: 0.07, bev: 0.03 }), M.clay(cSand, { rough: 0.85, bump: 0.3 })); w.rotation.y = -Math.PI / 2; w.position.set(x + 0.17, 0, 0.6); plinth.add(w);
    });
  }
  const cs = contact(5.8, 0.5); cs.position.set(0, 0.012 + yZ, -0.6); g.add(cs);

  // ---------- envelope (corpo + camadas em V) ----------
  const body = P(0, zO, 0.06, yO); body.rotation.x = -LEAN;
  {
    const b = mesh(rbox(W, H, T, 0.13), mBody); b.position.y = H / 2; body.add(b);
    const zf = T / 2 - 0.005, ins = 0.17;
    const L = [[-W / 2 + ins, H - ins], [-W / 2 + ins, ins], [-0.06, H * 0.53]];
    const Rr = [[W / 2 - ins, H - ins], [W / 2 - ins, ins], [0.06, H * 0.53]];
    const Bt = [[-W / 2 + ins, ins], [W / 2 - ins, ins], [0, H * 0.62]];
    const l = mesh(plate(L, 0.03, { r: 0.09, bev: 0.025 }), mFlapL); l.position.z = zf; body.add(l);
    const r = mesh(plate(Rr, 0.03, { r: 0.09, bev: 0.025 }), mFlapL); r.position.z = zf; body.add(r);
    const bt = mesh(plate(Bt, 0.05, { r: 0.09, bev: 0.028 }), mFlapB); bt.position.z = zf + 0.02; body.add(bt);
    // fenda da abertura (escura) no topo
    const slit = mesh(rbox(W - 0.7, 0.02, 0.2, 0.008), mInk, { cast: false }); slit.position.y = H + 0.004; body.add(slit);
  }

  // ---------- aba aberta (forro azul-petróleo) ----------
  const hinge = E(0, H, -0.22);
  const flapW = P(0, hinge.z, 0.16, hinge.y); flapW.rotation.x = -(LEAN + ALPHA);
  {
    const outer = mesh(plate([[-W / 2 + 0.02, 0], [W / 2 - 0.02, 0], [0, FH]], 0.09, { r: 0.24, bev: 0.04 }), mOchreD); outer.position.z = -0.045; flapW.add(outer);
    const lining = mesh(plate([[-W / 2 + 0.55, 0.16], [W / 2 - 0.55, 0.16], [0, FH - 0.55]], 0.02, { r: 0.16, bev: 0.015 }), mTeal); lining.position.z = 0.065; flapW.add(lining);
    const rod = mesh(new THREE.CylinderGeometry(0.075, 0.075, W - 0.05, 20), mOchreD); rod.rotation.z = Math.PI / 2; rod.position.z = 0.0; flapW.add(rod);
  }

  // ---------- folha A4 (o CV), a subir da abertura ----------
  const mouth = E(0, H, 0);
  const sheetW = P(0, mouth.z, 0.3, mouth.y); sheetW.rotation.x = -LEAN;
  const sway = new THREE.Group(); sway.rotation.set(0.03, 0, -0.06); sheetW.add(sway);
  {
    const sw = 3.5, sh = sw * Math.SQRT2, y0 = -1.0, y1 = y0 + sh;
    // folha de trás (carta), a espreitar à direita
    const back = mesh(rbox(3.3, 4.5, 0.05, 0.02), M.clay("#EBDDBF", { rough: 0.85, noBump: true })); back.position.set(0.62, -1.0 + 2.25 + 0.12, -0.1); back.rotation.z = 0.11; sway.add(back);
    {
      const ls = [];
      for (let i = 0; i < 7; i++) {
        const w = 0.38 - (i % 3) * 0.05, geo = new THREE.BoxGeometry(w, 0.04, 0.02); geo.translate(1.42 - (0.38 - w) / 2, 1.6 - i * 0.2, 0.035); ls.push(geo);
      }
      back.add(mesh(mergeGeometries(ls), M.clay("#B9A98F", { rough: 0.9, noBump: true }), { cast: false }));
    }
    // folha principal
    const pts = [[-sw / 2, y0], [sw / 2, y0], [sw / 2, y1], [-sw / 2, y1]];
    const sheet = mesh(plate(pts, 0.05, { r: 0.05, bev: 0.015 }), M.clay(cPaper, { rough: 0.8, bump: 0.12 })); sheet.position.z = -0.025; sway.add(sheet);
    // barras (texto simulado) numa só malha com cor por vértice
    const bars = [];
    const bar = (cx, cy, w, h, color, d = 0.03, z = 0.038) => { const geo = new THREE.BoxGeometry(w, h, d); geo.translate(cx, cy, z + d / 2); bars.push(tint(geo, color)); };
    const dot = (cx, cy, r, color, z) => { const geo = new THREE.CylinderGeometry(r, r, 0.03, 28); geo.rotateX(Math.PI / 2); geo.translate(cx, cy, z); bars.push(tint(geo, color)); };
    const gray = "#B9A98F", grayD = "#8F7F6B";
    // cabeçalho a toda a largura
    bar(0, 3.53, 3.38, 0.78, PAL.teal, 0.035);
    dot(-1.2, 3.53, 0.27, PAL.paper, 0.115);
    dot(1.2, 3.53, 0.27, PAL.paper, 0.115);
    bar(1.2, 3.58, 0.075, 0.2, PAL.tealD, 0.03, 0.12);                      // seta de "descarregar"
    { const ar = new THREE.ConeGeometry(0.11, 0.13, 3); ar.rotateZ(Math.PI); ar.translate(1.2, 3.42, 0.135); bars.push(tint(ar, PAL.tealD)); }
    bar(-0.05, 3.7, 1.45, 0.14, PAL.paper, 0.03, 0.075);
    bar(-0.25, 3.44, 1.0, 0.075, PAL.ochreL, 0.03, 0.075);
    bar(-0.35, 3.3, 0.8, 0.05, "#B7D3D2", 0.03, 0.075);
    // barra lateral (areia) + conteúdo
    bar(-1.16, 1.5, 1.15, 3.0, "#EAD9BC", 0.012);
    bar(-1.2, 2.86, 0.62, 0.085, PAL.teal, 0.03, 0.05);
    [0.74, 0.62, 0.7, 0.5].forEach((w, i) => bar(-1.55 + w / 2, 2.66 - i * 0.15, w, 0.05, gray, 0.025, 0.05));
    bar(-1.28, 1.98, 0.5, 0.085, PAL.teal, 0.03, 0.05);
    [0.6, 0.5, 0.66, 0.42].forEach((w, i) => { const y = 1.78 - i * 0.16; bar(-1.19, y, 0.74, 0.06, "#F6EEDC", 0.02, 0.05); bar(-1.56 + w / 2, y, w, 0.06, i % 2 ? PAL.ochre : PAL.terra, 0.03, 0.058); });
    // mini gráfico de colunas
    [0.28, 0.52, 0.38, 0.66, 0.46].forEach((h, i) => bar(-1.5 + i * 0.17, 0.2 + h / 2, 0.115, h, [PAL.teal, PAL.ochre, PAL.terra, PAL.teal, PAL.ochre][i], 0.03, 0.05));
    // colunas de texto principais
    const X0 = -0.42;
    const section = (y, hw, lines, bullet) => {
      bar(X0 + hw / 2, y, hw, 0.1, PAL.terra, 0.03, 0.05);
      bar(X0 + 0.9, y - 0.09, 1.8, 0.012, "#E0D0B2", 0.015, 0.045);
      lines.forEach((w, i) => {
        const yy = y - 0.24 - i * 0.155;
        if (bullet) dot(X0 + 0.05, yy, 0.035, PAL.ochre, 0.038 + 0.015);
        const x0 = X0 + (bullet ? 0.2 : 0);
        bar(x0 + w / 2, yy, w, 0.052, i % 3 === 2 ? grayD : gray, 0.025, 0.05);
      });
    };
    section(2.86, 0.98, [1.9, 1.74, 1.82, 1.2], false);
    section(1.86, 0.78, [1.62, 1.28, 1.52, 0.92], true);
    section(0.86, 1.1, [1.9, 1.7, 1.84, 1.4, 0.9], false);
    sway.add(mesh(mergeGeometries(bars), new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.85, envMapIntensity: 0.4 }), { cast: false }));
  }

  // ---------- selo de lacre: o ponto vivo, onde o fio termina ----------
  const SY = H * 0.58;
  const sealPos = E(0, SY, 0);
  const sealW = P(0, sealPos.z, 0.55, sealPos.y); sealW.rotation.x = -LEAN;
  const SEAL_S = 1.2, sealG = new THREE.Group(); sealG.rotation.x = Math.PI / 2; sealG.position.z = 0.3; sealG.scale.setScalar(SEAL_S); sealW.add(sealG);
  const sealMat = M.glow("#FF4A28", { ei: 1.25 }).clone(); sealMat.color.set("#8E1F0F");
  const rimMat = M.clay("#A92613", { rough: 0.55, noBump: true });
  const waxy = (geo) => { // contorno irregular de lacre (no plano xz)
    const p = geo.attributes.position;
    for (let i = 0; i < p.count; i++) { const x = p.getX(i), z = p.getZ(i), a = Math.atan2(z, x), k = 1 + 0.045 * Math.sin(3 * a + 0.6) + 0.03 * Math.sin(5 * a + 2.1) + 0.018 * Math.sin(8 * a); p.setX(i, x * k); p.setZ(i, z * k); }
    geo.computeVertexNormals(); return geo;
  };
  {
    const disc = mesh(waxy(puck(0.5, 0.13, 0.05, 64)), sealMat, { cast: false }); sealG.add(disc);
    const rg = new THREE.TorusGeometry(0.57, 0.085, 14, 72); rg.rotateX(Math.PI / 2); rg.translate(0, 0.09, 0);
    sealG.add(mesh(waxy(rg), rimMat));
    // emblema: dois anéis entrelaçados (a "ligação")
    [-0.15, 0.15].forEach((x, i) => { const lg = new THREE.TorusGeometry(0.245, 0.036, 10, 44); lg.rotateX(Math.PI / 2); lg.translate(x, 0.14 + i * 0.012, 0); sealG.add(mesh(lg, rimMat, { cast: false })); });
  }
  const threadPt = E(0, SY, 0.4);   // o fio entra no lacre

  // ---------- cartas sobre o degrau da frente ----------
  const letters = P(-2.55, 1.45, 0.55, yZ);
  {
    const s = new THREE.Group(); s.scale.setScalar(1.2); letters.add(s);
    const l1 = mesh(rbox(1.7, 0.11, 1.15, 0.05), M.clay(cPaper, { rough: 0.8, bump: 0.15 })); l1.position.y = yA + 0.055; l1.rotation.y = 0.33; s.add(l1);
    const band = mesh(rbox(0.17, 0.135, 1.18, 0.04), mTerra); l1.add(band);
    const l2 = new THREE.Group(); l2.position.set(0.12, yA + 0.11 + 0.04, -0.02); l2.rotation.y = -0.2; s.add(l2);
    const eb = mesh(rbox(1.2, 0.08, 0.78, 0.03), M.clay(cSand, { rough: 0.85, bump: 0.2 })); l2.add(eb);
    const fl = mesh(plate([[-0.5, 0.36], [0.5, 0.36], [0, -0.02]], 0.012, { r: 0.05, bev: 0.012 }), M.clay(cOchreL, { rough: 0.8, noBump: true })); fl.rotation.x = -Math.PI / 2; fl.position.y = 0.04; l2.add(fl);
    // marca postal (anel + ondas)
    const pm = new THREE.Group(); pm.position.set(0.36, 0.05, 0.2); l2.add(pm);
    const ringP = mesh(new THREE.TorusGeometry(0.17, 0.024, 8, 32), mInk, { cast: false }); ringP.rotation.x = -Math.PI / 2; pm.add(ringP);
    const wv = [-0.06, 0, 0.06].map((z) => { const w = new THREE.BoxGeometry(0.3, 0.015, 0.02); w.translate(0, 0, z); return w; });
    pm.add(mesh(mergeGeometries(wv), mInk, { cast: false }));
    const cx = contact(1.7, 0.7); cx.position.set(0, yA + 0.012, 0); s.add(cx);
  }
  // cartão dobrado em tenda
  const tent = P(0.95, 1.6, 0.62, yZ);
  {
    const s = new THREE.Group(); s.scale.setScalar(1.15); tent.add(s);
    const th = 0.62, tt = 0.42, yR = th * Math.cos(tt) + yA;
    const front = new THREE.Group(); front.position.set(0, yR, 0); front.rotation.x = -tt; s.add(front);
    const back = new THREE.Group(); back.position.set(0, yR, 0); back.rotation.x = tt; s.add(back);
    const pf = mesh(rbox(1.05, th, 0.05, 0.02), M.clay(cPaper, { rough: 0.8, bump: 0.12 })); pf.position.y = -th / 2; front.add(pf);
    const pb = mesh(rbox(1.05, th, 0.05, 0.02), mTeal); pb.position.y = -th / 2; back.add(pb);
    const b1 = mesh(new THREE.BoxGeometry(0.55, 0.06, 0.02), mTerra, { cast: false }); b1.position.set(0, 0.06, 0.035); pf.add(b1);
    const ln = [0.72, 0.56].map((w, i) => { const b = new THREE.BoxGeometry(w, 0.035, 0.02); b.translate(0, -0.06 - i * 0.1, 0.035); return b; });
    pf.add(mesh(mergeGeometries(ln), M.clay("#B9A98F", { noBump: true }), { cast: false }));
    const cc = contact(1.0, 0.7); cc.position.set(0, yA + 0.012, 0.05); s.add(cc);
  }
  // carimbo sobre a almofada de tinta
  const stamp = P(3.1, 1.4, 0.68, yZ);
  {
    const s = new THREE.Group(); s.scale.setScalar(1.15); stamp.add(s);
    const tray = mesh(rbox(1.3, 0.16, 0.95, 0.06), M.clay(PAL.terraD, { rough: 0.7, bump: 0.2 })); tray.position.y = yA + 0.08; tray.rotation.y = -0.18; s.add(tray);
    const pad = mesh(rbox(1.08, 0.03, 0.73, 0.012), M.clay(PAL.tealD, { rough: 0.85, noBump: true })); pad.position.y = 0.09; tray.add(pad);
    const st = new THREE.Group(); st.position.set(0.05, 0.16 + 0.015, 0.0); tray.add(st);
    st.add(mesh(puck(0.4, 0.09, 0.03, 40), mInk));
    const neck = mesh(new THREE.CylinderGeometry(0.11, 0.14, 0.42, 24), M.clay(PAL.terra, { rough: 0.6, bump: 0.15 })); neck.position.y = 0.09 + 0.21; st.add(neck);
    const knob = mesh(new THREE.SphereGeometry(0.25, 28, 20), M.clay(PAL.terra, { rough: 0.6, bump: 0.15 })); knob.scale.y = 0.85; knob.position.y = 0.09 + 0.42 + 0.14; st.add(knob);
    const cst = contact(1.25, 0.7); cst.position.set(0, yA + 0.012, 0); s.add(cst);
  }

  // ---------- mini-torre de sinal (ponto de contacto) ----------
  const tower = P(5.5, -2.2, 0.42);
  const rings = new THREE.Group();
  {
    const base = mesh(puck(0.78, 0.26, 0.07, 36), M.clay(cCream, { rough: 0.85, bump: 0.3 })); tower.add(base);
    const h0 = 0.26, Ht = 3.85, rb = 0.3, rt = 0.19, rAt = (y) => rb + (rt - rb) * ((y - h0) / Ht);
    const shaft = mesh(new THREE.CylinderGeometry(rt, rb, Ht, 28), M.clay("#F4ECDD", { rough: 0.8, bump: 0.25 })); shaft.position.y = h0 + Ht / 2; tower.add(shaft);
    { const y = 2.25, r = rAt(y) + 0.018; const band = mesh(new THREE.CylinderGeometry(r, r, 0.34, 28), mTerra); band.position.y = y; tower.add(band); }
    const yG = h0 + Ht;
    const gal = mesh(puck(0.5, 0.12, 0.05, 36), mTeal); gal.position.y = yG; tower.add(gal);
    const drum = mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.42, 28), M.clay(cPaper, { rough: 0.7, bump: 0.15 })); drum.position.y = yG + 0.12 + 0.21; tower.add(drum);
    const dome = mesh(new THREE.SphereGeometry(0.3, 28, 14, 0, TAU, 0, Math.PI / 2), mOchreD); dome.position.y = yG + 0.12 + 0.42; tower.add(dome);
    // anéis de sinal (armilar) em torno do tambor
    rings.position.y = yG + 0.12 + 0.2; tower.add(rings);
    const r1 = mesh(new THREE.TorusGeometry(0.82, 0.04, 8, 64), mOchreD, { cast: false }), r2 = mesh(new THREE.TorusGeometry(1.2, 0.033, 8, 72), mTeal, { cast: false });
    r1.rotation.x = Math.PI / 2 + 0.28; r2.rotation.x = Math.PI / 2 - 0.35; r2.rotation.y = 0.4; rings.add(r1, r2); rings.userData = { r1, r2 };
    const ct = contact(1.3, 0.8); ct.position.set(0, 0.012, 0); tower.add(ct);
  }

  // ---------- vegetação mínima ----------
  const c1 = P(-5.3, -3.1, 0.78); c1.add(cypress(M, { h: 4.1, r: 0.5, seed: 3 }));
  const c2 = P(-6.05, -1.4, 0.84); c2.add(cypress(M, { h: 2.8, r: 0.4, seed: 8 }));
  c1.add(contact(1.0, 0.8)); c2.add(contact(0.8, 0.8));
  const b1 = P(-2.9, 5.1, 0.86); b1.add(bush(M, { s: 0.6, color: PAL.sage }));

  // ---------- folhas de papel a derivar (mensagens em voo) ----------
  const drift = P(0, 0, 0.9), leaves = [];
  {
    const cols = [cPaper, cOchreL, cPaper, cPaper];
    const homes = [[-4.6, 5.4, 0.6], [3.5, 7.0, 0.2], [-3.2, 7.7, -2.2], [4.4, 4.3, 3.4]];
    homes.forEach(([x, y, z], i) => {
      const mat = new THREE.MeshStandardMaterial({ color: cols[i], emissive: cols[i], emissiveIntensity: 0.32, roughness: 0.9, side: THREE.DoubleSide });
      const m = mesh(rbox(0.42, 0.02, 0.6, 0.008), mat, { cast: false, receive: false }); drift.add(m);
      leaves.push({ m, x, y, z, ph: R() * TAU, sp: 0.32 + R() * 0.22 });
    });
  }

  // ---------- animação ----------
  const update = (t) => {
    isl.update(t);
    sway.rotation.x = 0.03 + Math.sin(t * 0.65) * 0.028;
    sway.rotation.z = -0.06 + Math.sin(t * 0.5 + 1.2) * 0.02;
    const pulse = Math.sin(t * 2.6);
    sealMat.emissiveIntensity = 1.25 + pulse * 0.22; sealG.scale.setScalar(SEAL_S * (1 + pulse * 0.03));
    rings.rotation.y = t * 0.28; rings.userData.r1.rotation.z = t * 0.2; rings.userData.r2.rotation.z = -t * 0.14;
    leaves.forEach((l) => {
      const a = t * l.sp + l.ph;
      l.m.position.set(l.x + Math.sin(a) * 0.55, l.y + Math.sin(a * 1.3 + 1) * 0.35, l.z + Math.cos(a * 0.8) * 0.5);
      l.m.rotation.set(Math.sin(a * 1.1) * 0.35 + 0.2, a * 0.5, Math.cos(a * 0.9) * 0.3);
    });
  };
  const hot = [{ id: "contacto.email", obj: [body, flapW, sealW] }, { id: "contacto.cv", obj: sheetW }, { id: "contacto.linkedin", obj: letters }, { id: "contacto.github", obj: tent }, { id: "contacto.orcid", obj: stamp }];
  return { group: g, update, pops, thread: [[threadPt.x, threadPt.y, threadPt.z]], hot };
}
