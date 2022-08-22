import commonShader from './shaders/glsl/Common.glsl'
import perlinShader from './shaders/glsl/Perlin.glsl'
import simplexShader from './shaders/glsl/Simplex.glsl'
import cellShader from './shaders/glsl/Cell.glsl'
import waveShader from './shaders/glsl/Wave.glsl'
import PSRDShader from './shaders/glsl/PSRD.glsl'
// @ts-ignore
// removing .ts extension crashes the build
import FBM from './shaders/glsl/FBM.ts'

export const Common = commonShader
export const Perlin = perlinShader + FBM('perlin')
export const Simplex = simplexShader + FBM('simplex')
export const Cell =
  cellShader +
  FBM(
    'cell', //
    'vec2',
    'gln_CellOpts',
    '(0.0, 1.0)'
  )
export const PSRD =
  PSRDShader +
  FBM(
    'psrd', //
    'float',
    'gln_PSRDOpts',
    '(0., vec3(100.), 0.)'
  )
export const Wave = waveShader + FBM('wave', 'vec3')

const allChunks = [Common, Perlin, Simplex, Cell, Wave, PSRD]

export function gln(shader: string | string[], chunks?: string[]) {
  if (chunks) {
    return chunks.join('\n') + shader
  } else {
    return allChunks.join('\n') + shader
  }
}
