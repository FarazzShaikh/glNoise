
uniform float uTime;
uniform vec3 uColor;
uniform vec3 uResolution;

varying vec3 vUv;

vec4 fbmOpts = vec4(0.5, 2.0, 1.0, 5.0);

void main() {

  vec2 uv = vUv.xy;

  float f = gln_voronoi(uv * 1.0);
  f = gln_map(f, -1.0, 1.0, 0.0, 1.0);
  vec3 col = vec3(f);

  gl_FragColor = vec4(col, 1.0);
}