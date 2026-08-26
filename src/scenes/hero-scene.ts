/**
 * La scena dell'hero: luce, nebbia, acqua. Nessun oggetto riconoscibile.
 *
 * Questo modulo è caricato SOLO con un import dinamico, dopo l'hydration e
 * solo se l'hero è in viewport e il visitatore non ha chiesto meno
 * movimento. Non sta nel bundle iniziale e non entra mai nel percorso
 * critico: finché non arriva (o se non arriva mai) resta il poster.
 *
 * L'immagine è tutta in un raymarch a schermo intero:
 *   - il cielo è nero quasi puro con una sola sorgente lontana;
 *   - la nebbia è integrata lungo il raggio con scattering in avanti
 *     (Henyey-Greenstein), quindi i coni di luce nascono dalla fisica
 *     invece che da una sfumatura radiale;
 *   - l'acqua è un piano con normali animate: la riflessione è un raggio
 *     davvero riflesso sul cielo, con Fresnel, non un alone finto.
 */

import type { PerspectiveCamera } from 'three';

export interface SceneColors {
  core: [number, number, number];
  halo: [number, number, number];
  accent: [number, number, number];
}

export interface SceneHandle {
  play(): void;
  pause(): void;
  resize(): void;
  /** Disegna un fotogramma singolo al tempo dato. Serve al poster. */
  drawAt(t: number): void;
  dispose(): void;
  /** Millisecondi dell'ultimo fotogramma, misurati sul thread principale. */
  lastFrameMs(): number;
  /** Fotogrammi disegnati da quando la scena è viva. Serve a misurare. */
  frames(): number;
}

const VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const FRAG = /* glsl */ `
  precision highp float;

  varying vec2 vUv;

  uniform vec2  uRes;
  uniform float uTime;
  uniform vec3  uCore;
  uniform vec3  uHalo;
  uniform vec3  uAccent;

  const float PI = 3.14159265;

  float hash21(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float hash31(vec3 p) {
    p = fract(p * 0.3183099 + vec3(0.1, 0.2, 0.3));
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }

  float noise2(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash21(i), hash21(i + vec2(1.0, 0.0)), u.x),
               mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0, 1.0)), u.x), u.y);
  }

  float noise3(vec3 p) {
    vec3 i = floor(p), f = fract(p);
    vec3 u = f * f * (3.0 - 2.0 * f);
    float n000 = hash31(i);
    float n100 = hash31(i + vec3(1.0, 0.0, 0.0));
    float n010 = hash31(i + vec3(0.0, 1.0, 0.0));
    float n110 = hash31(i + vec3(1.0, 1.0, 0.0));
    float n001 = hash31(i + vec3(0.0, 0.0, 1.0));
    float n101 = hash31(i + vec3(1.0, 0.0, 1.0));
    float n011 = hash31(i + vec3(0.0, 1.0, 1.0));
    float n111 = hash31(i + vec3(1.0, 1.0, 1.0));
    return mix(mix(mix(n000, n100, u.x), mix(n010, n110, u.x), u.y),
               mix(mix(n001, n101, u.x), mix(n011, n111, u.x), u.y), u.z);
  }

  float fbm3(vec3 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 3; i++) { v += a * noise3(p); p *= 2.07; a *= 0.5; }
    return v;
  }

  /** Scattering in avanti: è questo a trasformare la nebbia in coni di luce. */
  float henyeyGreenstein(float cosT, float g) {
    float g2 = g * g;
    return (1.0 - g2) / (4.0 * PI * pow(1.0 + g2 - 2.0 * g * cosT, 1.5));
  }

  /** Altezza della superficie: onde direzionali più rumore, quattro ottave. */
  float waveHeight(vec2 p, float t) {
    float h = 0.0, a = 0.055, f = 1.0;
    for (int i = 0; i < 4; i++) {
      float fi = float(i);
      vec2 dir = vec2(sin(fi * 2.13 + 0.7), cos(fi * 1.71));
      h += a * sin(dot(p, dir) * f * 2.4 + t * (0.75 + fi * 0.42));
      h += a * 0.55 * (noise2(p * f * 1.6 + vec2(t * 0.11, -t * 0.08)) - 0.5);
      a *= 0.54; f *= 1.92;
    }
    return h;
  }

  vec3 waterNormal(vec2 p, float t, float lod) {
    float e = 0.010 + lod * 0.05;
    float hL = waveHeight(p - vec2(e, 0.0), t);
    float hR = waveHeight(p + vec2(e, 0.0), t);
    float hD = waveHeight(p - vec2(0.0, e), t);
    float hU = waveHeight(p + vec2(0.0, e), t);
    return normalize(vec3(hL - hR, 2.0 * e, hD - hU));
  }

  /** Caustiche: prodotto di due reticoli a cresta su dominio deformato. */
  float caustics(vec2 p, float t) {
    vec2 q = p + 0.55 * vec2(noise2(p * 1.1 + t * 0.09), noise2(p * 1.1 + 5.2 - t * 0.07));
    float a = 1.0 - abs(noise2(q * 2.0 + vec2(0.0, t * 0.14)) * 2.0 - 1.0);
    float b = 1.0 - abs(noise2(q * 3.1 + vec2(-t * 0.10, 0.0)) * 2.0 - 1.0);
    return pow(clamp(a * b, 0.0, 1.0), 5.0);
  }

  /** ACES approssimata: i colpi di luce rotolano invece di tagliarsi. */
  vec3 tonemap(vec3 x) {
    const float a = 2.51, b = 0.03, c = 2.43, d = 0.59, e = 0.14;
    return clamp((x * (a * x + b)) / (x * (c * x + d) + e), 0.0, 1.0);
  }

  vec3 lightPosition(float t, vec3 ro) {
    return vec3(2.45, 3.15, ro.z + 9.5);
  }

  /** Il cielo: nero quasi puro più una sorgente sola. Serve anche al riflesso. */
  vec3 sky(vec3 rd, vec3 ro, float t) {
    vec3 col = vec3(0.006, 0.007, 0.011);
    vec3 toLight = normalize(lightPosition(t, ro) - ro);
    float d = max(dot(rd, toLight), 0.0);
    col += uCore * pow(d, 5200.0) * 9.0;
    col += uCore * pow(d, 900.0) * 0.30;
    col += uHalo * pow(d, 90.0) * 0.055;
    col += uHalo * pow(d, 9.0) * 0.010;
    return col;
  }

  void main() {
    vec2 frag = vUv * uRes;
    vec2 uv = (frag - 0.5 * uRes) / uRes.y;
    float t = uTime;

    // --- Camera: deriva lentissima. È il movimento che dà profondità:
    //     senza, la scena resta un fondale.
    vec3 ro = vec3(
      sin(t * 0.043) * 0.42,
      1.62 + sin(t * 0.061) * 0.06,
      t * 0.075
    );
    vec3 ta = ro + vec3(sin(t * 0.037) * 0.22, -0.105 + sin(t * 0.052) * 0.018, 1.0);

    vec3 fw = normalize(ta - ro);
    vec3 rt = normalize(cross(vec3(0.0, 1.0, 0.0), fw));
    vec3 up = cross(fw, rt);
    vec3 rd = normalize(uv.x * rt + uv.y * up + 1.5 * fw);

    vec3 lp = lightPosition(t, ro);

    // --- L'acqua: piano y = 0.
    float tw = 1e9;
    if (rd.y < -0.0015) tw = -ro.y / rd.y;
    bool hitWater = tw > 0.0 && tw < 260.0;

    vec3 col;

    if (hitWater) {
      vec3 p = ro + rd * tw;
      // Con la distanza le onde si appiattiscono, o l'orizzonte formicola.
      float lod = clamp(tw * 0.02, 0.0, 1.0);
      vec3 n = waterNormal(p.xz, t, lod);
      n = normalize(mix(n, vec3(0.0, 1.0, 0.0), lod * 0.82));

      vec3 refl = reflect(rd, n);
      vec3 reflCol = sky(refl, p, t);

      // Fresnel: radente riflette quasi tutto, a picco si vede sotto.
      float fres = pow(1.0 - max(dot(-rd, n), 0.0), 5.0);
      fres = mix(0.035, 1.0, fres);

      vec3 toLight = normalize(lp - p);
      float spec = pow(max(dot(refl, toLight), 0.0), 420.0);

      float c = caustics(p.xz * 1.25, t);
      c = pow(c, 2.2);
      float depthFade = exp(-tw * 0.20);
      vec3 under = uAccent * c * 0.30 + uHalo * c * 0.05;
      under *= depthFade;

      col = mix(under, reflCol, fres);
      col += uCore * spec * 2.4 * (0.2 + 0.8 * depthFade);
    } else {
      col = sky(rd, ro, t);
    }

    // --- Nebbia volumetrica lungo il raggio.
    float tEnd = hitWater ? min(tw, 34.0) : 34.0;
    const int STEPS = 26;
    float stepSize = tEnd / float(STEPS);
    float jitter = hash21(frag + fract(t)) * stepSize;
    vec3 fog = vec3(0.0);
    float transmittance = 1.0;

    for (int i = 0; i < STEPS; i++) {
      float dist = jitter + float(i) * stepSize;
      if (dist >= tEnd) break;
      vec3 p = ro + rd * dist;
      if (p.y < -0.05) break;

      float dens = fbm3(p * 0.62 + vec3(0.0, t * 0.035, -t * 0.05));
      dens = smoothstep(0.40, 0.86, dens);
      dens *= exp(-max(p.y, 0.0) * 0.62);
      if (dens <= 0.001) continue;

      vec3 toLight = lp - p;
      float dl2 = dot(toLight, toLight);
      vec3 toLightN = toLight * inversesqrt(dl2);
      float phase = henyeyGreenstein(dot(rd, toLightN), 0.84);
      float atten = 1.0 / (1.0 + 0.045 * dl2);

      float sigma = dens * 0.13;
      vec3 inScatter = uHalo * phase * atten * 30.0;
      fog += transmittance * inScatter * sigma * stepSize;
      transmittance *= exp(-sigma * stepSize);
      if (transmittance < 0.02) break;
    }

    col = col * transmittance + fog;

    col = tonemap(col * 0.40);

    // --- Grana: senza, i neri fanno banding a fasce.
    col += (hash21(frag * 1.7 + fract(t) * 91.7) - 0.5) * 0.012;

    gl_FragColor = vec4(max(col, vec3(0.0)), 1.0);
  }
`;

