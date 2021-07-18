import * as THREE from "https://cdn.skypack.dev/three";
import { Common } from "../../build/glNoise.m.js";
import { CustomShaderMaterial, TYPES } from "../lib/three-csm.module.js";

export default function waves(scene, mobile) {
  let material;
  material = new CustomShaderMaterial({
    baseMaterial: TYPES.TOON,
    vShader: {
      defines: ` `,
      header: `
      varying vec3 vPosition;
      `,
      main: `
      vec3 newPos = position;
      vPosition = position;
      vec3 newNormal = normal;
      `,
    },
    fShader: {
      defines: ` `,
      header: `
      ${Common}
      varying vec3 vPosition;

      vec4 calcColor() {

        vec4 diffuseColor;

        float mask;
        mask = mix(0.0, 1.0, gln_map(vPosition.z, -5.0, 5.0, 0.0, 1.0));
        mask = pow(mask, 8.0);

        diffuseColor = vec4(1.,0.929,0.851,1.);

        diffuseColor.rgb *= mask * 0.65;
        diffuseColor.a *= mask;

        return diffuseColor;
      }

      `,
      main: `
      vec4 newColor = calcColor();
      `,
    },
    uniforms: {},
    passthrough: {},
  });

  const geometry = new THREE.BoxGeometry(7, 7, 10, 1, 1, 1);
  const plane = new THREE.Mesh(geometry, material);
  plane.rotateX(-Math.PI / 2);
  plane.position.y = -7;
  plane.receiveShadow = true;

  if (!mobile) scene.add(plane);

  function displace(dt) {}

  return displace;
}
