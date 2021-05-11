
uniform float uTime;
uniform vec3 uColor;
uniform vec3 uResolution;

varying vec3 vUv;

void main() {

  vec2 uv = vUv.xy;

  float f = gln_perlin2D(uv * 4.0);
  f = f * 0.5 + 0.5;

  vec3 col = vec3(f);

  gl_FragColor = vec4(col, 1.0);
}