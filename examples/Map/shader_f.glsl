precision highp float;
uniform float uTime;
uniform vec3 uColor;
varying vec2 vUv;

uniform vec3 uResolution;

void main() {

  vec2 uv = gl_FragCoord.xy / uResolution.xy;
  uv.x *= uResolution.x / uResolution.y;

  gln_tFBMOpts fbmOpts = gln_tFBMOpts(0.5, 2.0, 0.5, 1.0, 5, false, false);

  float n = gln_voronoi(uv * 7.0);

  vec3 col = vec3(0.0) + n;

  gl_FragColor.rgb = col;
  gl_FragColor.a = 1.0;
}