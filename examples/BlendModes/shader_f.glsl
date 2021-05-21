precision highp float;
varying vec2 vUv;

uniform int uType;
uniform sampler2D uRect;
uniform sampler2D uLogo;

void main() {

  vec2 uv = vUv;
  vec4 logo = texture2D(uLogo, uv);
  vec4 rect = texture2D(uRect, uv);

  vec4 final;

  //   uv += uTime;

  if (uType == 0) {
    final = gln_blend(logo, rect, gln_COPY);
  } else if (uType == 1) {
    final = gln_blend(logo, rect, gln_ADD);
  } else if (uType == 2) {
    final = gln_blend(logo, rect, gln_SUBSTRACT);
  } else if (uType == 3) {
    final = gln_blend(logo, rect, gln_MULTIPLY);
  } else if (uType == 4) {
    final = gln_blend(logo, rect, gln_ADDSUB);
  } else if (uType == 5) {
    final = gln_blend(logo, rect, gln_LIGHTEN);
  } else if (uType == 6) {
    final = gln_blend(logo, rect, gln_DARKEN);
  } else if (uType == 7) {
    final = gln_blend(logo, rect, gln_DIVIDE);
  } else if (uType == 8) {
    final = gln_blend(logo, rect, gln_OVERLAY);
  } else if (uType == 9) {
    final = gln_blend(logo, rect, gln_SCREEN);
  } else if (uType == 10) {
    final = gln_blend(logo, rect, gln_SOFTLIGHT);
  }

  gl_FragColor = final;
}