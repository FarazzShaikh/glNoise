// https://iquilezles.org/www/articles/voronoilines/voronoilines.htm

float gln_rand(ivec2 inp) {
  vec2 p = vec2(inp);
  return fract(1e4 * sin(17.0 * p.x + p.y * 0.1) *
               (0.1 + abs(sin(p.y * 13.0 + p.x))));
}

float gln_voronoi(vec2 x) {
  ivec2 p = ivec2(floor(x));
  vec2 f = fract(x);

  ivec2 mb;
  vec2 mr;

  float res = 8.0;
  for (int j = -1; j <= 1; j++)
    for (int i = -1; i <= 1; i++) {
      ivec2 b = ivec2(i, j);
      vec2 r = vec2(b) + gln_rand(p + b) - f;
      float d = dot(r, r);

      if (d < res) {
        res = d;
        mr = r;
        mb = b;
      }
    }

  res = 8.0;
  for (int j = -2; j <= 2; j++)
    for (int i = -2; i <= 2; i++) {
      ivec2 b = mb + ivec2(i, j);
      vec2 r = vec2(b) + gln_rand(p + b) - f;
      float d = dot(0.5 * (mr + r), normalize(r - mr));

      res = min(res, d);
    }

  return 1.0 - smoothstep(0.0, 0.05, res);
}
