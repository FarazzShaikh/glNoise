precision highp float;

// Unifomrs are passed into the shader from the CPU
uniform float uTime;      // Delta time
uniform vec3 uResolution; // Width and height of the window
uniform sampler2D uMap;   // Width and height of the window

varying vec2 vUv; // UV Coordinates

void main() {

  vec2 uv = gl_FragCoord.xy / uResolution.xy;
  uv.x *= uResolution.x / uResolution.y;

  vec4 texture = texture2D(uMap, uv);

  // INSERT FFT HERE LIKE THIS
  //   tex = FFT(tex);

  gl_FragColor = texture;
}