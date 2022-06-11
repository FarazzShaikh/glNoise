import { Canvas } from '@react-three/fiber'
import { Box, OrbitControls, PerspectiveCamera, Plane } from '@react-three/drei'
import { Floor } from './components/Floor'
import Lights from './components/Lights'

import CustomShaderMaterial from 'three-custom-shader-material'
import { MeshPhysicalMaterial } from 'three'
import { DoubleSide } from 'three'

import { Common, Perlin } from 'gl-noise'

function TwoD() {
  return (
    <Plane args={[2, 2]} position={[-2, 1, 0]} castShadow>
      <CustomShaderMaterial
        side={DoubleSide}
        vertexShader={
          /* glsl */ `
        varying vec2 vUv;

        void main() {
          vUv = uv;
        }

        `
        }
        fragmentShader={
          /* glsl */ `
          ${Common}
          ${Perlin}

          varying vec2 vUv;

          void main() {
            float n = gln_perlin(vUv * 4.);
            csm_FragColor = vec4(vec3(n), 1.);
          }
        `
        }
        baseMaterial={MeshPhysicalMaterial}
      />
    </Plane>
  )
}

function ThreeD() {
  return (
    <Box args={[2, 2, 2]} position={[2, 1, 0]} castShadow>
      <CustomShaderMaterial
        side={DoubleSide}
        vertexShader={
          /* glsl */ `
        varying vec3 vUv;
        void main() { vUv = position; }
        `
        }
        fragmentShader={
          /* glsl */ `
          ${Common}
          ${Perlin}

          varying vec3 vUv;

          void main() {
            float n = gln_perlin(vUv * 4.);
            csm_FragColor = vec4(vec3(n), 1.);
          }
        `
        }
        baseMaterial={MeshPhysicalMaterial}
      />
    </Box>
  )
}

export default function App() {
  return (
    <Canvas shadows>
      {/* <fog attach="fog" args={[0xffffff, 10, 90]} /> */}

      <OrbitControls makeDefault />
      <PerspectiveCamera position={[-5, 5, 5]} makeDefault />

      <Lights />
      <Floor />

      <TwoD />
      <ThreeD />
    </Canvas>
  )
}
