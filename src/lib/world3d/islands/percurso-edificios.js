// Ilha 5 — os seis edifícios do percurso, moldados em barro a partir dos traços reconhecíveis de cada instituição:
//   ISMAI (2001) · EB 2/3 Prof. Napoleão Sousa Marques (2002/03) · Programa Escolhas (2004/09) · EB/S de Pinheiro (2009–)
//   · Ordem dos Psicólogos (2016–24) · FMUP (2022–).
// Cada função recebe o grupo (origem no chão, frente = +z) e desenha o edifício; nada aqui usa fotografias, só volumes e cores.
import * as THREE from "three";
import { pine, contact } from "./kit.js";
import { bucket, ringSector, signTexture, crossTexture, compassTexture, decal } from "./percurso-kit.js";

const K = {
  wall: "#F1E9D8", white: "#FBF7EE", stone: "#F4ECDD", stone2: "#E6D6B6", stoneL: "#E9DFC8", cap: "#8B8175", ink: "#2E2622",
  glass: "#3F7196", teal: "#3E7F89", tealD: "#2C5D66", sage: "#95AC90", terra: "#C4704F", terraD: "#A85A3E", wood: "#C9A06C", woodD: "#A9804E",
  green: "#4F7A4E", ebInk: "#4A3A32", blue: "#3F73B0", orange: "#E58A4E", orangeD: "#D9722F", magenta: "#CB477F", yellow: "#F2C14E", sky: "#5E92C4", grey: "#D2C9B9", greyD: "#B4AB9B",
  conc: "#DAD0BB",
};


// placa com o nome, pousada na cobertura sobre duas pernas: acrescenta a caixa a B (geometria fundida) e devolve o decalque a juntar ao grupo
function roofBoard(B, M, { x, y, z, w = 1.0, h = 0.34, bg, lines, legH = 0.14 }) {
  const mat = M.clay(bg, { rough: 0.7, bump: 0.1 }), ink = M.clay(K.ink, { rough: 0.6, noBump: true });
  [-0.32, 0.32].forEach((k) => B.box(0.05, legH + 0.04, 0.05, ink, [x + k * w, y + (legH + 0.04) / 2 - 0.02, z], { flat: true }));
  B.box(w + 0.06, h + 0.06, 0.06, mat, [x, y + legH + h / 2, z], { r: 0.03 });
  const px = 512, py = Math.round((px * h) / w);
  const d = decal(signTexture(lines(py), { w: px, h: py, bg }), w, h); d.position.set(x, y + legH + h / 2, z + 0.036);
  return d;
}

const mats = (M) => ({
  wall: M.clay(K.wall, { rough: 0.85, bump: 0.28 }), white: M.clay(K.white, { rough: 0.8, bump: 0.2 }), stone: M.clay(K.stone, { rough: 0.8, bump: 0.25 }),
  stone2: M.clay(K.stone2, { rough: 0.85, bump: 0.25 }), stoneL: M.clay(K.stoneL, { rough: 0.85, bump: 0.3 }), cap: M.clay(K.cap, { rough: 0.9, bump: 0.2 }),
  ink: M.clay(K.ink, { rough: 0.6, noBump: true }), win: M.glaze(K.tealD), glass: M.glaze(K.glass), tealG: M.glaze(K.teal),
});

