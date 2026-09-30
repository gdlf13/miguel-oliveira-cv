// Linha temporal do scroll (sem dependências): mapeia o progresso 0..1 em "dwell" (ilha) e "conn" (voo entre ilhas).
export const N_SCENES = 6;
export const DWELL = 1.0, CONN = 1.0;      // pesos relativos
export const SCROLL_VH = { dwell: 0.95, conn: 0.8 }; // altura de scroll em ecrãs

const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const smooth = (x) => { x = clamp(x); return x * x * (3 - 2 * x); };

const total = N_SCENES * DWELL + (N_SCENES - 1) * CONN;
export const SEG = Array.from({ length: N_SCENES }, (_, i) => {
  const a = (i * (DWELL + CONN)) / total, b = a + DWELL / total;
  return { a, b, mid: (a + b) / 2, next: i < N_SCENES - 1 ? b + CONN / total : b };
});
export const totalScreens = N_SCENES * SCROLL_VH.dwell + (N_SCENES - 1) * SCROLL_VH.conn;

// opacidade do texto da secção i para o progresso u
export function copyWeight(i, u) {
  const s = SEG[i], span = s.b - s.a, fade = span * 0.22;
  const inn = i === 0 ? 1 : smooth((u - (s.a + span * 0.02)) / fade);
  const out = i === SEG.length - 1 ? 1 : 1 - smooth((u - (s.b - fade * 1.1)) / fade);
  return clamp(Math.min(inn, out));
}

export function activeIndex(u) {
  let best = 0, bd = 1e9;
  SEG.forEach((s, i) => { const d = Math.abs(u - s.mid); if (d < bd) { bd = d; best = i; } });
  return best;
}
