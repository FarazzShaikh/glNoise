

varying vec3 vUv;

vec4 fbmOpts = vec4(0.5, 2.0, 1.0, 5.0);

void main() {
  vUv = position;
  vec3 p = position;

  float f = gln_fbm2D(p.xy * 0.5, fbmOpts) * 3.0;
  f = f * 0.5 + 0.5;

  //   p.z += f;

  vec4 modelViewPosition = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * modelViewPosition;
}
