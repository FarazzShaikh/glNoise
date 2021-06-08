import * as THREE from "https://cdn.skypack.dev/three";

function map(x, in_min, in_max, out_min, out_max) {
  return ((x - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
}

function rand(min, max) {
  return map(Math.random(), 0, 1, min, max);
}

export default function particles(scene) {
  const nparticles = 50;
  const dummy = new THREE.Object3D();

  const geometry = new THREE.BoxGeometry(0.1, 0.1, 0.11);
  const material = new THREE.MeshPhongMaterial({ color: 0x7dfff4 });
  const particleSystem = new THREE.InstancedMesh(geometry, material, nparticles);
  particleSystem.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  scene.add(particleSystem);

  for (let i = 0; i < nparticles; i++) {
    dummy.position.x = rand(0, 1) - 0.5;
    dummy.position.z = (i / nparticles) * 3;
    dummy.position.y = 1.5;

    const scale = rand(0.5, 1);
    dummy.scale.set(scale, scale, scale);
    dummy.rotation.set(scale, scale, scale);

    const color = new THREE.Color(1, 1, 1);

    dummy.updateMatrix();
    particleSystem.setMatrixAt(i, dummy.matrix);
    particleSystem.setColorAt(i, color);
  }

  particleSystem.instanceMatrix.needsUpdate = true;

  function animate(plane) {
    for (let i = 0; i < particleSystem.count; i++) {
      const matrix = new THREE.Matrix4();
      const position = new THREE.Vector3();
      particleSystem.getMatrixAt(i, matrix);
      position.setFromMatrixPosition(matrix);

      position.z += 0.05;

      if (position.z > 3) {
        if (plane.position.y < 1.2) {
          position.x = plane.position.x + rand(0, 0.8) - 0.4;
          position.z = (i / nparticles) * 3;
          position.y = plane.position.y;
        } else {
          position.y = 10000;
        }
      }

      matrix.setPosition(position);
      particleSystem.setMatrixAt(i, matrix);
    }
    particleSystem.instanceMatrix.needsUpdate = true;
  }

  return animate;
}
