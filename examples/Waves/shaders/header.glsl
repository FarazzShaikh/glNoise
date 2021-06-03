uniform float uPersistance;
uniform float uLacunarity;
uniform float uScale;
uniform int uOctaves;
uniform bool uInvert;
uniform float uDistance;

// the function which defines the displacement
vec3 displace(vec3 point) {

  gln_tFBMOpts fbmOpts = gln_tFBMOpts(uSeed, uPersistance, uLacunarity, uScale,
                                      1.0, uOctaves, false, false);

  vec4 A = vec4(0.0, -1.0, 0.5, 2.0);
  vec4 B = vec4(0.0, 1.0, 0.25, 4.0);
  vec4 C = vec4(1.0, 1.0, 0.15, 6.0);

  vec4 D = vec4(1.0, 1.0, 0.7, 1.0);

  vec3 n = vec3(0.0);
  n.z += gln_normalize(gln_pfbm(point.xy + (uTime * 0.5), fbmOpts));
  n += gln_GerstnerWave(point, A, uTime).xzy;
  n += gln_GerstnerWave(point, B, uTime).xzy * 0.5;
  n += gln_GerstnerWave(point, C, uTime).xzy * 0.25;
  n += gln_GerstnerWave(point, D, uTime).xzy * 0.2;

  return n;
}
vec3 orthogonal(vec3 v) {
  return normalize(abs(v.x) > abs(v.z) ? vec3(-v.y, v.x, 0.0)
                                       : vec3(0.0, -v.z, v.y));
}
