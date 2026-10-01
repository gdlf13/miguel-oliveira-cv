// Ilhas clicáveis. Cada ilha declara "hotspots" ({ id, obj, ring? }): os objectos que levam a um link.
// O mundo não sabe para onde cada um aponta (isso vive em src/data/scrollWorld.ts): só devolve o id ao componente.
//  · geometria de acerto: cópias das malhas (mesma geometria, sem materiais visíveis) na camada 1 -> raycast exacto ao triângulo,
//    mesmo depois de a geometria estática ter sido trocada pela versão cozida (applyBaked remove as malhas originais da ilha);
//  · contorno no chão (rectângulo arredondado): discreto na ilha activa, vermelhão ao passar o rato;
//  · só as ilhas em que a câmara está "pousada" respondem; o cursor passa a "pointer" por cima de um hotspot.
import * as THREE from "three";

const LAYER = 1;                                   // camada só de raycast (a câmara não a desenha)
const HIT = new THREE.MeshBasicMaterial();
const INK = new THREE.Color("#2E2622"), VERM = new THREE.Color("#B02E1C");
const ACTIVE = 0.6;                                // "proximidade" mínima da ilha para responder a cliques

function outline(w, d, t, r) {
  const rect = (p, w, d, r) => {
    const x = -w / 2, y = -d / 2;
    p.moveTo(x + r, y); p.lineTo(x + w - r, y); p.quadraticCurveTo(x + w, y, x + w, y + r);
    p.lineTo(x + w, y + d - r); p.quadraticCurveTo(x + w, y + d, x + w - r, y + d);
    p.lineTo(x + r, y + d); p.quadraticCurveTo(x, y + d, x, y + d - r); p.lineTo(x, y + r); p.quadraticCurveTo(x, y, x + r, y);
  };
  const shape = new THREE.Shape(), hole = new THREE.Path();
  rect(shape, w + 2 * t, d + 2 * t, r + t); rect(hole, w, d, r); shape.holes.push(hole);
  const g = new THREE.ShapeGeometry(shape, 6); g.rotateX(-Math.PI / 2); return g;
}

