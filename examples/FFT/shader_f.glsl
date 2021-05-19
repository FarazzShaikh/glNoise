precision highp float;

// Unifomrs are passed into the shader from the CPU
uniform float uTime;      // Delta time
uniform vec3 uResolution; // Width and height of the window

varying vec2 vUv; // UV Coordinates

void main() {

  // Get Pixel coordinate
  vec2 uv = gl_FragCoord.xy / uResolution.xy;
  // Adjsut for aspect ratio
  uv.x *= uResolution.x / uResolution.y;

  // Get Noise. Here is where you will call FFT etc
  float n = gln_normalize(gln_perlin(uv * 4.0));

  // Set the final color of the pixel
  vec3 col = vec3(0.0) + n;
  gl_FragColor.rgb = col;
  gl_FragColor.a = 1.0;
}