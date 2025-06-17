import { Perlin } from './Perlin'
import { Vector3 } from './shared'
import { Simplex } from './Simplex'

const euclidean3 = (x: number, y: number, z: number) => x * x + y * y + z * z
const euclidean2 = (x: number, y: number) => Math.sqrt(x * x + y * y)
const manhattan3 = (x: number, y: number, z: number) => Math.abs(x) + Math.abs(y) + Math.abs(z)

const fract = (x: number) => x - Math.floor(x)
const dot2 = (x1: number, y1: number, x2: number, y2: number) => x1 * x2 + y1 * y2
const dot3 = (x1: number, y1: number, z1: number, x2: number, y2: number, z2: number) => x1 * x2 + y1 * y2 + z1 * z2

const rand = (x: number) => fract(Math.sin(x) * 43758.5453123)
const rand2 = (x: number, y: number) => {
  return [fract(Math.sin(dot2(x, y, 127.1, 311.7))), fract(Math.sin(dot2(x, y, 269.5, 183.3)))]
}

const rand3 = (x: number, y: number, z: number) => {
  return [
    fract(Math.sin(dot3(x, y, z, 127.1, 311.7, 74.7))),
    fract(Math.sin(dot3(x, y, z, 269.5, 183.3, 246.1))),
    fract(Math.sin(dot3(x, y, z, 113.5, 271.9, 124.6))),
  ]
}

export class Cell {
  seed: number

  minPoint: {
    x: number
    y: number
    z: number
  }

  constructor(seed?: number) {
    this.seed = seed || Math.random()

    this.minPoint = {
      x: 0,
      y: 0,
      z: 0,
    }
  }

  _get2(x: number, y: number) {
    // Offset seed
    x += rand(this.seed) * 1000
    y += rand(this.seed) * 1000

    const i_stX = Math.floor(x)
    const i_stY = Math.floor(y)
    const f_stX = fract(x)
    const f_stY = fract(y)

    let minDist = 1
    let secondMinDist = 1

    for (let y = -1; y <= 1; y++) {
      for (let x = -1; x <= 1; x++) {
        const neighborX = x
        const neighborY = y

        const [pointX, pointY] = rand2(i_stX + neighborX, i_stY + neighborY)

        const diffX = neighborX + pointX - f_stX
        const diffY = neighborY + pointY - f_stY

        const dist = euclidean2(diffX, diffY)

        if (dist < minDist) {
          minDist = dist
          this.minPoint.x = pointX
          this.minPoint.y = pointY
        }

        if (dist < secondMinDist && dist > minDist) {
          secondMinDist = dist
        }
      }
    }

    return minDist ** 2
  }

  get(x: number, y: number, z?: number) {
    if (z === undefined || z === null) {
      return this._get2(x, y)
    }

    // Offset seed
    x += rand(this.seed) * 1000
    y += rand(this.seed) * 1000
    z += rand(this.seed) * 1000

    const i_stX = Math.floor(x) % 289
    const i_stY = Math.floor(y) % 289
    const i_stZ = Math.floor(z) % 289
    const f_stX = fract(x)
    const f_stY = fract(y)
    const f_stZ = fract(z)

    let minDist = Number.POSITIVE_INFINITY
    let secondMinDist = Number.POSITIVE_INFINITY

    for (let y = -1; y <= 1; y++) {
      for (let x = -1; x <= 1; x++) {
        for (let z = -1; z <= 1; z++) {
          const neighborX = x
          const neighborY = y
          const neighborZ = z

          // const pointX = rand3((i_stX + neighborX) * 1000, i_stY + neighborY, i_stZ + neighborZ)
          // const pointY = rand3((i_stY + neighborY) * 1000, i_stZ + neighborZ, i_stX + neighborX)
          // const pointZ = rand3((i_stZ + neighborZ) * 1000, i_stY + neighborY, i_stX + neighborX)

          const [pointX, pointY, pointZ] = rand3(i_stX + neighborX, i_stY + neighborY, i_stZ + neighborZ)

          const diffX = neighborX + pointX - f_stX
          const diffY = neighborY + pointY - f_stY
          const diffZ = neighborZ + pointZ - f_stZ

          const dist = euclidean3(diffX, diffY, diffZ)

          // minDist = Math.min(minDist, dist)
          if (dist < minDist) {
            minDist = dist
            this.minPoint.x = pointX
            this.minPoint.y = pointY
            this.minPoint.z = pointZ
          }

          if (dist < secondMinDist && dist > minDist) {
            secondMinDist = dist
          }
        }
      }
    }

    return Math.sqrt(secondMinDist - minDist) ** 2
  }
}