export async function createScene(
  canvas: HTMLCanvasElement,
  colors: SceneColors,
  options: { fps?: number; maxDpr?: number; renderScale?: number } = {},
): Promise<SceneHandle | null> {
  const fps = options.fps ?? 40;
  const maxDpr = options.maxDpr ?? 1.5;
  const renderScale = options.renderScale ?? 0.85;

  const THREE = await import('three');
  const { EffectComposer } = await import('three/examples/jsm/postprocessing/EffectComposer.js');
  const { RenderPass } = await import('three/examples/jsm/postprocessing/RenderPass.js');
  const { UnrealBloomPass } = await import('three/examples/jsm/postprocessing/UnrealBloomPass.js');
  const { OutputPass } = await import('three/examples/jsm/postprocessing/OutputPass.js');

  let renderer: InstanceType<typeof THREE.WebGLRenderer>;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false, powerPreference: 'low-power' });
  } catch {
    return null;
  }

  renderer.setClearColor(0x050507, 1);

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1) as unknown as PerspectiveCamera;

  const uniforms = {
    uRes: { value: new THREE.Vector2(1, 1) },
    uTime: { value: 0 },
    uCore: { value: new THREE.Vector3(...colors.core) },
    uHalo: { value: new THREE.Vector3(...colors.halo) },
    uAccent: { value: new THREE.Vector3(...colors.accent) },
  };

  const material = new THREE.ShaderMaterial({
    vertexShader: VERT,
    fragmentShader: FRAG,
    uniforms,
    depthTest: false,
    depthWrite: false,
  });

  scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material));

  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));

  // Il bloom è quello che fa sembrare la luce una sorgente e non un disco.
  const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.42, 0.45, 0.82);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());

  let frame = 0;
  let disposed = false;
  let lastDraw = 0;
  let frameMs = 0;
  let drawn = 0;
  const minDelta = 1000 / fps;

  let scale = renderScale;
  const intervals: number[] = [];
  let downgrades = 0;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, maxDpr) * scale;
    const w = Math.max(1, canvas.clientWidth);
    const h = Math.max(1, canvas.clientHeight);
    renderer.setPixelRatio(dpr);
    renderer.setSize(w, h, false);
    composer.setPixelRatio(dpr);
    composer.setSize(w, h);
    uniforms.uRes.value.set(w * dpr, h * dpr);
  }

  function drawAt(t: number) {
    const started = performance.now();
    uniforms.uTime.value = t;
    composer.render();
    drawn++;
    frameMs = performance.now() - started;
  }

  function loop(now: number) {
    if (disposed) return;
    frame = requestAnimationFrame(loop);
    // Frame rate limitato: la scena è lenta, 40 fps non si distinguono da
    // 60 e un terzo del lavoro sulla GPU sparisce.
    if (now - lastDraw < minDelta) return;
    const gap = lastDraw ? now - lastDraw : minDelta;
    lastDraw = now;
    drawAt(now / 1000);

    // Se il passo reale resta lontano dal tetto, la macchina non ce la fa:
    // si abbassa la risoluzione interna. Due gradini, poi basta.
    if (downgrades < 2) {
      intervals.push(gap);
      if (intervals.length >= 20) {
        const median = [...intervals].sort((a, b) => a - b)[10];
        intervals.length = 0;
        if (median > minDelta * 2.2) {
          downgrades += 1;
          scale = Math.max(0.45, scale * 0.72);
          resize();
        }
      }
    }
  }

  resize();
  drawAt(0);

  return {
    play() {
      if (disposed || frame) return;
      frame = requestAnimationFrame(loop);
    },
    pause() {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
    },
    resize,
    drawAt,
    lastFrameMs: () => frameMs,
    frames: () => drawn,
    dispose() {
      disposed = true;
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      composer.dispose();
      material.dispose();
      renderer.dispose();
    },
  };
}
