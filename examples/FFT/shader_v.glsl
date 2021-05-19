
// Attributes are predefined by the WebGL Library
attribute vec2 uv;       // UV Coordinates
attribute vec2 position; // 3D World coordinates

// Varyings are variables passed to the Fragment Shader from the vertex shader
varying vec2 vUv;

void main() {
  vUv = uv;

  // Final position of the vertex
  gl_Position = vec4(position, 0, 1);
}