varying vec3 vPosition;
uniform int uIsSphere;
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

  vec3 pos = position;
  vPosition = normalize(pos);

  if (uIsSphere == 1) {
    pos += uTime;

    vec2 uv = pos.xy;
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
    } else if (uType == 5) {
      n = gln_worley(uv, voronoiOpts);
    }

    pos = position + (normal * n);
  }

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
