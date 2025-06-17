import { Vector3, BufferAttribute } from 'three'
import { Cell, Perlin, Simplex } from 'gl-noise/vanilla'
import { useEffect, useLayoutEffect, useRef } from 'react'

const map = {
  Perlin: Perlin,
  Simplex: Simplex,
  Cell1: Cell,
}

export function useCPUDisplacement(ref, props, seed) {
  const initialPosition = useRef()
  const initialNormals = useRef()
  const noise = useRef()

  useLayoutEffect(() => {
    initialPosition.current = ref.current.geometry.attributes.position.clone()
    initialNormals.current = ref.current.geometry.attributes.normal.clone()
  }, [])
  useLayoutEffect(() => {
    noise.current = new map[props.type](props.seed)
  }, [props.type, props.seed])

  useEffect(() => {
    const positionAttr = ref.current.geometry.attributes.position
    const count = positionAttr.count

    const pos = new Vector3()
    const normal = new Vector3()

    const noiseValues = []

    for (let i = 0; i < count; i++) {
      pos.fromBufferAttribute(initialPosition.current, i)
      normal.fromBufferAttribute(initialNormals.current, i)

      const n = noise.current.get(pos.x * props.scale, pos.y * props.scale, pos.z * props.scale)
      pos.addScaledVector(normal, n)

      noiseValues.push(n, n, n)

      positionAttr.setXYZ(i, pos.x, pos.y, pos.z)
    }

    positionAttr.needsUpdate = true

    // Recalc normals
    ref.current.geometry.computeVertexNormals()
  }, [props])
}
