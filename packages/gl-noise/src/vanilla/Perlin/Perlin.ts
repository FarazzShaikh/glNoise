import { BaseGradientNoise, fade, lerp, map } from '../shared'

export class Perlin extends BaseGradientNoise {
  constructor(seed?: number) {
    super(seed || Math.random())
  }

  private _get2(x: number, y: number) {
    var X = Math.floor(x),
      Y = Math.floor(y)
    x = x - X
    y = y - Y
    X = X & 255
    Y = Y & 255

    const n00 = this._gradP[X + this._perm[Y]].dot2(x, y)
    const n01 = this._gradP[X + this._perm[Y + 1]].dot2(x, y - 1)
    const n10 = this._gradP[X + 1 + this._perm[Y]].dot2(x - 1, y)
    const n11 = this._gradP[X + 1 + this._perm[Y + 1]].dot2(x - 1, y - 1)

    const u = fade(x)

    const val = lerp(lerp(n00, n10, u), lerp(n01, n11, u), fade(y))
    return map(val, -1, 1, 0, 1)
  }

  get(x: number, y: number, z?: number) {
    // Adjust scale
    x *= 0.5
    y *= 0.5
    if (z) z *= 0.5

    if (z === undefined || z === null) return this._get2(x, y)

    let X = Math.floor(x),
      Y = Math.floor(y),
      Z = Math.floor(z)
    x = x - X
    y = y - Y
    z = z - Z
    X = X & 255
    Y = Y & 255
    Z = Z & 255

    const n000 = this._gradP[X + this._perm[Y + this._perm[Z]]].dot3(x, y, z)
    const n001 = this._gradP[X + this._perm[Y + this._perm[Z + 1]]].dot3(x, y, z - 1)
    const n010 = this._gradP[X + this._perm[Y + 1 + this._perm[Z]]].dot3(x, y - 1, z)
    const n011 = this._gradP[X + this._perm[Y + 1 + this._perm[Z + 1]]].dot3(x, y - 1, z - 1)
    const n100 = this._gradP[X + 1 + this._perm[Y + this._perm[Z]]].dot3(x - 1, y, z)
    const n101 = this._gradP[X + 1 + this._perm[Y + this._perm[Z + 1]]].dot3(x - 1, y, z - 1)
    const n110 = this._gradP[X + 1 + this._perm[Y + 1 + this._perm[Z]]].dot3(x - 1, y - 1, z)
    const n111 = this._gradP[X + 1 + this._perm[Y + 1 + this._perm[Z + 1]]].dot3(x - 1, y - 1, z - 1)

    const u = fade(x)
    const v = fade(y)
    const w = fade(z)

    const val = lerp(
      lerp(lerp(n000, n100, u), lerp(n001, n101, u), w),
      lerp(lerp(n010, n110, u), lerp(n011, n111, u), w),
      v
    )
    return map(val, -1, 1, 0, 1) ** 2
  }
}