// ---------------------------------------------------------------- 1. ISMAI (Maia, 2001) ----
// volumes brancos e cúbicos, canto envidraçado sob uma pala fina, ala baixa com o símbolo azul (três barras em escada)
export function ismai(grp, M) {
  const B = bucket(), m = mats(M), track = M.clay("#C9694D", { rough: 0.9, bump: 0.3 });
  const b0 = 0.09;
  B.box(3.3, b0, 2.2, m.stone2, [0, b0 / 2, 0.05], { r: 0.03 });
  B.box(2.0, 1.5, 1.3, m.wall, [-0.45, b0 + 0.75, -0.2], { r: 0.06 });              // volume principal (2 pisos)
  B.box(2.2, 0.1, 1.5, m.white, [-0.45, b0 + 1.55, -0.15], { r: 0.04 });            // laje/cobertura
  B.box(1.15, 0.82, 1.0, m.wall, [1.0, b0 + 0.41, 0.05], { r: 0.05 });              // ala baixa
  B.box(1.3, 0.08, 1.15, m.white, [1.0, b0 + 0.86, 0.05], { r: 0.04 });
  // canto envidraçado (2 pisos) com caixilharia clara
  B.box(1.05, 1.28, 0.06, m.glass, [-0.95, b0 + 0.68, 0.46], { r: 0.02 });
  for (let k = 0; k <= 4; k++) B.box(0.035, 1.28, 0.05, m.white, [-1.475 + k * 0.2625, b0 + 0.68, 0.49], { flat: true });
  [0.42, 0.86].forEach((y) => B.box(1.05, 0.035, 0.05, m.white, [-0.95, b0 + y, 0.49], { flat: true }));
  B.box(0.85, 0.36, 0.06, m.glass, [0.1, b0 + 1.12, 0.46], { r: 0.02 });            // fita de janela do piso superior
  B.box(1.3, 0.07, 0.72, m.white, [-0.95, b0 + 0.98, 0.82], { r: 0.03 });            // pala da entrada
  [-1.5, -0.4].forEach((x) => B.add(new THREE.CylinderGeometry(0.035, 0.035, 0.94, 8), m.white, { p: [x, b0 + 0.47, 1.12] }));
  B.box(1.2, 0.05, 0.28, m.stone, [-0.95, b0 + 0.025, 1.32], { r: 0.02 });           // degrau
  // pista de atletismo (o campus tem estádio): arco vermelho ao lado
  B.add(ringSector(0.9, 1.45, 0.03, -1.2, 0.5, 24, 0), track, { p: [1.7, 0.0, 1.55], cast: false });
  const nameBoard = roofBoard(B, M, { x: -0.45, y: b0 + 1.6, z: 0.42, w: 1.1, h: 0.34, bg: K.blue, lines: (py) => [{ t: "ISMAI", s: py * 0.58 }] });
  B.build(grp);
  grp.traverse((o) => { if (o.material === track) o.userData.noRing = true; }); // a pista não conta para o contorno de clique
  grp.add(nameBoard);
  const cs = contact(2.5, 0.7); cs.scale.set(1.3, 1, 1); grp.add(cs);
}

// ---------------------------------------------------------------- 2. EB 2/3 Prof. Napoleão Sousa Marques (Trofa, 2002/03) ----
// pavilhão baixo e branco, portal de entrada com as letras "EB 2/3", galeria coberta a terracota, gradeamento e a rosa-dos-ventos pintada no recreio
export function eb23(grp, M) {
  const B = bucket(), m = mats(M), roofT = M.clay(K.terra, { rough: 0.85, bump: 0.35 }), b0 = 0.06;
  B.box(3.7, b0, 1.7, m.stone2, [0, b0 / 2, -0.3], { r: 0.03 });
  B.box(2.9, 0.75, 0.9, m.wall, [0.35, b0 + 0.375, -0.45], { r: 0.05 });
  B.box(3.0, 0.07, 1.0, m.cap, [0.35, b0 + 0.785, -0.45], { r: 0.03 });
  for (let i = 0; i < 5; i++) B.box(0.36, 0.3, 0.05, m.win, [-0.55 + i * 0.55, b0 + 0.42, 0.02], { r: 0.015 });
  // portal de entrada
  B.box(1.05, 1.0, 0.9, m.wall, [-1.6, b0 + 0.5, 0.0], { r: 0.05 });
  B.box(1.15, 0.07, 1.0, m.cap, [-1.6, b0 + 1.035, 0.0], { r: 0.03 });
  B.box(0.52, 0.62, 0.06, m.ink, [-1.6, b0 + 0.31, 0.46], { r: 0.02 });
  // galeria coberta (terracota) sobre postes esbeltos
  B.box(2.7, 0.06, 0.5, roofT, [0.45, b0 + 0.64, 0.3], { r: 0.02 });
  for (let i = 0; i < 5; i++) B.box(0.05, 0.6, 0.05, m.white, [-0.75 + i * 0.6, b0 + 0.3, 0.52], { flat: true });
  // gradeamento branco na frente
  for (let i = 0; i < 15; i++) B.box(0.03, 0.34, 0.03, m.white, [-1.05 + i * 0.2, b0 + 0.17, 0.72], { flat: true, live: true });
  B.box(2.9, 0.03, 0.03, m.white, [0.35, b0 + 0.34, 0.72], { flat: true, live: true });
  const nameBoard = roofBoard(B, M, { x: -1.6, y: b0 + 1.07, z: 0.36, w: 1.0, h: 0.4, bg: K.ebInk, legH: 0.1, lines: (py) => [{ t: "EB 2/3", s: py * 0.5 }, { t: "NAPOLEÃO SOUSA MARQUES", s: py * 0.16 }] });
  B.build(grp);
  grp.add(nameBoard);
  const star = decal(compassTexture(), 1.5, 1.5); star.rotation.x = -Math.PI / 2; star.rotation.z = 0.35; star.position.set(0.55, 0.014, 1.35); grp.add(star);
  const cs = contact(2.6, 0.7); cs.scale.set(1.35, 1, 0.9); grp.add(cs);
}

