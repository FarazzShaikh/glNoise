// #name: Curl
// #deps: Simplex

vec3 _snois3(vec3 x) {
  float s = gln_simplex(vec3(x));
  float s1 = gln_simplex(vec3(x.y - 19.1, x.z + 33.4, x.x + 47.2));
  float s2 = gln_simplex(vec3(x.z + 74.2, x.x - 124.5, x.y + 99.4));
  vec3 c = vec3(s, s1, s2);
  return c;
}

/**
 * Generates 3D Curl Noise.
 *
 * @name gln_curl
 * @function
 * @param {vec2} p  Point to sample Curl Noise at.
 * @return {float}  Value of Curl Noise at point "p".
 *
 * @example
 * vec3 n = gln_curl(position);
 */
vec3 gln_curl(vec3 p) {
  const float e = .1;
  vec3 dx = vec3(e, 0.0, 0.0);
  vec3 dy = vec3(0.0, e, 0.0);
  vec3 dz = vec3(0.0, 0.0, e);

  vec3 p_x0 = _snois3(p - dx);
  vec3 p_x1 = _snois3(p + dx);
  vec3 p_y0 = _snois3(p - dy);
  vec3 p_y1 = _snois3(p + dy);
  vec3 p_z0 = _snois3(p - dz);
  vec3 p_z1 = _snois3(p + dz);

  float x = p_y1.z - p_y0.z - p_z1.y + p_z0.y;
  float y = p_z1.x - p_z0.x - p_x1.z + p_x0.z;
  float z = p_x1.y - p_x0.y - p_y1.x + p_y0.x;

  const float divisor = 1.0 / (2.0 * e);
  return normalize(vec3(x, y, z) * divisor);
}