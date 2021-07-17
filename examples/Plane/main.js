import * as THREE from "https://cdn.skypack.dev/three";
import * as dat from "../lib/dat.gui.module.js";
import { OrbitControls } from "https://cdn.skypack.dev/three/examples/jsm/controls/OrbitControls.js";
import { loadShadersCSM } from "../../build/glNoise.m.js";

import { CustomShaderMaterial, TYPES } from "../lib/three-csm.module.js";

const paths = {
  defines: "./shaders/defines.glsl",
  header: "./shaders/header.glsl",
  main: "./shaders/main.glsl",
};

loadShadersCSM(paths).then((vertex) => {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const geometry = new THREE.PlaneGeometry(5, 5, 256, 256);
  const type = TYPES.NORMAL;
  const material = new CustomShaderMaterial({
    uniforms: {
      uTime: { value: 1.0 },
      uColor: { value: new THREE.Color(1, 1, 1) },
      uResolution: { value: new THREE.Vector3() },
      uSeed: { value: Math.random() },
      uType: { value: 0 },

      uPersistance: { value: 0.3 },
      uLacunarity: { value: 2.0 },
      uScale: { value: 0.5 },
      uOctaves: { value: 5 },
      uDistance: { value: 0 },
      uInvert: { value: false },
    },

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

  let doesAnimate = {
    value: true,
  };

  let gui_fbmHidden = true;
  let gui_voronoiHidden = true;
  let gui_folder_fmb;
  let gui_folder_voronoi;
  let gui;

  function initGui() {
    gui = new dat.gui.GUI();

    gui.add(doesAnimate, "value").name("Move with time?");
    gui.add(material.uniforms.uScale, "value").min(0).max(10).step(0.01).name("Scale");

    gui
      .add(material.uniforms.uType, "value", {
        "Perlin Noise": 0,
        "Simplex Noise": 1,
        "FBM (Perlin)": 2,
        "FBM (Simplex)": 3,
        "Ridge Noise": 4,
        Worley: 5,
        "FBM (Worley)": 6,
      })
      .name("Type")
      .onChange((e) => {
        if (e == 2 || e == 3 || e == 4 || e == 6) {
          if (gui_fbmHidden) {
            gui_folder_fmb.show();
            gui_folder_fmb.open();
            gui_fbmHidden = false;
            gui_folder_voronoi.hide();
            gui_voronoiHidden = true;
          }
        } else if (e == 5) {
          if (gui_voronoiHidden) {
            gui_folder_voronoi.show();
            gui_folder_voronoi.open();
            gui_voronoiHidden = false;
            gui_folder_fmb.hide();
            gui_fbmHidden = true;
          }
        } else {
          gui_folder_fmb.hide();
          gui_fbmHidden = true;
          gui_folder_voronoi.hide();
          gui_voronoiHidden = true;
        }
      });

    gui_folder_fmb = gui.addFolder("FBM");
    gui_folder_fmb.hide();
    gui_folder_fmb.add(material.uniforms.uPersistance, "value").min(0).max(1).step(0.01).name("Smoothness");

    gui_folder_fmb.add(material.uniforms.uLacunarity, "value").min(0).max(4).step(0.01).name("Detail");

    gui_folder_fmb.add(material.uniforms.uOctaves, "value").min(0).max(10).step(1).name("Octaves");

    gui_folder_voronoi = gui.addFolder("Voronoi");
    gui_folder_voronoi.hide();
    gui_folder_voronoi.add(material.uniforms.uDistance, "value").min(0).max(10).step(1).name("Distance");

    gui_folder_voronoi.add(material.uniforms.uInvert, "value").name("Invert");
  }

  const animate = function (time) {
    requestAnimationFrame(animate);

    const canvas = renderer.domElement;
    if (material && material.uniforms) {
      material.uniforms.uResolution.value.set(canvas.width, canvas.height, 1);
      if (doesAnimate.value) material.uniforms.uTime.value = time * 0.0001;

      if (!gui) {
        initGui();
      }
    }

    controls.update();
    renderer.render(scene, camera);
  };

  animate();
});