// ---------------------------------------------------------------- 3. Programa Escolhas (2004/09) ----
// centro comunitário baixo em madeira, telhado de uma água, toldo magenta e a estrela de raios sobrepostos (magenta / amarelo / azul) num mastro
export function escolhas(grp, M) {
  const B = bucket(), m = mats(M), wood = M.clay(K.wood, { rough: 0.85, bump: 0.35 }), woodD = M.clay(K.woodD, { rough: 0.85, bump: 0.35 }), roof = M.clay(K.terraD, { rough: 0.85, bump: 0.4 });
  const mag = M.clay(K.magenta, { rough: 0.6, noBump: true });
  const b0 = 0.06;
  B.box(3.3, b0, 2.1, m.stone2, [0, b0 / 2, 0], { r: 0.03 });
  B.box(2.3, 0.86, 1.3, wood, [-0.35, b0 + 0.43, -0.2], { r: 0.05 });
  B.box(2.6, 0.09, 1.65, roof, [-0.35, b0 + 1.02, -0.2], { r: 0.03, rot: [0.1, 0, 0] });
  B.box(1.1, 0.42, 0.05, m.win, [0.2, b0 + 0.55, 0.46], { r: 0.015 });
  B.box(1.1, 0.05, 0.1, m.stone, [0.2, b0 + 0.31, 0.5], { r: 0.02 });
  B.box(0.44, 0.64, 0.06, m.ink, [-0.95, b0 + 0.32, 0.46], { r: 0.02 });
  B.box(0.74, 0.05, 0.4, mag, [-0.95, b0 + 0.72, 0.62], { r: 0.02, rot: [0.18, 0, 0] });   // toldo
  for (let i = 0; i < 7; i++) B.box(0.025, 0.86, 0.03, woodD, [-1.32 + i * 0.28, b0 + 0.43, 0.46], { flat: true }); // ripado de madeira
  B.box(0.5, 0.05, 0.3, m.stone, [-0.95, b0 + 0.025, 0.72], { r: 0.02 });
  // painel de madeira com o nome, pousado na cobertura
  [-0.68, -0.02].forEach((x) => B.box(0.05, 0.2, 0.05, m.ink, [x, b0 + 1.02, 0.3], { flat: true }));
  B.box(0.86, 0.34, 0.06, woodD, [-0.35, b0 + 1.27, 0.3], { r: 0.03 });
  B.build(grp);
  const nm = decal(signTexture("ESCOLHAS", { w: 512, h: 202, bg: K.woodD }), 0.78, 0.308); nm.position.set(-0.35, b0 + 1.27, 0.335); grp.add(nm);
  const cs = contact(2.4, 0.7); cs.scale.set(1.3, 1, 0.9); grp.add(cs);
}

