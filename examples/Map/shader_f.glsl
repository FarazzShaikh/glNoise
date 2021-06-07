precision highp float;
uniform float uTime;
uniform vec3 uColor;
varying vec2 vUv;

uniform vec3 uResolution;
uniform float uSeed;
uniform int uType;

uniform float uPersistance;
uniform float uLacunarity;
uniform float uScale;
uniform int uOctaves;
uniform bool uInvert;
uniform float uDistance;

void main() {

  vec2 uv = gl_FragCoord.xy / uResolution.xy;
  uv.x *= uResolution.x / uResolution.y;

  gln_tFBMOpts fbmOpts =
      gln_tFBMOpts(uSeed, uPersistance, uLacunarity, uScale * 3.0, 1.0,
                   uOctaves, false, false);

  gln_tFBMOpts fbmOpts2 = gln_tFBMOpts(uSeed, uPersistance, uLacunarity,
                                       uScale * 3.0, 1.0, uOctaves, true, true);

  gln_tWorleyOpts voronoiOpts =
      gln_tWorleyOpts(uSeed, uDistance, uScale * 3.0, uInvert);

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

  vec3 col = vec3(0.0) + n;

  gl_FragColor.rgb = col;
  gl_FragColor.a = 1.0;
}