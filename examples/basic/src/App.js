import { Canvas } from '@react-three/fiber'
import { Box, Html, OrbitControls, PerspectiveCamera, Plane, Sphere, Stats, Text } from '@react-three/drei'
import { Floor } from './components/Floor'
import Lights from './components/Lights'
import { button, useControls } from 'leva'
import Material from './Material'
import { useState } from 'react'

const map = {
  Perlin: 0,
  Simplex: 1,
  Cell1: 2,
  Cell2: 3,
  PSRD: 4,
}

function TwoD(props) {
  return (
    <Plane args={[2, 2]} position={[-2, 1, 0]} castShadow>
      <Material {...props} type={map[props.type]} />
    </Plane>
  )
}

function ThreeD(props) {
  return (
    <Box args={[2, 2, 2]} position={[2, 1, 0]} castShadow>
      <Material {...props} type={map[props.type]} threeD />
    </Box>
  )
}

function Displacement(props) {
  return (
    <>
      <Sphere args={[1, 128, 128]} position={[6, 1, 0]} castShadow>
        <Material {...props} type={map[props.type]} threeD disp />
      </Sphere>
      <Plane args={[2, 2, 128, 128]} position={[-6, 1, 0]} rotation-x={-Math.PI / 2} castShadow>
        <Material {...props} type={map[props.type]} threeD disp />
      </Plane>
    </>
  )
}

export default function App() {
  const [seed, setSeed] = useState(Math.random())
  const { scale, type, fbm } = useControls({
    type: {
      options: Object.keys(map),
      value: Object.keys(map)[0],
    },
    scale: {
      min: 0.1,
      max: 10,
      step: 0.01,
      value: 3,
    },
    fbm: {
      value: false,
    },
    randomize: button(() => {
      setSeed(Math.random())
    }),
  })

  return (
    <Canvas shadows>
      <fog attach="fog" args={[0xffffff, 10, 90]} />

      <OrbitControls makeDefault />
      <PerspectiveCamera position={[0, 7, 12]} makeDefault />

      <Lights />
      <Floor />

      <TwoD {...{ type, seed, scale, fbm }} />
      <ThreeD {...{ type, seed, scale, fbm }} />
      <Displacement {...{ type, seed, scale, fbm }} />

      <Html transform scale={3} position={[0, 0, 2]} rotation-x={-Math.PI / 2}>
        <p
          style={{
            fontFamily: 'monospace',
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        >
          gln_{type.toLowerCase()}
          {fbm ? '_fbm' : ''}
        </p>
      </Html>

      <Stats />
    </Canvas>
  )
}