// ---------------------------------------------------------------- 4. EB/S de Pinheiro (Penafiel, 2009–) ----
// pavilhão branco de dois pisos com janelas em fita, bancadas de betão em degraus com assentos laranja e azuis, e o pinheiro do logótipo
export function pinheiro(grp, M) {
  const B = bucket(), m = mats(M), conc = M.clay(K.conc, { rough: 0.9, bump: 0.35 }), seatO = M.clay(K.orange, { rough: 0.6, noBump: true }), seatB = M.clay(K.sky, { rough: 0.6, noBump: true });
  const b0 = 0.06;
  B.box(3.6, b0, 2.4, m.stone2, [0, b0 / 2, 0.15], { r: 0.03 });
  B.box(2.6, 1.3, 1.1, m.white, [0.35, b0 + 0.65, -0.6], { r: 0.05 });
  B.box(2.75, 0.08, 1.25, m.cap, [0.35, b0 + 1.34, -0.6], { r: 0.03 });
  B.box(1.75, 0.27, 0.05, m.win, [0.6, b0 + 0.36, -0.045], { r: 0.015 });
  B.box(2.3, 0.27, 0.05, m.win, [0.35, b0 + 0.95, -0.045], { r: 0.015 });
  B.box(0.46, 0.6, 0.06, m.ink, [-0.62, b0 + 0.3, -0.045], { r: 0.02 });
  // bancadas
  for (let k = 0; k < 3; k++) {
    const h = 0.12 + k * 0.12, z = 1.02 - k * 0.32;
    B.box(2.5, h, 0.32, conc, [0.35, b0 + h / 2, z], { r: 0.03 });
    for (let s = 0; s < 8; s++) B.box(0.2, 0.11, 0.2, (s + k) % 2 ? seatB : seatO, [-0.65 + s * 0.3, b0 + h + 0.05, z], { r: 0.03 });
  }
  const nameBoard = roofBoard(B, M, { x: 0.35, y: b0 + 1.38, z: -0.02, w: 1.4, h: 0.36, bg: K.green, legH: 0.12, lines: (py) => [{ t: "EBS PINHEIRO", s: py * 0.5 }] });
  B.build(grp);
  grp.add(nameBoard);
  const p1 = pine(M, { h: 2.6, c1: "#4F7A4E", c2: "#68945D", seed: 4 }); p1.position.set(-1.55, 0, 0.55); p1.scale.setScalar(0.9); grp.add(p1);
  const cs = contact(2.7, 0.7); cs.scale.set(1.35, 1, 1.0); grp.add(cs);
}

// ---------------------------------------------------------------- 5. Ordem dos Psicólogos Portugueses (2016–24) ----
// edifício de escritórios cinza-claro com grelha de janelas, rés-do-chão envidraçado, e o cartaz laranja vertical com o Y estilizado
export function opp(grp, M) {
  const B = bucket(), m = mats(M), grey = M.clay(K.grey, { rough: 0.85, bump: 0.3 }), greyD = M.clay(K.greyD, { rough: 0.9, bump: 0.25 }), orange = M.clay(K.orangeD, { rough: 0.6, noBump: true });
  const b0 = 0.06, H = 2.4;
  B.box(2.3, b0, 1.9, m.stone2, [0, b0 / 2, 0], { r: 0.03 });
  B.box(1.75, H, 1.4, grey, [0, b0 + H / 2, 0], { r: 0.05 });
  B.box(1.86, 0.12, 1.5, greyD, [0, b0 + H + 0.06, 0], { r: 0.03 });
  B.box(0.6, 0.4, 0.5, grey, [-0.45, b0 + H + 0.32, -0.3], { r: 0.04 });         // casa das máquinas
  for (const y of [1.0, 1.55, 2.1]) for (const x of [0.02, 0.5]) B.box(0.3, 0.36, 0.05, m.win, [x, b0 + y, 0.71], { r: 0.015 });
  B.box(1.5, 0.6, 0.05, m.win, [0, b0 + 0.34, 0.71], { r: 0.015 });               // montra do rés-do-chão
  B.box(0.42, 0.56, 0.06, m.ink, [0.3, b0 + 0.31, 0.735], { r: 0.02 });
  B.box(0.6, 0.05, 0.36, orange, [0.3, b0 + 0.68, 0.9], { r: 0.02 });             // pala laranja sobre a porta
  B.box(1.78, 0.07, 0.06, orange, [0, b0 + 0.71, 0.73], { r: 0.02 });             // friso laranja
  B.box(0.5, 0.05, 0.3, m.stone, [0.3, b0 + 0.025, 0.95], { r: 0.02 });
  B.build(grp);
  const banner = decal(signTexture([{ t: "OPP", s: 150 }, { t: "ORDEM DOS", s: 34 }, { t: "PSICÓLOGOS", s: 34 }], { w: 256, h: 512, bg: K.orangeD, weight: 800 }), 0.42, 0.84); banner.position.set(-0.55, b0 + 1.62, 0.715); grp.add(banner);
  const cs = contact(2.0, 0.7); cs.scale.set(1.2, 1, 1.0); grp.add(cs);
}

