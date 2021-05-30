import * as THREE from "https://cdn.skypack.dev/three";
import { OrbitControls } from "https://cdn.skypack.dev/three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three/examples/jsm/loaders/GLTFLoader.js";
import { loadShaders } from "../../build/glNoise.m.js";

import * as dat from "../lib/dat.gui.module.js";
import Stats from "../lib/stats.js";

const paths = ["./shaders/fragment.glsl", "./shaders/vertex.glsl"];

function hex(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16),
      ]
    : null;
}

var hex2rgb = (str) => {
  return hex(str).map((x) => x / 255);
};

class GUIOpts {
  constructor(def, min, max, step) {
    this.def = def;
    this.min = min;
    this.max = max;
    this.step = step;
  }
}

const ridgeOpts = {
  seed: new GUIOpts(Math.random(), null, null, null),
  persistance: new GUIOpts(0.5, 0.01, 2, 0.01),
  lacunarity: new GUIOpts(2, 0.1, 4, 0.01),
  scale: new GUIOpts(1, 0.01, 5, 0.01),
  redistribution: new GUIOpts(1, 0.1, 5, 0.01),
  octaves: new GUIOpts(7, 1, 10, 1),
  terbulance: new GUIOpts(true, null, null, null),
  ridge: new GUIOpts(true, null, null, null),
};

const SimplexOpts = {
  seed: new GUIOpts(Math.random(), null, null, null),
  persistance: new GUIOpts(0.5, 0.01, 2, 0.01),
  lacunarity: new GUIOpts(2, 0.1, 4, 0.01),
  scale: new GUIOpts(1, 0.01, 5, 0.01),
  redistribution: new GUIOpts(1, 0.1, 5, 0.01),
  octaves: new GUIOpts(7, 1, 10, 1),
  terbulance: new GUIOpts(false, null, null, null),
  ridge: new GUIOpts(false, null, null, null),
};

const maskOpts = {
  scale: new GUIOpts(0.5, 0.01, 5, 0.01),
};

const worldOpts = {
  height: new GUIOpts(1, 0.01, 10, 0.01),
  simplexFac: new GUIOpts(0.5, 0.01, 5, 0.01),
  seaLevel: new GUIOpts(0.22, -2, 2, 0.01),
  simplexOpacity: new GUIOpts(0.2, 0, 1, 0.01),
};

function GUI2Uniform(obj) {
  const o = {};

  Object.keys(obj).forEach((k) => {
    o[k] = obj[k].def;
  });

  return o;
}

loadShaders(paths).then(([fragment, vertex, v_moon, f_moon]) => {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

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
  });

  const geometry = new THREE.IcosahedronGeometry(3, 64);
  const sphere = new THREE.Mesh(geometry, material);
  scene.add(sphere);

  const loader = new GLTFLoader();

  const parent = new THREE.Object3D();
  scene.add(parent);

  loader.load(
    "./models/scene.gltf",
    function (gltf) {
      console.log(gltf);
      gltf.scene.children[0].scale.x = 0.0001;
      gltf.scene.children[0].scale.y = 0.0001;
      gltf.scene.children[0].scale.z = 0.0001;

      gltf.scene.children[0].position.y += 5;
      parent.add(gltf.scene);
    },
    undefined,
    function (error) {
      console.error(error);
    }
  );

  var pivot1 = new THREE.Object3D();
  pivot1.rotation.z = 0;
  parent.add(pivot1);

  camera.position.set(6, 6, 6);

  const size = 6;
  const divisions = 10;

  const gridHelper = new THREE.GridHelper(size, divisions);
  scene.add(gridHelper);

  const axesHelper = new THREE.AxesHelper(4);
  scene.add(axesHelper);

  const controls = new OrbitControls(camera, renderer.domElement);

  const light = new THREE.PointLight(
    new THREE.Color(...light1.value.color),
    1,
    100
  );
  light.position.set(
    light1.value.position.x,
    light1.value.position.y,
    light1.value.position.z
  );
  scene.add(light);

  const gui = new dat.gui.GUI();

  const uniforms = {
    "Ridge Options": "uRidgeOpts",
    "Simplex Options": "uSimplexOpts",
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
      if (opt.min !== null)
        folder.add(u.value, k).min(opt.min).max(opt.max).step(opt.step).name(k);
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

    // moon.rotation.z += 0.005;
    parent.rotation.z += 0.005;
    parent.rotation.x += 0.005;

    stats.end();
    requestAnimationFrame(animate);
  };

  animate();
});
