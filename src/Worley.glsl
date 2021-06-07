/**
 * @typedef {struct} gln_tWorleyOpts   Options for Voronoi Noise generators.
 * @property {float} seed               Seed for PRNG generation.
 * @property {float} distance           Size of each generated cell
 * @property {float} scale              "Zoom level" of generated noise.
 * @property {boolean} invert           Invert generated noise.
 */
struct gln_tWorleyOpts {
  float seed;
  float distance;
  float scale;
  bool invert;
};

/**
 * Generates Voronoi Noise.
 *
 * @name gln_worley
 * @function
 * @param {vec2}  x                  Point to sample Voronoi Noise at.
 * @param {gln_tWorleyOpts} opts    Options for generating Voronoi Noise.
 * @return {float}                   Value of Voronoi Noise at point "p".
 *
 * @example
 * gln_tWorleyOpts opts = gln_tWorleyOpts(uSeed, 0.0, 0.5, false);
 *
 * float n = gln_worley(position.xy, opts);
 */
float gln_worley(vec2 point, gln_tWorleyOpts opts) {
  vec2 p = floor(point * opts.scale);
  vec2 f = fract(point * opts.scale);
  float res = 0.0;
  for (int j = -1; j <= 1; j++) {
    for (int i = -1; i <= 1; i++) {
      vec2 b = vec2(i, j);
      vec2 r = vec2(b) - f + gln_rand(p + b);
      res += 1. / pow(dot(r, r), 8.);
    }
  }

  float result = pow(1. / res, 0.0625);
  if (opts.invert)
    result = 1.0 - result;
  return result;
}

/**
 * Generates Fractional Brownian motion (fBm) from Worley Noise.
 *
 * @name gln_wfbm
 * @function
 * @param {vec3} v               Point to sample fBm at.
 * @param {gln_tFBMOpts} opts    Options for generating Simplex Noise.
 * @return {float}               Value of fBm at point "p".
 *
 * @example
 * gln_tFBMOpts opts =
 *      gln_tFBMOpts(1.0, 0.3, 2.0, 0.5, 1.0, 5, false, false);
 *
 * gln_tWorleyOpts voronoiOpts =
 *     gln_tWorleyOpts(1.0, 1.0, 3.0, false);
 *
 * float n = gln_wfbm(position.xy, voronoiOpts, opts);
 */
float gln_wfbm(vec2 v, gln_tFBMOpts opts, gln_tWorleyOpts vopts) {
  v += (opts.seed * 100.0);
  float persistance = opts.persistance;
  float lacunarity = opts.lacunarity;
  float redistribution = opts.redistribution;
  int octaves = opts.octaves;
  bool terbulance = opts.terbulance;
  bool ridge = opts.terbulance && opts.ridge;

  float result = 0.0;
  float amplitude = 1.0;
  float frequency = 1.0;
  float maximum = amplitude;

  for (int i = 0; i < MAX_FBM_ITERATIONS; i++) {
    if (i >= octaves)
      break;

    vec2 p = v * frequency * opts.scale;

    float noiseVal = gln_worley(p, vopts);

    if (terbulance)
      noiseVal = abs(noiseVal);

    if (ridge)
      noiseVal = -1.0 * noiseVal;

    result += noiseVal * amplitude;

    frequency *= lacunarity;
    amplitude *= persistance;
    maximum += amplitude;
  }

  float redistributed = pow(result, redistribution);
  return redistributed / maximum;
}