// ---------------------------------------------------------------- 6. Faculdade de Medicina da Univ. do Porto (2022–) ----
// duas alas horizontais de pedra com fita de vidro e brise-soleil, corpo central envidraçado com a cruz da saúde e o adro de degraus curvos com balaustrada
export function fmup(grp, M) {
  const B = bucket(), m = mats(M), sage = M.clay(K.sage, { rough: 0.8, bump: 0.3 }), b0 = 0.15;
  B.box(4.1, b0, 1.9, m.stone2, [0, b0 / 2, -0.15], { r: 0.03 });
  [-1.3, 1.3].forEach((x) => {
    B.box(1.5, 1.6, 1.25, m.stoneL, [x, b0 + 0.8, -0.25], { r: 0.05 });
    B.box(1.62, 0.08, 1.37, m.white, [x, b0 + 1.64, -0.25], { r: 0.03 });
    [0.36, 0.86, 1.36].forEach((y) => B.box(1.3, 0.24, 0.05, m.win, [x, b0 + y, 0.38], { r: 0.015 }));
    for (let i = 0; i < 6; i++) B.box(0.05, 1.42, 0.12, m.white, [x - 0.62 + i * 0.248, b0 + 0.78, 0.46], { flat: true }); // brise-soleil
  });
  B.box(0.24, 1.6, 0.1, sage, [1.98, b0 + 0.8, 0.3], { r: 0.03 });                      // faixa verde no topo da ala direita
  B.box(1.2, 2.05, 1.4, m.stone, [0, b0 + 1.025, -0.2], { r: 0.05 });                    // corpo central
  B.box(1.36, 0.09, 1.56, m.white, [0, b0 + 2.09, -0.2], { r: 0.03 });
  B.box(0.82, 1.28, 0.06, m.tealG, [0, b0 + 1.14, 0.52], { r: 0.02 });
  for (const x of [-0.2, 0.2]) B.box(0.03, 1.28, 0.05, m.white, [x, b0 + 1.14, 0.55], { flat: true });
  B.box(0.42, 0.5, 0.06, m.ink, [0, b0 + 0.25, 0.53], { r: 0.02 });
  // adro curvo: três degraus em semicírculo + balaustrada
  const stepM = M.clay(K.stone, { rough: 0.8, bump: 0.3 });
  [[1.5, 0.05], [1.25, 0.1], [1.0, 0.15]].forEach(([r, h]) => B.add(ringSector(0, r, h, -Math.PI / 2, Math.PI / 2, 32, 0.012), stepM, { p: [0, 0, 0.5] }));
  B.add(ringSector(1.46, 1.56, 0.36, -1.25, 1.25, 30, 0.015), m.stone, { p: [0, 0, 0.5] });
  const nameBoard = roofBoard(B, M, { x: 0, y: b0 + 2.135, z: 0.42, w: 1.25, h: 0.5, bg: K.tealD, legH: 0.1, lines: (py) => [{ t: "FMUP", s: py * 0.52 }, { t: "MEDICINA · U.PORTO", s: py * 0.16 }] });
  B.build(grp);
  grp.add(nameBoard);
  const cross = decal(crossTexture(), 0.3, 0.3); cross.position.set(0, b0 + 1.86, 0.525); grp.add(cross);
  const cs = contact(3.0, 0.7); cs.scale.set(1.4, 1, 1.0); grp.add(cs);
}
