import * as THREE from "https://cdn.skypack.dev/three";
import { OrbitControls } from "https://cdn.skypack.dev/three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three/examples/jsm/loaders/GLTFLoader.js";
import { loadShaders } from "../../build/glNoise.m.js";

import * as dat from "../lib/dat.gui.module.js";
import Stats from "../lib/stats.js";

const paths = ["./shaders/fragment.glsl", "./shaders/vertex.glsl"];

function hex(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : null;
}

var hex2rgb = (str) => {
  return hex(str).map((x) => x / 255);
};

class GUIOpts {
  constructor(def, min, max, step, name) {
    this.def = def;
    this.min = min;
    this.max = max;
    this.step = step;
    this.name = name;
  }
}

const ridgeOpts = {
  seed: new GUIOpts(Math.random() * 1000, null, null, null, "Seed"),
  persistance: new GUIOpts(0.5, 0.01, 2, 0.01, "Smoothness"),
  lacunarity: new GUIOpts(2, 0.1, 4, 0.01, "Detail"),
  scale: new GUIOpts(1, 0.01, 5, 0.01, "Scale"),
  redistribution: new GUIOpts(1, 0.1, 5, 0.01, "Flatness"),
  octaves: new GUIOpts(7, 1, 10, 1, "Number of Layers"),
  terbulance: new GUIOpts(true, null, null, null, "Terbulance"),
  ridge: new GUIOpts(true, null, null, null, "Ridges"),
};

const SimplexOpts = {
  seed: new GUIOpts(Math.random() * 1000, null, null, null, "Seed"),
  persistance: new GUIOpts(0.5, 0.01, 2, 0.01, "Smoothness"),
  lacunarity: new GUIOpts(2, 0.1, 4, 0.01, "Detail"),
  scale: new GUIOpts(1, 0.01, 5, 0.01, "Scale"),
  redistribution: new GUIOpts(1, 0.1, 5, 0.01, "Flatness"),
  octaves: new GUIOpts(7, 1, 10, 1, "Number of Layers"),
  terbulance: new GUIOpts(false, null, null, null, "Terbulance"),
  ridge: new GUIOpts(false, null, null, null, "Ridges"),
};

const maskOpts = {
  scale: new GUIOpts(0.5, 0.01, 5, 0.01, "Scale"),
};

const worldOpts = {
  height: new GUIOpts(1, 0.01, 10, 0.01, "World Height"),
  seaLevel: new GUIOpts(0.22, -2, 2, 0.01, "Sea Level"),
  simplexOpacity: new GUIOpts(0.2, 0, 1, 0.01, "World Detail"),
};

function GUI2Uniform(obj) {
  const o = {};

  Object.keys(obj).forEach((k) => {
    o[k] = obj[k].def;
  });

  return o;
}

loadShaders(paths).then(([fragment, vertex]) => {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputEncoding = THREE.sRGBEncoding;
  document.body.appendChild(renderer.domElement);

  const light1 = {
    value: {
      falloff: 0.15,
      radius: 20,
      position: new THREE.Vector3(5, 5, 5),
      color: hex2rgb("#ffc868"),
      ambient: hex2rgb("#0a040b"),
    },
  };

  const material = new THREE.ShaderMaterial({
    uniforms: {
      ulightWorldPosition: { value: new THREE.Vector3(1, 1, 1) },
      u_reverseLightDirection: { value: new THREE.Vector3(0.5, 0.7, 1) },

      ulight1: light1,

      uWorldOpts: { value: GUI2Uniform(worldOpts) },
      uRidgeOpts: { value: GUI2Uniform(ridgeOpts) },
      uMaskOpts: { value: GUI2Uniform(maskOpts) },
      uSimplexOpts: { value: GUI2Uniform(SimplexOpts) },
    },
    fragmentShader: fragment,
    vertexShader: vertex,
    extensions: {
      derivatives: true,
    },
  });

  const geometry = new THREE.IcosahedronGeometry(3, 80);
  const sphere = new THREE.Mesh(geometry, material);
  scene.add(sphere);

  camera.position.set(4, 4, 4);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enablePan = false;

  const light = new THREE.PointLight(new THREE.Color(...light1.value.color), 1, 100);
  light.position.set(light1.value.position.x, light1.value.position.y, light1.value.position.z);
  scene.add(light);

  const gui = new dat.gui.GUI();

  const doesAnimate = {
    value: true,
  };

  gui.add(doesAnimate, "value").name("Rotation");

  var obj = {
    rand: function () {
      material.uniforms.uRidgeOpts.value.seed = Math.random() * 1000;
      material.uniforms.uSimplexOpts.value.seed = Math.random() * 1000;
    },
  };

  gui.add(obj, "rand").name("Randomize");

  const uniforms = {
    "Ridge Noise Options": "uRidgeOpts",
    "Simplex Noise Options": "uSimplexOpts",
    "World Options": "uWorldOpts",
    "Mask Options": "uMaskOpts",
  };

  const opts = [ridgeOpts, SimplexOpts, worldOpts, maskOpts];

  Object.keys(uniforms).forEach((ku, i) => {
    const matk = uniforms[ku];
    const u = material.uniforms[matk];

    const folder = gui.addFolder(ku);
    folder.open();

    const opto = opts[i];

    Object.keys(u.value).forEach((k) => {
      const opt = opto[k];
      if (opt.min !== null) folder.add(u.value, k).min(opt.min).max(opt.max).step(opt.step).name(opt.name);
      else folder.add(u.value, k).name(k);
    });
  });

  const stats = new Stats();
  stats.showPanel(0);
  const h = stats.dom.children[0].height;

  stats.dom.style.cssText = `
    position: fixed;
    bottom: ${h / 2}px;
    left: 0px;
    cursor: pointer;
    opacity: 0.9;
    z-index: 10000;
      `;
  document.body.appendChild(stats.dom);

  const animate = function () {
    stats.begin();

    controls.update();
    renderer.render(scene, camera);

    if (doesAnimate.value) {
      sphere.rotation.y += 0.001;
      sphere.rotation.x -= 0.001;
    }

    stats.end();
    requestAnimationFrame(animate);
  };

  animate();
});
