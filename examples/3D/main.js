import * as THREE from "https://cdn.skypack.dev/three";
import * as dat from "../lib/dat.gui.module.js";
import { OrbitControls } from "https://cdn.skypack.dev/three/examples/jsm/controls/OrbitControls.js";
import { loadShaders } from "../../build/glNoise.m.js";

const paths = ["./shaders/fragment.glsl", "./shaders/vertex.glsl"];

loadShaders(paths).then(([fragment, vertex]) => {
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

  const geometry = new THREE.BoxGeometry(2, 2, 2);
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 1.0 },
      uResolution: { value: new THREE.Vector3() },
      uType: { value: 0 },
      uIsSphere: { value: 0 },

      uPersistance: { value: 0.5 },
      uLacunarity: { value: 2.0 },
      uScale: { value: 1.0 },
      uOctaves: { value: 5 },
    },
    fragmentShader: fragment,
    vertexShader: vertex,
  });

  const cube = new THREE.Mesh(geometry, material);
  cube.rotateX(-Math.PI / 2);
  cube.position.x -= 2;
  scene.add(cube);

  const geometry2 = new THREE.IcosahedronGeometry(0.8, 32);
  const material2 = material.clone();
  material2.uniforms.uIsSphere.value = 1;

  const sphere = new THREE.Mesh(geometry2, material2);
  sphere.position.x += 2;
  scene.add(sphere);

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
  let gui_folder_fmb;
  const gui = new dat.gui.GUI();

  gui.add(doesAnimate, "value").name("Move with time?");
  gui
    .add(material.uniforms.uScale, "value")
    .min(0)
    .max(10)
    .step(0.01)
    .name("Scale")
    .onChange((v) => gui_chnageHandler("uScale", v));

  gui
    .add(material.uniforms.uType, "value", {
      "Perlin Noise": 0,
      "Simplex Noise": 1,
      "FBM (Perlin)": 2,
      "FBM (Simplex)": 3,
      "Ridge Noise": 4,
    })
    .name("Type")
    .onChange((e) => {
      gui_chnageHandler("uType", e);
      if (e == 2 || e == 3 || e == 4) {
        if (gui_fbmHidden) {
          gui_folder_fmb.show();
          gui_folder_fmb.open();
          gui_fbmHidden = false;
        }
      } else {
        gui_folder_fmb.hide();
        gui_fbmHidden = true;
      }
    });

  gui_folder_fmb = gui.addFolder("FBM");
  gui_folder_fmb.hide();
  gui_folder_fmb
    .add(material.uniforms.uPersistance, "value")
    .min(0)
    .max(1)
    .step(0.01)
    .name("Smoothness")
    .onChange((v) => gui_chnageHandler("uPersistance", v));

  gui_folder_fmb
    .add(material.uniforms.uLacunarity, "value")
    .min(0)
    .max(4)
    .step(0.01)
    .name("Detail")
    .onChange((v) => gui_chnageHandler("uLacunarity", v));

  gui_folder_fmb
    .add(material.uniforms.uOctaves, "value")
    .min(0)
    .max(10)
    .step(1)
    .name("Octaves")
    .onChange((v) => gui_chnageHandler("uOctaves", v));

  function gui_chnageHandler(ele, v) {
    material2.uniforms[ele].value = v;
  }

  const animate = function (time) {
    requestAnimationFrame(animate);

    const canvas = renderer.domElement;
    material.uniforms.uResolution.value.set(canvas.width, canvas.height, 1);
    if (doesAnimate.value) material.uniforms.uTime.value = time * 0.0001;
    material2.uniforms.uResolution.value.set(canvas.width, canvas.height, 1);
    if (doesAnimate.value) material2.uniforms.uTime.value = time * 0.0001;

    controls.update();
    renderer.render(scene, camera);
  };

  animate();
});
