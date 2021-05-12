import * as THREE from "https://cdn.skypack.dev/three";
import { OrbitControls } from "https://cdn.skypack.dev/three/examples/jsm/controls/OrbitControls.js";
import {
  loadShaders,
  Perlin,
  Utils,
  Noise,
  Simplex,
  Voronoi,
} from "../../build/glNoise.m.js";

import { CustomShaderMaterial, TYPES } from "../lib/three-csm.module.js";

const chunks = {
  frag: [Perlin, Utils, Noise, Simplex, Voronoi],
  vert: [Perlin, Utils, Noise, Simplex, Voronoi],
};

loadShaders("./shader_f.glsl", "./shader_v.glsl", chunks, true).then(
  ([fragment, vertex]) => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    const renderer = new THREE.WebGLRenderer();
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
          seed: { value: Math.random() },
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
      },
    });
    const cube = new THREE.Mesh(geometry, material);
    cube.rotateX(-Math.PI / 2);
    scene.add(cube);

    camera.position.set(0, 4, 0);

    const controls = new OrbitControls(camera, renderer.domElement);

    const animate = function (time) {
      requestAnimationFrame(animate);

      const canvas = renderer.domElement;
      material.uniforms.uResolution.value.set(canvas.width, canvas.height, 1);
      material.uniforms.uTime.value = time;

      controls.update();
      renderer.render(scene, camera);
    };

    animate();
  }
);
