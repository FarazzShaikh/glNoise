import { Vector3, BufferAttribute } from 'three'
import { Cell, Perlin, Simplex } from 'gl-noise/vanilla'
import { useEffect, useLayoutEffect, useRef } from 'react'

const map = {
  Perlin: Perlin,
  Simplex: Simplex,
  Cell1: Cell,
}

export function useCPUColor(ref, props) {
  const initialPosition = useRef()
  const initialColor = useRef()
  const noise = useRef()

  useLayoutEffect(() => {
    initialPosition.current = ref.current.geometry.attributes.position.clone()

    initialColor.current = new BufferAttribute(Float32Array.from({ length: initialPosition.current.count * 3 }), 3)
    ref.current.geometry.setAttribute('color', initialColor.current)
  }, [])

  useLayoutEffect(() => {
    noise.current = new map[props.type](props.seed)
  }, [props.type, props.seed])

  useEffect(() => {
    const positionAttr = ref.current.geometry.attributes.position
    const colorAttr = ref.current.geometry.attributes.color

    const count = positionAttr.count
    const pos = new Vector3()

    for (let i = 0; i < count; i++) {
      pos.fromBufferAttribute(initialPosition.current, i)

      const n = noise.current.get(pos.x * props.scale, pos.y * props.scale, pos.z * props.scale)
      // const n = noise.current.get(pos.x * props.scale, pos.y * props.scale)
      colorAttr.setXYZ(i, n, n, n)
    }

    colorAttr.needsUpdate = true
  }, [props])
}
