import * as THREE from "https://cdn.skypack.dev/three";
import { OrbitControls } from "https://cdn.skypack.dev/three/examples/jsm/controls/OrbitControls.js";

import { CustomShaderMaterial, TYPES } from "../lib/three-csm.module.js";
import { loadShadersCSM, Common, Simplex } from "../../build/glNoise.m.js";

import waves from "./waves.js";

function lights(scene) {
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5, 100);
  const light = new THREE.HemisphereLight(0xffffff, 0xf7d9aa, 0.5);

  scene.add(light);
  scene.add(directionalLight);

  directionalLight.position.set(0, 1, 0); //default; light shining from top
  directionalLight.castShadow = true;

  directionalLight.shadow.mapSize.width = 512; // default
  directionalLight.shadow.mapSize.height = 512; // default
  directionalLight.shadow.camera.near = 0.5; // default
  directionalLight.shadow.camera.far = 500;
}

function map(x, in_min, in_max, out_min, out_max) {
  return ((x - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
}

function rand(min, max) {
  return map(Math.random(), 0, 1, min, max);
}

const v = {
  defines: "./shaders/particle_defines.glsl",
  header: "./shaders/particle_header.glsl",
  main: "./shaders/particle_main.glsl",
};

const f = {
  defines: "./shaders/frag/defines.glsl",
  header: "./shaders/frag/header.glsl",
  main: "./shaders/frag/main.glsl",
};

(async () => {
  const { defines: vdefines, header: vheader, main: vmain } = await loadShadersCSM(v);
  const { defines: fdefines, header: fheader, main: fmain } = await loadShadersCSM(f);
  const renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
  document.body.appendChild(renderer.domElement);

  const fov = 60;
  const aspect = window.innerWidth / window.innerHeight;
  const near = 0.1;
  const far = 200;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

  const controls = new OrbitControls(camera, renderer.domElement);
  camera.position.set(7, 7, 7);

  const scene = new THREE.Scene();

  lights(scene);

  const loader = new THREE.TextureLoader();
  const disk = loader.load("./textures/circle-sprite.png");

  const geometry = new THREE.IcosahedronGeometry(4, 64);
  console.log(geometry.attributes.position.count);
  const material = new CustomShaderMaterial({
    baseMaterial: TYPES.POINTS,
    vShader: {
      defines: vdefines,
      header: vheader,
      main: vmain,
    },
    fShader: {
      defines: fdefines,
      header: fheader,
      main: fmain,
    },
    uniforms: {
      uShift: {
        value: 0,
      },
      uShape: {
        value: disk,
      },
      uScale: {
        value: window.innerHeight / 2,
      },
      uTime: {
        value: 0,
      },
      uTargetPos: {
        value: new THREE.Vector3(0),
      },
    },
    passthrough: {
      size: 0.05,
    },
  });

  const points = new THREE.Points(geometry, material);

  scene.add(points);

  const targetPos = new THREE.Vector3();

  renderer.domElement.addEventListener("pointermove", (event) => {
    var vec = new THREE.Vector3(); // create once and reuse
    var pos = new THREE.Vector3(); // create once and reuse

    vec.set((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1, 0.5);

    vec.unproject(camera);

    vec.sub(camera.position).normalize();

    var distance = -camera.position.z / vec.z;

    pos.copy(camera.position).add(vec.multiplyScalar(distance));
    targetPos.x = pos.x;
    targetPos.y = pos.y;
    targetPos.z = pos.z;
  });

  const render = (time) => {
    if (material && material.uniforms) {
      material.uniforms.uTime.value = time * 0.001;
      //   const p = new THREE.Vector3(targetPos).sub(material.uniforms.uTargetPos.value).multiplyScalar(0.05);
      material.uniforms.uTargetPos.value = targetPos;
    }

    requestAnimationFrame(render);
    renderer.render(scene, camera);
    controls.update();
  };

  render();
})();
