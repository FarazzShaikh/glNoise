import { Canvas } from '@react-three/fiber'
import { Box, Html, OrbitControls, PerspectiveCamera, Plane, Sphere, Stats, Text } from '@react-three/drei'
import { Floor } from './components/Floor'
import Lights from './components/Lights'
import { button, useControls } from 'leva'
import Material from './Material'
import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useCPUDisplacement } from './useCPUDisplacement'
import { DoubleSide } from 'three'
import { useCPUColor } from './useCPUColor'

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

function TwoDCPU(props) {
  const refPlane = useRef()

  useCPUColor(refPlane, props)

  return (
    <Plane ref={refPlane} args={[2, 2, 256, 256]} position={[-2, 1, 0]} castShadow>
      <meshBasicMaterial toneMapped={false} vertexColors side={DoubleSide} />
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

function ThreeDCPU(props) {
  const refBox = useRef()

  useCPUColor(refBox, props)

  return (
    <Box ref={refBox} args={[2, 2, 2, 128, 128, 128]} position={[2, 1, 0]} castShadow>
      <meshBasicMaterial toneMapped={false} vertexColors side={DoubleSide} />
    </Box>
  )
}

function DisplacementCPU(props) {
  const refPlane = useRef()
  const refSphere = useRef()

  useCPUDisplacement(refPlane, props)
  useCPUDisplacement(refSphere, props)

  useCPUColor(refPlane, props)
  useCPUColor(refSphere, props)

  return (
    <>
      <Plane ref={refPlane} args={[2, 2, 128, 128]} position={[-6, 1, 0]} rotation-x={-Math.PI / 2} castShadow>
        <meshBasicMaterial toneMapped={false} vertexColors side={DoubleSide} />
      </Plane>
      <Sphere ref={refSphere} args={[1, 128, 128]} position={[6, 1, 0]} castShadow>
        <meshBasicMaterial toneMapped={false} vertexColors side={DoubleSide} />
      </Sphere>
    </>
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

function GPU(props) {
  return (
    <>
      <TwoD {...props} />
      <ThreeD {...props} />
      <Displacement {...props} />
    </>
  )
}

function CPU(props) {
  return (
    <>
      <TwoDCPU {...props} />
      <ThreeDCPU {...props} />
      {/* <DisplacementCPU {...props} /> */}
    </>
  )
}

export default function App() {
  const [seed, setSeed] = useState(Math.random())
  const { scale, type, fbm, platform } = useControls({
    type: {
      options: Object.keys(map),
      value: 'Cell1',
    },
    scale: {
      min: 0.1,
      max: 10,
      step: 0.01,
      value: 1,
    },
    fbm: {
      value: false,
    },
    randomize: button(() => {
      setSeed(Math.random())
    }),
    platform: {
      options: ['gpu', 'cpu'],
      value: 'cpu',
    },
  })

  return (
    <Canvas shadows>
      <fog attach="fog" args={[0xffffff, 10, 90]} />

      <OrbitControls makeDefault />
      <PerspectiveCamera position={[0, 7, 12]} makeDefault />

      <Lights />
      <Floor />

      {platform === 'gpu' ? <GPU {...{ type, seed, scale, fbm }} /> : <CPU {...{ type, seed, scale, fbm }} />}

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
