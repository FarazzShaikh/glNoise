import { Sky } from '@react-three/drei'

export default function Lights() {
  return (
    <>
      <Sky sunPosition={[100, 200, 100]} distance={10000} mieDirectionalG={0.9} />
      <hemisphereLight args={[0xffffff, 0xffffff, 1.0]} color={0x7095c1} position={[0, 50, 0]} groundColor={0xcbc1b2} />
      <directionalLight
        position={[100, 200, 100]}
        castShadow
        shadow-mapSize={[4096, 4096]}
        shadow-camera-left={-22}
        shadow-camera-bottom={-22}
        shadow-camera-right={22}
        shadow-camera-top={22}
      />
    </>
  )
}
