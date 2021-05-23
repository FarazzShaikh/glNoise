/**
 * Generats Voronoi Noise.
 *
 * @name gln_voronoi
 * @function
 * @param {vec2}  x                  Point to sample Voronoi Noise at.
 * @param {gln_tVoronoiOpts} opts    Options for generating Voronoi Noise.
 * @return {float}                   Value of Voronoi Noise at point "p".
 *
 * @example
 * gln_tVoronoiOpts opts = gln_tVoronoiOpts(uSeed, 0.0, 0.5, false);
 *
 * float n = gln_voronoi(position.xy, opts);
 */
float gln_voronoi(vec2 point, gln_tVoronoiOpts opts) {
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