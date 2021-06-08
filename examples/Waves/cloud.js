import * as THREE from "https://cdn.skypack.dev/three";

function rand(min, max) {
  return Math.random() * (max - min + 1) + min;
}

/**
 *
 * @param {THREE.Scene} scene
 */
export default function cloud(scene, position, scale) {
  const minTuff = 3;
  const maxTuff = 5;

  const nTuff = Math.floor(rand(minTuff, maxTuff));
  console.log(nTuff);

  const nCloud = 10;
  const clouds = [];

  const dummy = new THREE.Object3D();
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshPhongMaterial({ color: 0xd8d0d1 });
  for (let j = 0; j < nCloud; j++) {
    const cloud = new THREE.InstancedMesh(geometry, material, nTuff);
    cloud.position.set(rand(-2, 2), rand(1.5, 1.7), rand(-3, -10));
    cloud.scale.set(0.15, 0.15, 0.15);

    for (let i = 0; i < nTuff; i++) {
      const scale = rand(0.5, 1);
      dummy.scale.set(scale, scale, scale);
      dummy.rotation.set(scale, scale, scale);

      dummy.position.x = rand(-1, 1);
      dummy.position.y = rand(-1, 1);
      dummy.position.z = rand(-1, 1);

      dummy.castShadow = true;

      dummy.updateMatrix();
      cloud.setMatrixAt(i, dummy.matrix);
    }

    cloud.castShadow = true;

    if (position) cloud.position.set(position);
    if (scale) cloud.scale.set(position);

    scene.add(cloud);
    clouds.push(cloud);
  }

  function animate(dt) {
    clouds.forEach((c) => {
      c.position.z += 0.02;

      if (c.position.z > 3) {
        c.position.set(rand(-2, 2), rand(1.2, 1.5), -3);
      }
    });
  }
  return animate;
}
