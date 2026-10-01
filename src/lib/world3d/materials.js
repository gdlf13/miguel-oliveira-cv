// Paleta e materiais: barro/papel mate com grão subtil, vidro, emissivos.
import * as THREE from "three";
import { rng } from "./util.js";

export const PAL = {
  cream: "#F4ECDD", paper: "#FBF6EC", sand: "#E9D9BD", sand2: "#DCC6A0",
  terra: "#C8593B", terraD: "#9C3F2A", terraL: "#E28B67", vermilion: "#C42D1A",
  sage: "#7E9078", sageD: "#5C6F58", sageL: "#AEBFA5",
  ochre: "#D9A441", ochreD: "#B07F26", ochreL: "#EBC878",
  teal: "#3E7F89", tealD: "#2C5D66", tealL: "#7DB4B6",
  plum: "#8A5878", plumD: "#63395A", plumL: "#B98CAA",
  ink: "#2B2521", soil: "#C79E78", soilD: "#A97F5E", rock: "#B28B6C", rockD: "#8C6650",
  glow: "#FFC98A", white: "#FFFCF6",
};

function grainTexture(size = 256, seed = 3) {
  const r = rng(seed), c = document.createElement("canvas"); c.width = c.height = size;
  const g = c.getContext("2d"), img = g.createImageData(size, size);
  for (let i = 0; i < size * size; i++) { const v = 128 + (r() - 0.5) * 90; img.data[i * 4] = img.data[i * 4 + 1] = img.data[i * 4 + 2] = v; img.data[i * 4 + 3] = 255; }
  g.putImageData(img, 0, 0);
  // manchas de baixa frequência
  g.globalAlpha = 0.18;
  for (let i = 0; i < 40; i++) { g.fillStyle = r() > 0.5 ? "#fff" : "#000"; g.beginPath(); g.arc(r() * size, r() * size, 10 + r() * 40, 0, 6.29); g.fill(); }
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(3, 3); t.anisotropy = 4;
  return t;
}

export function makeMaterials(opts = {}) {
  const grain = opts.grain === false ? null : grainTexture();
  const cache = new Map();
  const M = {
    grain,
    // barro mate
    clay(color, o = {}) {
      const key = "c" + color + JSON.stringify(o);
      if (cache.has(key)) return cache.get(key);
      const m = new THREE.MeshStandardMaterial({ color, roughness: o.rough ?? 0.82, metalness: o.metal ?? 0, flatShading: !!o.flat, bumpMap: o.noBump ? null : grain, bumpScale: o.bump ?? 0.35, envMapIntensity: o.env ?? 0.55 });
      if (o.emissive) { m.emissive = new THREE.Color(o.emissive); m.emissiveIntensity = o.ei ?? 0.5; }
      if (o.vertexColors) m.vertexColors = true;
      cache.set(key, m); return m;
    },
    // superfície lisa mais "cerâmica"
    glaze(color, o = {}) {
      const key = "g" + color + JSON.stringify(o);
      if (cache.has(key)) return cache.get(key);
      const m = new THREE.MeshPhysicalMaterial({ color, roughness: o.rough ?? 0.38, metalness: 0, clearcoat: 0.6, clearcoatRoughness: 0.35, envMapIntensity: o.env ?? 0.8 });
      cache.set(key, m); return m;
    },
    glass(color = "#FFF4E6", o = {}) {
      const key = "gl" + color + JSON.stringify(o);
      if (cache.has(key)) return cache.get(key);
      const m = new THREE.MeshPhysicalMaterial({ color, roughness: 0.08, metalness: 0, transparent: true, opacity: o.opacity ?? 0.28, clearcoat: 1, clearcoatRoughness: 0.05, envMapIntensity: 1.6, depthWrite: false, side: THREE.DoubleSide, ior: 1.3 });
      cache.set(key, m); return m;
    },
    glow(color = PAL.glow, o = {}) {
      const key = "e" + color + JSON.stringify(o);
      if (cache.has(key)) return cache.get(key);
      const m = new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: o.ei ?? 1.6, roughness: 0.6, toneMapped: true });
      cache.set(key, m); return m;
    },
    basic(color, o = {}) {
      const key = "b" + color + JSON.stringify(o);
      if (cache.has(key)) return cache.get(key);
      const m = new THREE.MeshBasicMaterial({ color, transparent: o.opacity != null, opacity: o.opacity ?? 1, depthWrite: o.depthWrite ?? true, fog: o.fog ?? true });
      cache.set(key, m); return m;
    },
    dispose() { cache.forEach((m) => m.dispose()); grain && grain.dispose(); },
  };
  return M;
}

// textura radial suave (halos, sombras de contacto)
export function radialTexture(stops = [[0, "rgba(255,255,255,1)"], [1, "rgba(255,255,255,0)"]], size = 128) {
  const c = document.createElement("canvas"); c.width = c.height = size;
  const g = c.getContext("2d"), gr = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  stops.forEach(([o, col]) => gr.addColorStop(o, col));
  g.fillStyle = gr; g.fillRect(0, 0, size, size);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