export function createHotspots({ holders, builts, camera, dom, nearOf, onHover, onClick }) {
  const ray = new THREE.Raycaster(); ray.layers.set(LAYER);
  const ndc = new THREE.Vector2(), inv = new THREE.Matrix4(), rel = new THREE.Matrix4(), tmp = new THREE.Vector3();
  const list = [];

  holders.forEach((holder, island) => {
    const hot = builts[island].hot || [], pops = builts[island].pops || [];
    if (!hot.length) return;
    // as peças que "nascem" têm escala final `base` (≠ 1) quando a câmara chega: mede-se já nessa escala
    const saved = pops.map((p) => p.obj.scale.clone());
    pops.forEach((p) => p.obj.scale.setScalar(p.base));
    holder.updateMatrixWorld(true); inv.copy(holder.matrixWorld).invert();

    const hitGroup = new THREE.Group(); hitGroup.name = "hotspots"; holder.add(hitGroup);
    hot.forEach((spec, k) => {
      const hs = { id: spec.id, island, hits: [], ringMat: null, v: 0, hv: 0, ph: (island * 7 + k) * 1.3 };
      const meshesOf = (objs, cb) => [].concat(objs).forEach((root) => root.traverse((o) => {
        if (!o.isMesh || !o.geometry || !o.geometry.attributes.position) return;
        if (o.userData.noHit || o.material.depthWrite === false) return; // brilhos, sombras de contacto…
        cb(o);
      }));
      const box = new THREE.Box3(), ringBox = new THREE.Box3(), ringAll = new THREE.Box3(), corners = new THREE.Vector3();
      const grow = (b, o) => {
        if (!o.geometry.boundingBox) o.geometry.computeBoundingBox();
        const gb = o.geometry.boundingBox;
        for (let i = 0; i < 8; i++) { corners.set(i & 1 ? gb.max.x : gb.min.x, i & 2 ? gb.max.y : gb.min.y, i & 4 ? gb.max.z : gb.min.z).applyMatrix4(rel); b.expandByPoint(corners); }
      };
      meshesOf(spec.obj, (o) => {
        rel.multiplyMatrices(inv, o.matrixWorld);
        let c;
        if (o.isInstancedMesh) { c = new THREE.InstancedMesh(o.geometry, HIT, o.count); c.instanceMatrix.copy(o.instanceMatrix); c.count = o.count; }
        else c = new THREE.Mesh(o.geometry, HIT);
        c.matrixAutoUpdate = false; c.matrix.copy(rel); c.layers.set(LAYER); c.userData.hs = hs; c.frustumCulled = false;
        hitGroup.add(c); hs.hits.push(c); grow(box, o); if (!o.userData.noRing) grow(ringAll, o); // noRing: adornos que alargariam o contorno (pista, decalques de chão)
      });
      if (!hs.hits.length) return;
      // contorno no chão: à volta da pegada do objecto (ou do objecto indicado em `ring`)
      if (spec.ring !== false) {
        if (spec.ring) meshesOf(spec.ring, (o) => { rel.multiplyMatrices(inv, o.matrixWorld); grow(ringBox, o); }); else ringBox.copy(ringAll.isEmpty() ? box : ringAll);
        const size = ringBox.getSize(new THREE.Vector3()), ctr = ringBox.getCenter(new THREE.Vector3());
        const w = Math.max(1.0, size.x + 0.5), d = Math.max(1.0, size.z + 0.5);
        hs.ringMat = new THREE.MeshBasicMaterial({ color: INK, transparent: true, opacity: 0, depthWrite: false, fog: false, toneMapped: false, polygonOffset: true, polygonOffsetFactor: -3, polygonOffsetUnits: -3 });
        const ring = new THREE.Mesh(outline(w, d, 0.075, Math.min(0.45, Math.min(w, d) * 0.22)), hs.ringMat);
        ring.position.set(ctr.x, ringBox.min.y + 0.035, ctr.z); ring.renderOrder = 3; ring.frustumCulled = false; ring.visible = false;
        hitGroup.add(ring); hs.ring = ring;
      }
      hs.box = box; list.push(hs);
    });
    pops.forEach((p, i) => p.obj.scale.copy(saved[i]));
    holder.updateMatrixWorld(true);
  });

  let px = -1e5, py = -1e5, inside = false, touch = false, hovered = null, lastPick = 0, dirty = false;
  const activeHits = () => { const a = []; list.forEach((h) => { if (nearOf(h.island) > ACTIVE) a.push(...h.hits); }); return a; };
  // acerto exacto no pixel; se falhar, procura em anéis à volta (tol px): dedos e cursores não são precisos e a câmara balança de leve
  function pick(cx, cy, tol = 0) {
    const r = dom.getBoundingClientRect(); if (!r.width || !r.height) return null;
    const cand = activeHits(); if (!cand.length) return null;
    camera.updateMatrixWorld();
    const at = (x, y) => { ndc.set(((x - r.left) / r.width) * 2 - 1, -((y - r.top) / r.height) * 2 + 1); ray.setFromCamera(ndc, camera); const h = ray.intersectObjects(cand, false)[0]; return h ? h.object.userData.hs : null; };
    let h = at(cx, cy);
    for (let ring = 1; !h && tol > 0 && ring <= 2; ring++) for (let k = 0; !h && k < 8; k++) { const a = (k / 8) * Math.PI * 2, d = (tol * ring) / 2; h = at(cx + Math.cos(a) * d, cy + Math.sin(a) * d); }
    return h;
  }
  const onMove = (e) => { touch = e.pointerType === "touch"; px = e.clientX; py = e.clientY; inside = !touch; dirty = true; };
  const onDown = (e) => { touch = e.pointerType === "touch"; };
  const onLeave = () => { inside = false; dirty = true; };
  const onClickEv = (e) => { const h = pick(e.clientX, e.clientY, touch || e.pointerType === "touch" ? 18 : 6); if (h && onClick) onClick(h.id, e); };
  dom.addEventListener("pointermove", onMove, { passive: true });
  dom.addEventListener("pointerleave", onLeave, { passive: true });
  dom.addEventListener("pointerdown", onDown, { passive: true });
  dom.addEventListener("click", onClickEv);

  function setHover(h) {
    if (h === hovered) return;
    hovered = h; dom.style.cursor = h ? "pointer" : "";
    onHover && onHover(h ? h.id : null);
  }

  return {
    update(t, now) {
      // volta a testar sob o rato também quando é a câmara (scroll) que se mexe; no máx. ~20×/s
      if (inside && (dirty || now - lastPick > 50)) { lastPick = now; dirty = false; setHover(pick(px, py, 4)); } else if (!inside && hovered) setHover(null);
      list.forEach((h) => {
        if (!h.ring) return;
        const on = nearOf(h.island) > ACTIVE, isH = h === hovered;
        const idle = on ? 0.3 + 0.1 * Math.sin(t * 1.5 + h.ph) : 0;
        h.v += ((isH ? 1 : idle) - h.v) * 0.18; h.hv += ((isH ? 1 : 0) - h.hv) * 0.22;
        h.ring.visible = h.v > 0.01; h.ringMat.opacity = h.v; h.ringMat.color.lerpColors(INK, VERM, h.hv);
      });
    },
    // depuração / testes: centro de cada hotspot projectado no ecrã (px do viewport)
    screen() {
      const r = dom.getBoundingClientRect();
      return list.filter((h) => nearOf(h.island) > ACTIVE).map((h) => {
        const b = h.box, c = tmp.set((b.min.x + b.max.x) / 2, (b.min.y + b.max.y) / 2, (b.min.z + b.max.z) / 2).applyMatrix4(holders[h.island].matrixWorld).project(camera);
        return { id: h.id, x: r.left + ((c.x + 1) / 2) * r.width, y: r.top + ((1 - c.y) / 2) * r.height };
      });
    },
    pick,
    dispose() {
      dom.removeEventListener("pointermove", onMove); dom.removeEventListener("pointerleave", onLeave); dom.removeEventListener("pointerdown", onDown); dom.removeEventListener("click", onClickEv);
      dom.style.cursor = "";
    },
  };
}
