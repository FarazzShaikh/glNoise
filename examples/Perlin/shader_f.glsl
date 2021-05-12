
uniform float uTime;
uniform vec3 uColor;
uniform vec3 uResolution;

varying vec3 vUv;
varying float vNoise;

gln_tFBMOpts fbmOpts = gln_tFBMOpts(0.5, 2.0, 0.5, 1.0, 5, false, false);

void main() {

  vec2 uv = vUv.xy;

  float f = vNoise;
  //   f = gln_map(f, -1.0, 1.0, 0.0, 1.0);
  vec3 col = vec3(f);

  gl_FragColor = vec4(col, 1.0);
}