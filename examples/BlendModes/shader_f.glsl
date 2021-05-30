precision highp float;
varying vec2 vUv;

uniform int uType;
uniform vec2 uResolution;
uniform sampler2D uRect;
uniform sampler2D uLogo;

void main() {

  vec2 uv = vUv;
  uv.x *= uResolution.x / uResolution.y;

  gln_tFBMOpts fbmOpts1 =
      gln_tFBMOpts(1.0, 0.5, 2.0, 1.0, 1.0, 1, false, false);
  gln_tFBMOpts fbmOpts2 =
      gln_tFBMOpts(1.0, 0.5, 2.0, 1.0, 1.0, 7, false, false);

  float f1 = gln_normalize(gln_sfbm(uv, fbmOpts1));
  float f2 = gln_normalize(gln_sfbm(uv, fbmOpts2));

  //   vec4 logo = vec4(vec3(f1), 1.0);
  //   vec4 rect = vec4(vec3(f2), 1.0);
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