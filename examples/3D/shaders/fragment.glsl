varying vec3 vPosition;
uniform float uTime;
uniform int uType;
uniform float uSeed;

void main() {

  gln_tFBMOpts fbmOpts =
      gln_tFBMOpts(uSeed, 0.5, 2.0, 0.5, 1.0, 5, false, false);
  gln_tFBMOpts fbmOpts2 =
      gln_tFBMOpts(uSeed, 0.5, 2.0, 2.0, 1.0, 5, true, true);

  gln_tVoronoiOpts voronoiOpts = gln_tVoronoiOpts(uSeed, 0.0, 0.5, false);
  gln_tVoronoiOpts voronoiOpts2 = gln_tVoronoiOpts(uSeed, 0.0, 3.0, true);

  vec3 pos = vPosition;
  pos += uTime;
  vec2 uv = pos.xy;
  float n;

  if (uType == 0) {
    n = gln_normalize(gln_perlin(pos * 4.0));
  } else if (uType == 1) {
    n = gln_normalize(gln_simplex(pos * 2.0));
  } else if (uType == 2) {
    n = gln_normalize(gln_pfbm(pos, fbmOpts));
  } else if (uType == 3) {
    n = gln_normalize(gln_sfbm(pos, fbmOpts));
  } else if (uType == 4) {
    n = gln_normalize(gln_sfbm(pos, fbmOpts2));
  }

  gl_FragColor = vec4(1.0 * n, 1.0 * n, 1.0 * n, 1.0);
}