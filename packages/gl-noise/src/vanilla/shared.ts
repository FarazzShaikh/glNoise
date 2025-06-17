import { P } from './Perlin/P'

export class Vector3 {
  x: number
  y: number
  z: number

  constructor(x: number, y: number, z: number) {
    this.x = x
    this.y = y
    this.z = z
  }

  dot2(x: number, y: number) {
    return this.x * x + this.y * y
  }

  dot3(x: number, y: number, z: number) {
    return this.x * x + this.y * y + this.z * z
  }
}

export function fade(t: number) {
  return t * t * t * (t * (t * 6 - 15) + 10)
}

export function lerp(a: number, b: number, t: number) {
  return (1 - t) * a + t * b
}

export function map(value: number, start1: number, stop1: number, start2: number, stop2: number) {
  // Linear map
  return ((value - start1) / (stop1 - start1)) * (stop2 - start2) + start2
}

export function rand(min: number, max: number) {
  return Math.random() * (max - min) + min
}

export class BaseGradientNoise {
  _P = P

  _perm = new Array(512)
  _gradP = new Array(512)
  _gradients = [
    new Vector3(1, 1, 0),
    new Vector3(-1, 1, 0),
    new Vector3(1, -1, 0),
    new Vector3(-1, -1, 0),

    new Vector3(1, 0, 1),
    new Vector3(-1, 0, 1),
    new Vector3(1, 0, -1),
    new Vector3(-1, 0, -1),

    new Vector3(0, 1, 1),
    new Vector3(0, -1, 1),
    new Vector3(0, 1, -1),
    new Vector3(0, -1, -1),
  ]

  constructor(seed: number) {
    this.seed = seed
  }

  set seed(seed: number) {
    if (seed > 0 && seed < 1) {
      // Scale the seed out
      seed *= 65536
    }

    seed = Math.floor(seed)
    if (seed < 256) {
      seed |= seed << 8
    }

    for (let i = 0; i < 256; i++) {
      let v
      if (i & 1) {
        v = this._P[i] ^ (seed & 255)
      } else {
        v = this._P[i] ^ ((seed >> 8) & 255)
      }

      this._perm[i] = this._perm[i + 256] = v
      this._gradP[i] = this._gradP[i + 256] = this._gradients[v % 12]
    }
  }
}
