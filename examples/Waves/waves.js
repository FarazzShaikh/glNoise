import * as THREE from "https://cdn.skypack.dev/three";
import { loadShadersCSM } from "../../build/glNoise.m.js";
import { CustomShaderMaterial, TYPES } from "../lib/three-csm.module.js";

function hex(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : null;
}

var hex2rgb = (str) => {
  return hex(str).map((x) => x / 255);
};

export default function waves(scene) {
  let material;
  const v = {
    defines: "./shaders/defines.glsl",
    header: "./shaders/header.glsl",
    main: "./shaders/main.glsl",
  };
  const f = {
    defines: "",
    header: "./shaders/fheader.glsl",
    main: "./shaders/fmain.glsl",
  };
  //   loadShaders(paths).then(([fragment, vertex]) => {
  loadShadersCSM(v).then((vertex) => {
    loadShadersCSM(f).then((fragment) => {
      const light1 = {
        value: {
          falloff: 0.15,
          radius: 10,
          position: new THREE.Vector3(5, 5, 5),
          color: hex2rgb("#f7d9aa"),
          ambient: hex2rgb("#adadad"),
        },
      };

      const uniforms = THREE.UniformsUtils.merge([
        THREE.UniformsLib.lights,
        THREE.UniformsLib.shadowmap,
        {
          ulightWorldPosition: { value: new THREE.Vector3(1, 1, 1) },
          u_reverseLightDirection: { value: new THREE.Vector3(0.5, 0.7, 1) },

          ulight1: light1,
          uTime: { value: 0 },
        },
      ]);

      material = new CustomShaderMaterial({
        baseMaterial: TYPES.PHONG,
        vShader: {
          defines: vertex.defines,
          header: vertex.header,
          main: vertex.main,
        },
        fShader: {
          defines: fragment.defines,
          header: fragment.header,
          main: fragment.main,
        },
        uniforms: uniforms,
        passthrough: {
          side: THREE.DoubleSide,
          flatShading: true,
          color: 0x68c3c0,
          shininess: 1,
        },
      });

      const geometry = new THREE.PlaneGeometry(5, 5, 32, 32);
      const plane = new THREE.Mesh(geometry, material);
      plane.rotateX(-Math.PI / 2);
      plane.receiveShadow = true;
      scene.add(plane);
    });
  });

  function displace(dt) {
    if (material && material.uniforms) {
      material.uniforms.uTime.value = dt;
    }
  }

  return displace;
}
