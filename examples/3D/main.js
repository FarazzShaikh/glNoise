import * as THREE from "https://cdn.skypack.dev/three";
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
      uType: { value: localStorage.getItem("type") || 0 },
      uIsSphere: { value: 0 },
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

  window.addEventListener(
    "storage",
    function (e) {
      material.uniforms.uType.value = this.localStorage.getItem("type");
      material2.uniforms.uType.value = this.localStorage.getItem("type");
    },
    false
  );

  const animate = function (time) {
    requestAnimationFrame(animate);

    const canvas = renderer.domElement;
    material.uniforms.uResolution.value.set(canvas.width, canvas.height, 1);
    material.uniforms.uTime.value = time * 0.0001;
    material2.uniforms.uResolution.value.set(canvas.width, canvas.height, 1);
    material2.uniforms.uTime.value = time * 0.0001;

    controls.update();
    renderer.render(scene, camera);
  };

  animate();
});
