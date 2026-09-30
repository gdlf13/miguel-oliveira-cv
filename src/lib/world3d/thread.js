// O fio vermelhão: liga as seis ilhas e revela-se com o scroll (o "ponto vivo" da narrativa).
import * as THREE from "three";
import { PAL, radialTexture } from "./materials.js";
import { SEG } from "./layout.js";
import { clamp, lerp, smooth } from "./util.js";

class ParamCurve extends THREE.Curve {
  constructor(base) { super(); this.base = base; }
  getPoint(t, o = new THREE.Vector3()) { return this.base.getPoint(t, o); }
  getPointAt(u, o) { return this.getPoint(u, o); }
  getTangentAt(u, o) { return this.getTangent(u, o); }
}

export function makeThread(islandPts, M) {
  // pontos de controlo: [ilha0, arco, ilha1, arco, ...]
  const pts = [];
  islandPts.forEach((p, i) => {
    pts.push(p.clone());
    if (i < islandPts.length - 1) {
      const n = islandPts[i + 1], m = p.clone().lerp(n, 0.5); m.y += 3.2 + (i % 2 ? -1.2 : 1.2); pts.push(m);
    }
  });
  const base = new THREE.CatmullRomCurve3(pts, false, "catmullrom", 0.5), curve = new ParamCurve(base);
  const SEGS = 720, RAD = 8;
  const geo = new THREE.TubeGeometry(curve, SEGS, 0.085, RAD, false);
  const total = geo.index.count;
  geo.setDrawRange(0, 0);
  const mat = new THREE.MeshStandardMaterial({ color: PAL.vermilion, roughness: 0.42, emissive: PAL.vermilion, emissiveIntensity: 0.28, envMapIntensity: 0.6 });
  const tube = new THREE.Mesh(geo, mat); tube.castShadow = true; tube.frustumCulled = false;
  const ghostGeo = new THREE.TubeGeometry(curve, 360, 0.035, 5, false);
  const ghost = new THREE.Mesh(ghostGeo, new THREE.MeshBasicMaterial({ color: PAL.vermilion, transparent: true, opacity: 0.2, depthWrite: false })); ghost.frustumCulled = false;
  const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: radialTexture([[0, "rgba(255,150,90,0.95)"], [0.35, "rgba(240,90,50,0.35)"], [1, "rgba(240,90,50,0)"]]), transparent: true, depthWrite: false, blending: THREE.NormalBlending }));
  const bead = new THREE.Mesh(new THREE.SphereGeometry(0.2, 24, 16), M.glow("#FF5A36", { ei: 2.2 }));
  const light = new THREE.PointLight("#FF7A4D", 14, 9, 1.6);
  const group = new THREE.Group(); group.add(ghost, tube, halo, bead, light);
  const n = pts.length, us = [], ps = [];
  SEG.forEach((s, k) => { us.push(s.mid); ps.push((2 * k) / (n - 1)); });
  const headParam = (u) => {
    if (u <= us[0]) return 0; if (u >= us[us.length - 1]) return 1;
    let i = 0; while (u > us[i + 1]) i++;
    const t = smooth((u - us[i]) / (us[i + 1] - us[i]));
    return lerp(ps[i], ps[i + 1], t);
  };
  const tmp = new THREE.Vector3();
  const update = (u, t, cam) => {
    const h = headParam(u), cnt = Math.floor(h * SEGS) * RAD * 6;
    geo.setDrawRange(0, Math.min(total, cnt));
    base.getPoint(clamp(h), tmp); bead.position.copy(tmp); halo.position.copy(tmp); light.position.copy(tmp);
    const pulse = 1 + Math.sin(t * 3.2) * 0.12; halo.scale.setScalar(2.4 * pulse * (cam ? Math.pow(cam.dist / 25, 0.55) : 1)); bead.scale.setScalar(pulse);
  };
  return { group, update, curve: base };
}
