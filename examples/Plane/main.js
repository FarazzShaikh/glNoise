import * as THREE from "https://cdn.skypack.dev/three";
import { OrbitControls } from "https://cdn.skypack.dev/three/examples/jsm/controls/OrbitControls.js";
import {
  loadShadersCSM,
  Perlin,
  Simplex,
  Voronoi,
} from "../../build/glNoise.m.js";

import { CustomShaderMaterial, TYPES } from "../lib/three-csm.module.js";

const chunks = {
  frag: [Perlin, Simplex, Voronoi],
  vert: [Perlin, Simplex, Voronoi],
};

const paths = {
  defines: "./shaders/defines.glsl",
  header: "./shaders/header.glsl",
  main: "./shaders/main.glsl",
};

loadShadersCSM(paths, chunks).then((vertex) => {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const geometry = new THREE.PlaneGeometry(5, 5, 256, 256);
  const type = TYPES.NORMAL;
  const material = new CustomShaderMaterial({
    uniforms: [
      {
        uTime: { value: 1.0 },
        uColor: { value: new THREE.Color(1, 1, 1) },
        uResolution: { value: new THREE.Vector3() },
        uSeed: { value: Math.random() },
        uType: { value: localStorage.getItem("type") || 0 },
      },
    ],
    baseMaterial: type,
    vShader: {
      defines: vertex.defines,
      header: vertex.header,
      main: vertex.main,
    },
    passthrough: {
      wireframe: false,
      // lights: true,
      side: THREE.DoubleSide,
    },
  });
  const cube = new THREE.Mesh(geometry, material);
  cube.rotateX(-Math.PI / 2);
  scene.add(cube);

  camera.position.set(4, 4, 4);

  const size = 6;
  const divisions = 10;

  const gridHelper = new THREE.GridHelper(size, divisions);
  scene.add(gridHelper);

  const axesHelper = new THREE.AxesHelper(4);
  scene.add(axesHelper);

  const controls = new OrbitControls(camera, renderer.domElement);

  window.addEventListener(
    "storage",
    function (e) {
      material.uniforms.uType.value = this.localStorage.getItem("type");
    },
    false
  );

  const animate = function (time) {
    requestAnimationFrame(animate);

    const canvas = renderer.domElement;
    material.uniforms.uResolution.value.set(canvas.width, canvas.height, 1);
    material.uniforms.uTime.value = time * 0.0001;

    controls.update();
    renderer.render(scene, camera);
  };

  animate();
});
