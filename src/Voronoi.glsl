
float gln_voronoi(vec2 x, gln_tVoronoiOpts opts) {
  vec2 p = floor(x * opts.scale + (opts.seed * 1000.0));
  vec2 f = fract(x * opts.scale + (opts.seed * 1000.0));

  float min_dist = 1.0 - opts.distance; // distance

  for (int j = -1; j <= 1; j++)
    for (int i = -1; i <= 1; i++) {

      vec2 neighbor = vec2(float(i), float(j));

      vec2 point = gln_rand2(p + neighbor);

      vec2 diff = neighbor + point - f;

      float dist = length(diff) * 1.0;

      min_dist = min(min_dist, dist);
    }

  if (opts.invert)
    return 1.0 - min_dist;
  else
    return min_dist;
}
