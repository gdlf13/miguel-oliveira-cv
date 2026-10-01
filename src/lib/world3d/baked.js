// Ilhas modeladas/cozidas no Blender (Cycles): geometria estática com albedo por vértice (COLOR_0) + lightmap de irradiância
// (luz global, sombras suaves, oclusão). Material sem luzes (MeshBasicMaterial): cor x luz cozida, mais grão de barro por cima.
// Os elementos animados/luminosos continuam procedurais (ver .harness/export.html para a classificação).
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/addons/libs/meshopt_decoder.module.js";

let loader = null;

// grão de barro (triplanar, em espaço do objecto) e ligeira variação de tom, multiplicados sobre o albedo
function patchClay(material, grain, strength) {
  material.onBeforeCompile = (sh) => {
    sh.uniforms.uGrain = { value: grain };
    sh.uniforms.uGrainK = { value: strength };
    sh.vertexShader = sh.vertexShader.replace("#include <common>", "#include <common>\nvarying vec3 vGp;")
      .replace("#include <begin_vertex>", "#include <begin_vertex>\nvGp = position;");
    sh.fragmentShader = sh.fragmentShader
      .replace("#include <common>", "#include <common>\nvarying vec3 vGp;\nuniform sampler2D uGrain;\nuniform float uGrainK;\nfloat trip(vec3 p, vec3 w){ return texture2D(uGrain, p.yz).r*w.x + texture2D(uGrain, p.xz).r*w.y + texture2D(uGrain, p.xy).r*w.z; }")
      .replace("#include <color_fragment>", `#include <color_fragment>
      {
        vec3 gn = cross(dFdx(vGp), dFdy(vGp)); gn /= max(length(gn), 1e-6);
        vec3 gw = pow(abs(gn), vec3(4.0)); gw /= (gw.x + gw.y + gw.z + 1e-5);
        float g1 = trip(vGp * 0.85, gw), g2 = trip(vGp * 0.11, gw);
        diffuseColor.rgb *= 1.0 + ((g1 - 0.5) * 0.26 + (g2 - 0.5) * 0.20) * uGrainK;
      }`);
  };
  material.customProgramCacheKey = () => "clay-baked";
}

export async function loadBaked(i, { base = "/world", ext = "glb", res = 2048, grain = null, exposure = 0.85, grainK = 1 } = {}) {
  loader = loader || new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
  const [gltf, manifest] = await Promise.all([
    loader.loadAsync(`${base}/baked-${i}.${ext}`),
    fetch(`${base}/manifest-${i}.json`).then((r) => { if (!r.ok) throw new Error("manifest " + i); return r.json(); }),
  ]);
  const avail = (manifest.res || [1024]).slice().sort((a, b) => a - b);
  const r = avail.filter((x) => x <= res).pop() || avail[0];
  const tex = await new THREE.TextureLoader().loadAsync(`${base}/lm-${i}-${r}.webp`);
  tex.flipY = false; // convenção glTF
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  tex.minFilter = THREE.LinearMipmapLinearFilter; tex.generateMipmaps = true;
  // lightMap entra como indirectDiffuse * RECIPROCAL_PI * intensity, multiplicado pelo albedo: intensity = PI * irr * exposição
  const material = new THREE.MeshBasicMaterial({ vertexColors: true, lightMap: tex, lightMapIntensity: Math.PI * (manifest.irr || 1) * exposure });
  if (grain) patchClay(material, grain, grainK);
  // peças com muitas faces minúsculas (ramos, esferas, adereços) trazem a luz cozida por vértice (COLOR_0 = albedo x irradiância / irr)
  const vlMaterial = new THREE.MeshBasicMaterial({ vertexColors: true, color: new THREE.Color().setScalar((manifest.irr || 1) * exposure) });
  if (grain) patchClay(vlMaterial, grain, grainK);
  const group = new THREE.Group(); group.name = "baked-" + i;
  gltf.scene.updateMatrixWorld(true);
  gltf.scene.traverse((o) => {
    if (!o.isMesh) return;
    const isVL = /^vl/.test(o.name) || o.geometry.getAttribute("uv") === undefined;
    const m = new THREE.Mesh(o.geometry, isVL ? vlMaterial : material);
    m.applyMatrix4(o.matrixWorld); m.castShadow = false; m.receiveShadow = false; m.frustumCulled = false;
    group.add(m);
  });
  return { group, manifest, material, vlMaterial, texture: tex };
}

// troca a geometria procedural estática pela cozida (o resto — brilhos, folhas, ondas… — fica vivo)
export function applyBaked(built, baked) {
  const all = []; built.group.traverse((o) => all.push(o));
  [...baked.manifest.static, ...baked.manifest.drop].forEach((idx) => {
    const o = all[idx]; if (!o) return;
    if (o.parent) o.parent.remove(o);
    if (o.geometry) o.geometry.dispose();
  });
  built.group.add(baked.group);
}
