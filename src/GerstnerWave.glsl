
/**
 * @typedef {struct} gln_tGerstnerWaveOpts   Options for Gerstner Wave
 * generators.
 * @property {vec2} direction               Direction of the wave
 * @property {float} steepness              Steepness of the peeks
 * @property {float} wavelength             Wavelength of the waves
 */
struct gln_tGerstnerWaveOpts {
  vec2 direction;
  float steepness;
  float wavelength;
};

/**
 * Implimentation of Gerstner Wave
 * Based on: https://catlikecoding.com/unity/tutorials/flow/waves/
 *
 * @name gln_GerstnerWave
 * @function
 * @param {vec3} p Point to sample Gerstner Waves at.
 * @param {gln_tGerstnerWaveOpts} opts
 * @param {float} dt
 *
 * @example
 * float n = gln_perlin(position.xy);
 */
vec3 gln_GerstnerWave(vec3 p, gln_tGerstnerWaveOpts opts, float dt) {
  float steepness = opts.steepness;
  float wavelength = opts.wavelength;
  float k = 2.0 * gln_PI / wavelength;
  float c = sqrt(9.8 / k);
  vec2 d = normalize(opts.direction);
  float f = k * (dot(d, p.xy) - c * dt);
  float a = steepness / k;

  return vec3(d.x * (a * cos(f)), a * sin(f), d.y * (a * cos(f)));
}
