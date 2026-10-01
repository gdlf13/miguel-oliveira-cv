// Pós-processamento: AO suave, tilt-shift (efeito maqueta), grading + dither.
import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { GTAOPass } from "three/addons/postprocessing/GTAOPass.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";

const TILT = {
  uniforms: { tDiffuse: { value: null }, dir: { value: new THREE.Vector2(1, 0) }, res: { value: new THREE.Vector2(1, 1) }, focus: { value: 0.5 }, amount: { value: 1.0 } },
  vertexShader: "varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }",
  fragmentShader: `varying vec2 vUv; uniform sampler2D tDiffuse; uniform vec2 dir, res; uniform float focus, amount;
  void main(){
    float d = abs(vUv.y - focus); float m = smoothstep(0.30, 0.80, d) * amount;
    vec2 px = dir / res * (1.0 + m * 3.2);
    vec4 c = texture2D(tDiffuse, vUv) * 0.2270270270;
    c += texture2D(tDiffuse, vUv + px * 1.3846153846) * 0.3162162162; c += texture2D(tDiffuse, vUv - px * 1.3846153846) * 0.3162162162;
    c += texture2D(tDiffuse, vUv + px * 3.2307692308) * 0.0702702703; c += texture2D(tDiffuse, vUv - px * 3.2307692308) * 0.0702702703;
    gl_FragColor = mix(texture2D(tDiffuse, vUv), c, smoothstep(0.0, 0.25, m));
  }`,
};
const GRADE = {
  uniforms: { tDiffuse: { value: null }, time: { value: 0 }, res: { value: new THREE.Vector2(1, 1) } },
  vertexShader: TILT.vertexShader,
  fragmentShader: `varying vec2 vUv; uniform sampler2D tDiffuse; uniform float time; uniform vec2 res;
  float h(vec2 p){ return fract(sin(dot(p, vec2(12.9898,78.233))) * 43758.5453); }
  void main(){
    vec4 c = texture2D(tDiffuse, vUv);
    vec2 q = vUv - 0.5; float vig = smoothstep(0.95, 0.25, length(q * vec2(1.0, 0.9)));
    c.rgb *= mix(0.9, 1.0, vig);
    c.rgb = mix(c.rgb, c.rgb * vec3(1.02, 1.0, 0.97), 0.6);
    c.rgb += (h(gl_FragCoord.xy + time) - 0.5) / 255.0 * 1.6;   // dither: sem banding no céu
    gl_FragColor = c;
  }`,
};

export function createPost(renderer, scene, camera, { ao = true, samples = 4 } = {}) {
  const size = renderer.getSize(new THREE.Vector2()), pr = renderer.getPixelRatio();
  const rt = new THREE.WebGLRenderTarget(size.x * pr, size.y * pr, { type: THREE.HalfFloatType, samples });
  const composer = new EffectComposer(renderer, rt);
  composer.addPass(new RenderPass(scene, camera));
  let gtao = null;
  if (ao) {
    gtao = new GTAOPass(scene, camera, size.x, size.y);
    gtao.output = GTAOPass.OUTPUT.Default; gtao.blendIntensity = 0.85;
    gtao.updateGtaoMaterial({ radius: 0.6, distanceExponent: 1.5, thickness: 1.5, scale: 1.1, samples: 12, distanceFallOff: 1, screenSpaceRadius: false });
    gtao.updatePdMaterial({ lumaPhi: 10, depthPhi: 2, normalPhi: 3, radius: 6, radiusExponent: 1, rings: 2, samples: 12 });
    // objectos transparentes/sprites não entram no cálculo de AO (senão aparecem como caixas escuras)
    const orig = gtao._overrideVisibility.bind(gtao);
    gtao._overrideVisibility = function () {
      orig();
      this.scene.traverse((o) => {
        if (!o.visible) return;
        const m = o.material, tr = m && (Array.isArray(m) ? m.some((x) => x.transparent) : m.transparent);
        if (o.isSprite || (o.isMesh && (tr || o.userData.noAO))) { this._visibilityCache.push(o); o.visible = false; }
      });
    };
    composer.addPass(gtao);
  }
  const tH = new ShaderPass(TILT), tV = new ShaderPass(TILT); tV.uniforms.dir.value.set(0, 1);
  composer.addPass(tH); composer.addPass(tV);
  composer.addPass(new OutputPass());
  const grade = new ShaderPass(GRADE); composer.addPass(grade);
  let time = 0;
  return {
    composer, tilt: [tH, tV],
    setSize(w, h) { composer.setPixelRatio(renderer.getPixelRatio()); composer.setSize(w, h); [tH, tV].forEach((p) => p.uniforms.res.value.set(w * renderer.getPixelRatio(), h * renderer.getPixelRatio())); grade.uniforms.res.value.set(w, h); },
    render(dt) { time += dt; grade.uniforms.time.value = time * 60 % 1000; composer.render(dt); },
    dispose() { composer.dispose(); rt.dispose(); },
  };
}
