import { BaseGradientNoise, map } from './shared'

export class Simplex extends BaseGradientNoise {
  _F2 = 0.5 * (Math.sqrt(3) - 1)
  _G2 = (3 - Math.sqrt(3)) / 6

  _F3 = 1 / 3
  _G3 = 1 / 6

  constructor(seed?: number) {
    super(seed || Math.random())
  }

  private _get2(x: number, y: number) {
    let n0, n1, n2

    const s = (x + y) * this._F2
    let i = Math.floor(x + s)
    let j = Math.floor(y + s)
    const t = (i + j) * this._G2
    const x0 = x - i + t
    const y0 = y - j + t

    let i1, j1
    if (x0 > y0) {
      i1 = 1
      j1 = 0
    } else {
      i1 = 0
      j1 = 1
    }

    var x1 = x0 - i1 + this._G2 // Offsets for middle corner in (x,y) unskewed coords
    var y1 = y0 - j1 + this._G2
    var x2 = x0 - 1 + 2 * this._G2 // Offsets for last corner in (x,y) unskewed coords
    var y2 = y0 - 1 + 2 * this._G2

    i &= 255
    j &= 255
    var gi0 = this._gradP[i + this._perm[j]]
    var gi1 = this._gradP[i + i1 + this._perm[j + j1]]
    var gi2 = this._gradP[i + 1 + this._perm[j + 1]]

    let t0 = 0.5 - x0 * x0 - y0 * y0
    if (t0 < 0) {
      n0 = 0
    } else {
      t0 *= t0
      n0 = t0 * t0 * gi0.dot2(x0, y0)
    }
    let t1 = 0.5 - x1 * x1 - y1 * y1
    if (t1 < 0) {
      n1 = 0
    } else {
      t1 *= t1
      n1 = t1 * t1 * gi1.dot2(x1, y1)
    }
    let t2 = 0.5 - x2 * x2 - y2 * y2
    if (t2 < 0) {
      n2 = 0
    } else {
      t2 *= t2
      n2 = t2 * t2 * gi2.dot2(x2, y2)
    }

    const val = 70 * (n0 + n1 + n2)
    return map(val, -1, 1, 0, 1)
  }

  get(x: number, y: number, z?: number) {
    // Adjust scale
    x *= 0.5
    y *= 0.5
    if (z) z *= 0.5

    if (z === undefined || z === null) {
      return this._get2(x, y)
    }

    let n0, n1, n2, n3

    const s = (x + y + z) * this._F3
    let i = Math.floor(x + s)
    let j = Math.floor(y + s)
    let k = Math.floor(z + s)

    const t = (i + j + k) * this._G3
    const x0 = x - i + t
    const y0 = y - j + t
    const z0 = z - k + t

    let i1, j1, k1
    let i2, j2, k2
    if (x0 >= y0) {
      if (y0 >= z0) {
        i1 = 1
        j1 = 0
        k1 = 0
        i2 = 1
        j2 = 1
        k2 = 0
      } else if (x0 >= z0) {
        i1 = 1
        j1 = 0
        k1 = 0
        i2 = 1
        j2 = 0
        k2 = 1
      } else {
        i1 = 0
        j1 = 0
        k1 = 1
        i2 = 1
        j2 = 0
        k2 = 1
      }
    } else {
      if (y0 < z0) {
        i1 = 0
        j1 = 0
        k1 = 1
        i2 = 0
        j2 = 1
        k2 = 1
      } else if (x0 < z0) {
        i1 = 0
        j1 = 1
        k1 = 0
        i2 = 0
        j2 = 1
        k2 = 1
      } else {
        i1 = 0
        j1 = 1
        k1 = 0
        i2 = 1
        j2 = 1
        k2 = 0
      }
    }

    const x1 = x0 - i1 + this._G3 // Offsets for second corner
    const y1 = y0 - j1 + this._G3
    const z1 = z0 - k1 + this._G3

    const x2 = x0 - i2 + 2 * this._G3 // Offsets for third corner
    const y2 = y0 - j2 + 2 * this._G3
    const z2 = z0 - k2 + 2 * this._G3

    const x3 = x0 - 1 + 3 * this._G3 // Offsets for fourth corner
    const y3 = y0 - 1 + 3 * this._G3
    const z3 = z0 - 1 + 3 * this._G3

    // Work out the hashed gradient indices of the four simplex corners
    i &= 255
    j &= 255
    k &= 255
    const gi0 = this._gradP[i + this._perm[j + this._perm[k]]]
    const gi1 = this._gradP[i + i1 + this._perm[j + j1 + this._perm[k + k1]]]
    const gi2 = this._gradP[i + i2 + this._perm[j + j2 + this._perm[k + k2]]]
    const gi3 = this._gradP[i + 1 + this._perm[j + 1 + this._perm[k + 1]]]

    let t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0
    if (t0 < 0) {
      n0 = 0
    } else {
      t0 *= t0
      n0 = t0 * t0 * gi0.dot3(x0, y0, z0)
    }
    let t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1
    if (t1 < 0) {
      n1 = 0
    } else {
      t1 *= t1
      n1 = t1 * t1 * gi1.dot3(x1, y1, z1)
    }
    let t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2
    if (t2 < 0) {
      n2 = 0
    } else {
      t2 *= t2
      n2 = t2 * t2 * gi2.dot3(x2, y2, z2)
    }
    let t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3
    if (t3 < 0) {
      n3 = 0
    } else {
      t3 *= t3
      n3 = t3 * t3 * gi3.dot3(x3, y3, z3)
    }

    const val = 32 * (n0 + n1 + n2 + n3)
    return map(val, -1, 1, 0, 1) ** 2
  }
}
