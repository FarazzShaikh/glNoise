var glNoise = (function (exports) {
  'use strict';

  var _Head = "precision highp float;\n#define GLSLIFY 1\n"; // eslint-disable-line

  var _Perlin2D = "#define GLSLIFY 1\n// From https://github.com/hughsk/glsl-noise/blob/master/periodic/2d.glsl\n\n#define MAX_ITERATIONS 10\n\nvec4 permute(vec4 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }\nvec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }\nvec2 fade(vec2 t) { return t * t * t * (t * (t * 6.0 - 15.0) + 10.0); }\n\nfloat gln_perlin2D(vec2 P) {\n  vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);\n  vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);\n  Pi = mod(Pi, 289.0); // To avoid truncation effects in permutation\n  vec4 ix = Pi.xzxz;\n  vec4 iy = Pi.yyww;\n  vec4 fx = Pf.xzxz;\n  vec4 fy = Pf.yyww;\n  vec4 i = permute(permute(ix) + iy);\n  vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0; // 1/41 = 0.024...\n  vec4 gy = abs(gx) - 0.5;\n  vec4 tx = floor(gx + 0.5);\n  gx = gx - tx;\n  vec2 g00 = vec2(gx.x, gy.x);\n  vec2 g10 = vec2(gx.y, gy.y);\n  vec2 g01 = vec2(gx.z, gy.z);\n  vec2 g11 = vec2(gx.w, gy.w);\n  vec4 norm =\n      1.79284291400159 - 0.85373472095314 * vec4(dot(g00, g00), dot(g01, g01),\n                                                 dot(g10, g10), dot(g11, g11));\n  g00 *= norm.x;\n  g01 *= norm.y;\n  g10 *= norm.z;\n  g11 *= norm.w;\n  float n00 = dot(g00, vec2(fx.x, fy.x));\n  float n10 = dot(g10, vec2(fx.y, fy.y));\n  float n01 = dot(g01, vec2(fx.z, fy.z));\n  float n11 = dot(g11, vec2(fx.w, fy.w));\n  vec2 fade_xy = fade(Pf.xy);\n  vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);\n  float n_xy = mix(n_x.x, n_x.y, fade_xy.y);\n  return 2.3 * n_xy;\n}\n\nfloat gln_fbm2D(vec2 pos, vec4 props) {\n  float persistance = props.x;\n  float lacunarity = props.y;\n  float redistribution = props.z;\n  int octaves = int(props.w);\n\n  float result = 0.0;\n  float amplitude = 1.0;\n  float frequency = 1.0;\n  float maximum = amplitude;\n\n  for (int i = 0; i < MAX_ITERATIONS; i++) {\n    if (i >= octaves)\n      break;\n\n    vec2 p = pos.xy * frequency;\n\n    float noiseVal = gln_perlin2D(p);\n    result += noiseVal * amplitude;\n\n    frequency *= lacunarity;\n    amplitude *= persistance;\n    maximum += amplitude;\n  }\n\n  float redistributed = pow(result, redistribution);\n  return redistributed / maximum;\n}\n"; // eslint-disable-line

  var _Utils = "#define GLSLIFY 1\nfloat gln_map(float value, float min1, float max1, float min2, float max2) {\n  return min2 + (value - min1) * (max2 - min2) / (max1 - min1);\n}"; // eslint-disable-line

  const Perlin2D = _Perlin2D;
  const Utils = _Utils;

  async function loadShaders(frag, vert, chunks) {
    const shaders = [frag, vert];
    let [_frag, _vert] = await Promise.all(
      shaders.map(async (s) => {
        return (await fetch(s)).text();
      })
    );

    if (chunks) {
      if (chunks.frag) _frag = _Head + chunks.frag.join("\n") + _frag;
      if (chunks.vert) _vert = _Head + chunks.vert.join("\n") + _vert;
    }

    return [_frag, _vert];
  }

  exports.Perlin2D = Perlin2D;
  exports.Utils = Utils;
  exports.loadShaders = loadShaders;

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;

}({}));
