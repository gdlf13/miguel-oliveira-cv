// Mundo 3D controlado pelo scroll: 6 ilhas-diorama ligadas por um fio vermelhão.
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { makeMaterials } from "./materials.js";
import { ISLANDS, buildCameraTrack, fitScale } from "./layout.js";
import { SEG } from "./timeline.js";
import { YAW } from "./island.js";
import { SKY, skyTexture, makeClouds, makeDust, makeFarIslands } from "./env.js";
import { makeThread } from "./thread.js";
import { BUILDERS } from "./islands/index.js";
import { clamp, smooth, easeOutBack, disposeTree } from "./util.js";
import { createPost } from "./post.js";
import { loadBaked, applyBaked } from "./baked.js";
import { createHotspots } from "./hotspots.js";

export function detectQuality() {
  if (typeof window === "undefined") return "high";
  const coarse = window.matchMedia && window.matchMedia("(pointer: coarse)").matches;
  const cores = navigator.hardwareConcurrency || 4, mem = navigator.deviceMemory || 4;
  if (coarse || cores <= 4 || mem <= 4 || window.innerWidth < 700) return coarse ? "low" : "medium";
  return "high";
}

export function mountWorld(container, opts = {}) {
  const quality = opts.quality || detectQuality();
  const Q = { high: { dpr: 2, shadow: 2048, post: true, ao: true }, medium: { dpr: 1.5, shadow: 1536, post: true, ao: false }, low: { dpr: 1.25, shadow: 1024, post: false, ao: false } }[quality];
  const reduced = !!opts.reduced;
  const bakedOn = opts.baked !== false, assetBase = opts.assetBase || "/world", atlasRes = quality === "high" ? 2048 : 1024;
  if (bakedOn) Q.ao = false; // a luz global cozida já traz a oclusão

  const renderer = new THREE.WebGLRenderer({ antialias: !Q.post, alpha: false, powerPreference: "high-performance", preserveDrawingBuffer: !!opts.preserve });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, Q.dpr));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NeutralToneMapping; renderer.toneMappingExposure = 0.98;
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFShadowMap;
  Object.assign(renderer.domElement.style, { position: "absolute", inset: "0", width: "100%", height: "100%", display: "block" });
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = skyTexture();
  scene.fog = new THREE.Fog(SKY.fog, 42, 150);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envTex = pmrem.fromScene(new RoomEnvironment(), 0.06).texture;
  scene.environment = envTex; scene.environmentIntensity = 0.4;

  // luzes
  const hemi = new THREE.HemisphereLight("#FFF1E0", "#CFA98A", 0.62); scene.add(hemi);
  const sun = new THREE.DirectionalLight("#FFDFB5", 2.7);
  sun.castShadow = true; sun.shadow.mapSize.set(Q.shadow, Q.shadow);
  const sc = sun.shadow.camera; sc.left = -20; sc.right = 20; sc.top = 20; sc.bottom = -20; sc.near = 1; sc.far = 90;
  sun.shadow.bias = -0.0006; sun.shadow.normalBias = 0.04; sun.shadow.radius = 4;
  scene.add(sun, sun.target);
  const fill = new THREE.DirectionalLight("#CFE0F0", 0.35); fill.position.set(-20, 6, -10); scene.add(fill);

  const M = makeMaterials();

  // ilhas
  const holders = [], updaters = [], threadPts = [], builts = [];
  ISLANDS.forEach((isl, i) => {
    const holder = new THREE.Group(); holder.position.copy(isl.pos); holder.rotation.y = YAW;
    const built = BUILDERS[i](M);
    holder.add(built.group); scene.add(holder); holders.push(holder);
    built.update && updaters.push(built.update);
    holder.updateMatrixWorld(true);
    (built.thread || [[0, 4, 0]]).forEach((p) => threadPts.push(new THREE.Vector3(...p).applyMatrix4(holder.matrixWorld)));
    holder.userData = { built, pops: built.pops || [] }; builts.push(built);
  });

  const clouds = makeClouds(); scene.add(clouds.group);
  const dust = makeDust(); scene.add(dust.obj);
  const far = makeFarIslands(M); scene.add(far.group);
  const thread = makeThread(threadPts, M); scene.add(thread.group);

  // câmara
  const camera = new THREE.PerspectiveCamera(28, 1, 0.5, 400);
  let track = buildCameraTrack(16 / 9), post = null, W = 1, H = 1;
  const pointer = { x: 0, y: 0, sx: 0, sy: 0 };
  const state = { target: 0, smooth: 0 };
  // ilhas clicáveis: `opts.onHotspot(id)` ao clicar num objecto; `opts.onHover(id|null)` ao passar o rato por cima
  const nearOf = (i) => { const s = SEG[i]; return 1 - clamp(Math.abs(state.smooth - s.mid) / ((s.b - s.a) * 1.15)); };
  const hot = createHotspots({ holders, builts, camera, dom: renderer.domElement, nearOf, onHover: opts.onHover, onClick: opts.onHotspot });

  function resize() {
    const r = container.getBoundingClientRect(); W = Math.max(2, Math.floor(r.width)); H = Math.max(2, Math.floor(r.height));
    renderer.setSize(W, H, false); camera.aspect = W / H;
    // enquadramento: desktop -> cena desloca-se para a direita (texto à esquerda); mobile -> sobe (texto em baixo)
    const portrait = W / H < 0.9;
    camera.fov = portrait ? 34 : 28;
    camera.setViewOffset(W, H, portrait ? 0 : -W * 0.15, portrait ? H * 0.16 : 0, W, H);
    camera.updateProjectionMatrix();
    track = buildCameraTrack(W / H, camera.fov);
    const fs = fitScale(W / H, camera.fov, 42); scene.fog.near = 42 * fs; scene.fog.far = 150 * fs;
    post && post.setSize(W, H);
  }
  if (Q.post) post = createPost(renderer, scene, camera, { ao: Q.ao, samples: quality === "high" ? 4 : 2 });
  resize();
  const ro = new ResizeObserver(resize); ro.observe(container);

  const onPointer = (e) => { pointer.x = (e.clientX / window.innerWidth) * 2 - 1; pointer.y = (e.clientY / window.innerHeight) * 2 - 1; };
  if (!reduced) window.addEventListener("pointermove", onPointer, { passive: true });

  const tmpV = new THREE.Vector3();
  let dbg = null; // câmara de depuração (só harness): { pos, look } em coordenadas do mundo
  function placeCamera(u, t, dt) {
    const c = track(u);
    if (dbg) { camera.position.set(...dbg.pos); camera.lookAt(...dbg.look); sun.position.set(dbg.look[0] - 18, dbg.look[1] + 14, dbg.look[2] + 12); sun.target.position.set(...dbg.look); sun.target.updateMatrixWorld(); return { ...c, dist: 40 }; }
    pointer.sx += (pointer.x - pointer.sx) * Math.min(1, dt * 3); pointer.sy += (pointer.y - pointer.sy) * Math.min(1, dt * 3);
    const yaw = c.yaw + pointer.sx * 0.06 + Math.sin(t * 0.13) * 0.012, pitch = c.pitch - pointer.sy * 0.03 + Math.sin(t * 0.11) * 0.006;
    const cp = Math.cos(pitch);
    camera.position.set(c.target.x + Math.sin(yaw) * cp * c.dist, c.target.y + Math.sin(pitch) * c.dist, c.target.z + Math.cos(yaw) * cp * c.dist);
    camera.lookAt(c.target);
    // o sol acompanha o foco: sombras nítidas onde se olha
    const fx = Math.sin(YAW), fz = Math.cos(YAW), rx = Math.cos(YAW), rz = -Math.sin(YAW);
    sun.position.set(c.target.x + (-rx * 0.95 + fx * 0.4) * 21, c.target.y + 14, c.target.z + (-rz * 0.95 + fz * 0.4) * 21);
    sun.target.position.copy(c.target); sun.target.updateMatrixWorld();
    return c;
  }

  // "pops": os elementos de cada ilha materializam-se à medida que a câmara chega
  function updatePops(u) {
    holders.forEach((h, i) => {
      const s = SEG[i], near = 1 - clamp(Math.abs(u - s.mid) / ((s.b - s.a) * 1.15));
      const pops = h.userData.pops; if (!pops.length) return;
      const k = reduced ? 1 : clamp((near - 0.05) / 0.55);
      pops.forEach((p) => { const e = easeOutBack(clamp((k - p.at * 0.55) / 0.45)); p.obj.scale.setScalar(Math.max(0.0001, p.base * e)); p.obj.visible = e > 0.002; });
    });
  }

  let raf = 0, last = performance.now(), t = 0, ready = false, frames = 0, ioSeen = null;
  // só desenha quando o canvas está no ecrã. Medido com getBoundingClientRect (funciona em iframes de outra origem,
  // onde o IntersectionObserver pode reportar "fora de vista" e deixar a câmara parada); o IO fica só para diagnóstico.
  const io = new IntersectionObserver((es) => { ioSeen = es[0].isIntersecting; }, { threshold: 0 }); io.observe(container);
  const inView = () => { const r = container.getBoundingClientRect(); return r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < (window.innerHeight || 1e6); };
  const onVis = () => { if (!document.hidden) last = performance.now(); };
  document.addEventListener("visibilitychange", onVis);

  let lastRaf = performance.now(), rafDt = 17;
  function tick(now) {
    if (!inView()) return;
    const raw = Math.max(0, (now - last) / 1000), dt = Math.min(0.05, raw); last = now; t += reduced ? 0 : dt; frames++;
    // a câmara segue o scroll em tempo real (não em nº de frames): com poucos fps continua a chegar à ilha no mesmo tempo
    state.smooth += (state.target - state.smooth) * (1 - Math.exp(-Math.min(0.5, raw) * (reduced ? 40 : 7.5)));
    render(state.smooth, t, dt);
    if (!ready) { ready = true; gate.then(() => opts.onReady && opts.onReady()); }
  }
  function frame(now) { raf = requestAnimationFrame(frame); rafDt += (Math.min(5000, now - lastRaf) - rafDt) * 0.2; lastRaf = now; tick(now); }
  // relógio de segurança: se o browser parar o requestAnimationFrame (separador/iframe considerado "em segundo plano"),
  // um temporizador continua a desenhar para a câmara seguir o scroll na mesma (só entra em ação se o rAF parar bem além do ritmo normal de frames, mín. 0,7 s)
  const dog = setInterval(() => { const now = performance.now(); if (now - lastRaf > Math.max(700, rafDt * 3.5)) tick(now); }, 100);
  function render(u, tt, dt) {
    const c = placeCamera(u, tt, dt);
    updatePops(u);
    updaters.forEach((f) => f(tt, u));
    clouds.update(tt); dust.update(tt); thread.update(u, tt, c);
    hot.update(tt, performance.now());
    post ? post.render(dt) : renderer.render(scene, camera);
  }
  // ilhas cozidas: carrega por ordem; a 1.ª pintura só é revelada depois das duas primeiras (ou ao fim de 6 s)
  let gate = Promise.resolve();
  if (bakedOn) {
    let dead = false;
    const jobs = builts.map((b, i) => loadBaked(i, { base: assetBase, ext: opts.bakedExt || "glb", res: atlasRes, grain: M.grain, exposure: opts.bakeExposure, grainK: opts.bakeGrain ?? 1 }).then((bk) => { if (!dead) applyBaked(b, bk); }).catch((e) => console.warn("[world3d] ilha cozida", i, "indisponível:", e && e.message)));
    gate = Promise.race([Promise.all(jobs.slice(0, 2)), new Promise((r) => setTimeout(r, 6000))]);
    var killBaked = () => { dead = true; };
  }
  raf = requestAnimationFrame(frame);

  return {
    setProgress(p) { state.target = clamp(p); },
    jump(p) { state.target = state.smooth = clamp(p); },
    renderAt(p, tt = 1) { state.target = state.smooth = clamp(p); t = tt; render(state.smooth, tt, 0.016); },
    resize,
    // utilitários de depuração (harness)
    settle() { pointer.sx = pointer.x; pointer.sy = pointer.y; }, // (testes) assenta já o paralaxe do rato
    hotspots() { return hot.screen(); }, pickAt(x, y) { const h = hot.pick(x, y); return h ? h.id : null; },
    localToWorld(i, p) { return new THREE.Vector3(...p).applyMatrix4(holders[i].matrixWorld).toArray(); },
    setDebugCam(o) { dbg = o ? { pos: o.pos, look: o.look } : null; },
    get quality() { return quality; },
    get stats() { return { frames, smooth: +state.smooth.toFixed(4), target: +state.target.toFixed(4), inView: inView(), io: ioSeen, hidden: document.hidden, quality, w: W, h: H, dpr: renderer.getPixelRatio(), calls: renderer.info.render.calls, tris: renderer.info.render.triangles, geo: renderer.info.memory.geometries, tex: renderer.info.memory.textures, gpu: (() => { try { const gl = renderer.getContext(), e = gl.getExtension('WEBGL_debug_renderer_info'); return e ? gl.getParameter(e.UNMASKED_RENDERER_WEBGL) : 'n/a'; } catch (x) { return 'err'; } })() }; },
    get info() { return renderer.info; },
    canvas: renderer.domElement,
    destroy() {
      cancelAnimationFrame(raf); clearInterval(dog); if (typeof killBaked === "function") killBaked(); ro.disconnect(); io.disconnect();
      hot.dispose(); window.removeEventListener("pointermove", onPointer); document.removeEventListener("visibilitychange", onVis);
      disposeTree(scene); M.dispose(); envTex.dispose(); pmrem.dispose(); post && post.dispose();
      renderer.dispose(); renderer.domElement.remove();
    },
  };
}
