precision highp float;
uniform float uTime;
uniform vec3 uColor;
varying vec2 vUv;

uniform vec3 uResolution;
uniform float uSeed;
uniform int uType;

void main() {

  vec2 uv = gl_FragCoord.xy / uResolution.xy;
  uv.x *= uResolution.x / uResolution.y;

  gln_tFBMOpts fbmOpts =
      gln_tFBMOpts(uSeed, 0.5, 2.0, 3.0, 1.0, 5, false, false);
  gln_tFBMOpts fbmOpts2 =
      gln_tFBMOpts(uSeed, 0.5, 2.0, 3.0, 1.0, 5, true, true);
  gln_tVoronoiOpts voronoiOpts = gln_tVoronoiOpts(uSeed, 0.0, 3.0, false);
  gln_tVoronoiOpts voronoiOpts2 = gln_tVoronoiOpts(uSeed, 0.0, 3.0, true);

  float n;

  uv += uTime;

  if (uType == 0) {
    n = gln_normalize(gln_perlin(uv * 4.0));
  } else if (uType == 1) {
    n = gln_normalize(gln_simplex(uv * 4.0));
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

  vec3 col = vec3(0.0) + n;

  gl_FragColor.rgb = col;
  gl_FragColor.a = 1.0;
}