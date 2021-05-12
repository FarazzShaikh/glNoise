// https://iquilezles.org/www/articles/voronoilines/voronoilines.htm

vec2 gln_rand2(vec2 p) {
  return fract(
      sin(vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)))) *
      43758.5453);
}

float gln_voronoi(vec2 x) {
  vec2 p = floor(x);
  vec2 f = fract(x);

  float min_dist = 1.0; // distance

  for (int j = -1; j <= 1; j++)
    for (int i = -1; i <= 1; i++) {

      vec2 neighbor = vec2(float(i), float(j));

      vec2 point = gln_rand2(p + neighbor);

      vec2 diff = neighbor + point - f;

      float dist = length(diff) * 1.0;

      min_dist = min(min_dist, dist);
    }

  return min_dist;
}
