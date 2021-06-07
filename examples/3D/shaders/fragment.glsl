varying vec3 vPosition;
uniform float uTime;
uniform int uType;
uniform float uSeed;

uniform float uPersistance;
uniform float uLacunarity;
uniform float uScale;
uniform int uOctaves;
uniform bool uInvert;
uniform float uDistance;

void main() {

  gln_tFBMOpts fbmOpts = gln_tFBMOpts(uSeed, uPersistance, uLacunarity, uScale,
                                      1.0, uOctaves, false, false);

  gln_tFBMOpts fbmOpts2 = gln_tFBMOpts(uSeed, uPersistance, uLacunarity, uScale,
                                       1.0, uOctaves, true, true);

  gln_tWorleyOpts voronoiOpts =
      gln_tWorleyOpts(uSeed, uDistance, uScale * 3.0, uInvert);

  vec3 pos = vPosition;
  pos += uTime;
  vec3 uv = pos;
  float n;

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
  }

  gl_FragColor = vec4(1.0 * n, 1.0 * n, 1.0 * n, 1.0);
}