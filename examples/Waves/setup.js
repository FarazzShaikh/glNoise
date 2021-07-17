import * as THREE from "https://cdn.skypack.dev/three";
import { OrbitControls } from "https://cdn.skypack.dev/three/examples/jsm/controls/OrbitControls.js";

let renderer, scene, camera, controls;

/**
 *
 * @returns {THREE.Scene}
 */
export function initScene() {
  // Creating a scene
  scene = new THREE.Scene();

  // Defining options
  const fov = 45;
  const aspectRatio = window.innerWidth / window.innerHeight;
  const nearPlane = 0.1;
  const farPlane = 1000;

  // Creating a camera
  camera = new THREE.PerspectiveCamera(fov, aspectRatio, nearPlane, farPlane);

  camera.position.set(5, 7, 5);
  camera.lookAt(0, 0, 0);

  // Creating a Renderer
  renderer = new THREE.WebGLRenderer({
    antialias: true, // 👈 Enable Antialiasing
    alpha: true,
  });
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

  // Setting the Renderer's size to the entire window
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Append Renderer to the body
  document.body.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; // Enables inertia on the camera making it come to a more gradual stop.
  controls.dampingFactor = 0.25; // Inertia factor

  return { scene, renderer };
}

export function initHelpers() {
  const size = 10;
  const divisions = 10;

  const gridHelper = new THREE.GridHelper(size, divisions);
  scene.add(gridHelper);

  const axesHelper = new THREE.AxesHelper(5);
  scene.add(axesHelper);
}

/**
 *
 * @param {number} dt
 * @param {Function} callback
 */
export function render(dt, callback) {
  callback(dt);
  controls.update();

  renderer.render(scene, camera);
  requestAnimationFrame((dt) => render(dt, callback));
}
