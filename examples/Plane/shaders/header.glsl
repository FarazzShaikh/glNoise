uniform float uPersistance;
uniform float uLacunarity;
uniform float uScale;
uniform int uOctaves;
uniform bool uInvert;
uniform float uDistance;

// the function which defines the displacement
float displace(vec3 point) {

  gln_tFBMOpts fbmOpts = gln_tFBMOpts(uSeed, uPersistance, uLacunarity, uScale,
                                      1.0, uOctaves, false, false);

  gln_tFBMOpts fbmOpts2 = gln_tFBMOpts(uSeed, uPersistance, uLacunarity, uScale,
                                       1.0, uOctaves, true, true);

  gln_tWorleyOpts voronoiOpts =
      gln_tWorleyOpts(uSeed, uDistance, uScale * 3.0, uInvert);

  vec2 uv = point.xy;
  float n;

  uv += uTime;

  if (uType == 0) {
    n = gln_normalize(gln_perlin(uv * 4.0 * uScale));
  } else if (uType == 1) {
    n = gln_normalize(gln_simplex(uv * 4.0 * uScale));
  } else if (uType == 2) {
    n = gln_normalize(gln_pfbm(uv, fbmOpts));
  } else if (uType == 3) {
    n = gln_normalize(gln_sfbm(uv, fbmOpts));
  } else if (uType == 4) {
    n = gln_normalize(gln_sfbm(uv, fbmOpts2));
  } else if (uType == 5) {
    n = gln_worley(uv, voronoiOpts);
  } else if (uType == 6) {
    n = gln_wfbm(uv, fbmOpts, voronoiOpts);
  }

  return n;
}
vec3 orthogonal(vec3 v) {
  return normalize(abs(v.x) > abs(v.z) ? vec3(-v.y, v.x, 0.0)
                                       : vec3(0.0, -v.z, v.y));
}
