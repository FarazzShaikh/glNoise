varying vec3 vPosition;
uniform int uIsSphere;
uniform float uTime;
uniform int uType;
uniform float uSeed;

void main() {

  gln_tFBMOpts fbmOpts =
      gln_tFBMOpts(uSeed, 0.5, 2.0, 3.0, 1.0, 5, false, false);
  gln_tFBMOpts fbmOpts2 =
      gln_tFBMOpts(uSeed, 0.5, 2.0, 3.0, 1.0, 5, true, true);
  gln_tVoronoiOpts voronoiOpts = gln_tVoronoiOpts(uSeed, 0.0, 3.0, false);
  gln_tVoronoiOpts voronoiOpts2 = gln_tVoronoiOpts(uSeed, 0.0, 3.0, true);

  vec3 pos = position;
  vPosition = normalize(pos);

  if (uIsSphere == 1) {
    pos += uTime;

    vec2 uv = pos.xy;
    float n;

    if (uType == 0) {
      n = gln_normalize(gln_perlin(pos * 4.0));
    } else if (uType == 1) {
      n = gln_normalize(gln_simplex(pos * 2.0));
    } else if (uType == 2) {
      n = gln_normalize(gln_pfbm(uv, fbmOpts));
    } else if (uType == 3) {
      n = gln_normalize(gln_sfbm(uv, fbmOpts));
    } else if (uType == 4) {
      n = gln_normalize(gln_sfbm(uv, fbmOpts2));
    } else if (uType == 5) {
      n = gln_voronoi(uv, voronoiOpts);
    } else if (uType == 6) {
      n = gln_voronoi(uv, voronoiOpts2);
    }

    pos = position + (normal * n);
  }

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
