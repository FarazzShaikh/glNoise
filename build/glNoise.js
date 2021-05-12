var glNoise = (function (exports) {
  'use strict';

  var _Head = "precision highp float;\n#define GLSLIFY 1\n\nstruct gln_tFBMOpts // user defined structure.\n{\n  float persistance;\n  float lacunarity;\n  float scale;\n  float redistribution;\n  int octaves;\n  bool terbulance;\n  bool ridge;\n};\n"; // eslint-disable-line

  var _Perlin = "#define GLSLIFY 1\n// From https://github.com/hughsk/glsl-noise/blob/master/periodic/2d.glsl\n\n#define MAX_ITERATIONS 10\n\nvec4 permute(vec4 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }\nvec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }\nvec2 fade(vec2 t) { return t * t * t * (t * (t * 6.0 - 15.0) + 10.0); }\n\nfloat gln_perlin(vec2 P) {\n  vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);\n  vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);\n  Pi = mod(Pi, 289.0); // To avoid truncation effects in permutation\n  vec4 ix = Pi.xzxz;\n  vec4 iy = Pi.yyww;\n  vec4 fx = Pf.xzxz;\n  vec4 fy = Pf.yyww;\n  vec4 i = permute(permute(ix) + iy);\n  vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0; // 1/41 = 0.024...\n  vec4 gy = abs(gx) - 0.5;\n  vec4 tx = floor(gx + 0.5);\n  gx = gx - tx;\n  vec2 g00 = vec2(gx.x, gy.x);\n  vec2 g10 = vec2(gx.y, gy.y);\n  vec2 g01 = vec2(gx.z, gy.z);\n  vec2 g11 = vec2(gx.w, gy.w);\n  vec4 norm =\n      1.79284291400159 - 0.85373472095314 * vec4(dot(g00, g00), dot(g01, g01),\n                                                 dot(g10, g10), dot(g11, g11));\n  g00 *= norm.x;\n  g01 *= norm.y;\n  g10 *= norm.z;\n  g11 *= norm.w;\n  float n00 = dot(g00, vec2(fx.x, fy.x));\n  float n10 = dot(g10, vec2(fx.y, fy.y));\n  float n01 = dot(g01, vec2(fx.z, fy.z));\n  float n11 = dot(g11, vec2(fx.w, fy.w));\n  vec2 fade_xy = fade(Pf.xy);\n  vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);\n  float n_xy = mix(n_x.x, n_x.y, fade_xy.y);\n  return 2.3 * n_xy;\n}\n\nfloat gln_pfbm(vec2 pos, gln_tFBMOpts props) {\n  float persistance = props.persistance;\n  float lacunarity = props.lacunarity;\n  float redistribution = props.redistribution;\n  int octaves = props.octaves;\n  bool terbulance = props.terbulance;\n  bool ridge = props.terbulance && props.ridge;\n\n  float result = 0.0;\n  float amplitude = 1.0;\n  float frequency = 1.0;\n  float maximum = amplitude;\n\n  for (int i = 0; i < MAX_ITERATIONS; i++) {\n    if (i >= octaves)\n      break;\n\n    vec2 p = pos.xy * frequency * props.scale;\n\n    float noiseVal = gln_perlin(p);\n\n    if (terbulance)\n      noiseVal = abs(noiseVal);\n\n    if (ridge)\n      noiseVal = -1.0 * noiseVal;\n\n    result += noiseVal * amplitude;\n\n    frequency *= lacunarity;\n    amplitude *= persistance;\n    maximum += amplitude;\n  }\n\n  float redistributed = pow(result, redistribution);\n  return redistributed / maximum;\n}"; // eslint-disable-line

  var _Simplex = "#define GLSLIFY 1\n//\tSimplex 3D Noise\n//\tby Ian McEwan, Ashima Arts\n//\n\nvec4 _taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }\nvec3 _permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }\nvec4 _permute(vec4 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }\n\nfloat gln_simplex(vec2 v) {\n  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626,\n                      0.024390243902439);\n  vec2 i = floor(v + dot(v, C.yy));\n  vec2 x0 = v - i + dot(i, C.xx);\n  vec2 i1;\n  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);\n  vec4 x12 = x0.xyxy + C.xxzz;\n  x12.xy -= i1;\n  i = mod(i, 289.0);\n  vec3 p = _permute(_permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x +\n                    vec3(0.0, i1.x, 1.0));\n  vec3 m = max(\n      0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);\n  m = m * m;\n  m = m * m;\n  vec3 x = 2.0 * fract(p * C.www) - 1.0;\n  vec3 h = abs(x) - 0.5;\n  vec3 ox = floor(x + 0.5);\n  vec3 a0 = x - ox;\n  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);\n  vec3 g;\n  g.x = a0.x * x0.x + h.x * x0.y;\n  g.yz = a0.yz * x12.xz + h.yz * x12.yw;\n  return 130.0 * dot(m, g);\n}\n\nfloat gln_simplex(vec3 v) {\n  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);\n  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);\n\n  // First corner\n  vec3 i = floor(v + dot(v, C.yyy));\n  vec3 x0 = v - i + dot(i, C.xxx);\n\n  // Other corners\n  vec3 g = step(x0.yzx, x0.xyz);\n  vec3 l = 1.0 - g;\n  vec3 i1 = min(g.xyz, l.zxy);\n  vec3 i2 = max(g.xyz, l.zxy);\n\n  //  x0 = x0 - 0. + 0.0 * C\n  vec3 x1 = x0 - i1 + 1.0 * C.xxx;\n  vec3 x2 = x0 - i2 + 2.0 * C.xxx;\n  vec3 x3 = x0 - 1. + 3.0 * C.xxx;\n\n  // Permutations\n  i = mod(i, 289.0);\n  vec4 p = _permute(_permute(_permute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y +\n                             vec4(0.0, i1.y, i2.y, 1.0)) +\n                    i.x + vec4(0.0, i1.x, i2.x, 1.0));\n\n  // Gradients\n  // ( N*N points uniformly over a square, mapped onto an octahedron.)\n  float n_ = 1.0 / 7.0; // N=7\n  vec3 ns = n_ * D.wyz - D.xzx;\n\n  vec4 j = p - 49.0 * floor(p * ns.z * ns.z); //  mod(p,N*N)\n\n  vec4 x_ = floor(j * ns.z);\n  vec4 y_ = floor(j - 7.0 * x_); // mod(j,N)\n\n  vec4 x = x_ * ns.x + ns.yyyy;\n  vec4 y = y_ * ns.x + ns.yyyy;\n  vec4 h = 1.0 - abs(x) - abs(y);\n\n  vec4 b0 = vec4(x.xy, y.xy);\n  vec4 b1 = vec4(x.zw, y.zw);\n\n  vec4 s0 = floor(b0) * 2.0 + 1.0;\n  vec4 s1 = floor(b1) * 2.0 + 1.0;\n  vec4 sh = -step(h, vec4(0.0));\n\n  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;\n  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;\n\n  vec3 p0 = vec3(a0.xy, h.x);\n  vec3 p1 = vec3(a0.zw, h.y);\n  vec3 p2 = vec3(a1.xy, h.z);\n  vec3 p3 = vec3(a1.zw, h.w);\n\n  // Normalise gradients\n  vec4 norm =\n      _taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));\n  p0 *= norm.x;\n  p1 *= norm.y;\n  p2 *= norm.z;\n  p3 *= norm.w;\n\n  // Mix final noise value\n  vec4 m =\n      max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);\n  m = m * m;\n  return 42.0 *\n         dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));\n}\n\nfloat gln_sfbm(vec2 pos, gln_tFBMOpts props) {\n  float persistance = props.persistance;\n  float lacunarity = props.lacunarity;\n  float redistribution = props.redistribution;\n  int octaves = props.octaves;\n  bool terbulance = props.terbulance;\n  bool ridge = props.terbulance && props.ridge;\n\n  float result = 0.0;\n  float amplitude = 1.0;\n  float frequency = 1.0;\n  float maximum = amplitude;\n\n  for (int i = 0; i < MAX_ITERATIONS; i++) {\n    if (i >= octaves)\n      break;\n\n    vec2 p = pos.xy * frequency * props.scale;\n\n    float noiseVal = gln_simplex(p);\n\n    if (terbulance)\n      noiseVal = abs(noiseVal);\n\n    if (ridge)\n      noiseVal = -1.0 * noiseVal;\n\n    result += noiseVal * amplitude;\n\n    frequency *= lacunarity;\n    amplitude *= persistance;\n    maximum += amplitude;\n  }\n\n  float redistributed = pow(result, redistribution);\n  return redistributed / maximum;\n}"; // eslint-disable-line

  var _Voronoi = "#define GLSLIFY 1\n// https://iquilezles.org/www/articles/voronoilines/voronoilines.htm\n\nvec2 gln_rand2(vec2 p) {\n  return fract(\n      sin(vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)))) *\n      43758.5453);\n}\n\nfloat gln_voronoi(vec2 x) {\n  vec2 p = floor(x);\n  vec2 f = fract(x);\n\n  float min_dist = 1.0;\n  for (int j = -1; j <= 1; j++)\n    for (int i = -1; i <= 1; i++) {\n\n      vec2 neighbor = vec2(float(i), float(j));\n\n      vec2 point = gln_rand2(p + neighbor);\n\n      vec2 diff = neighbor + point - f;\n\n      float dist = length(diff) * 1.0;\n\n      min_dist = min(min_dist, dist);\n    }\n\n  return min_dist;\n}\n"; // eslint-disable-line

  var _Noise = "#define GLSLIFY 1\n//\t<https://www.shadertoy.com/view/4dS3Wd>\n//\tBy Morgan McGuire @morgan3d, http://graphicscodex.com\n//\nfloat gln_rand(float n) { return fract(sin(n) * 1e4); }\nfloat gln_rand(vec2 p) {\n  return fract(1e4 * sin(17.0 * p.x + p.y * 0.1) *\n               (0.1 + abs(sin(p.y * 13.0 + p.x))));\n}\n\nfloat gln_noise(float x) {\n  float i = floor(x);\n  float f = fract(x);\n  float u = f * f * (3.0 - 2.0 * f);\n  return mix(gln_rand(i), gln_rand(i + 1.0), u);\n}\n\nfloat gln_noise(vec2 x) {\n  vec2 i = floor(x);\n  vec2 f = fract(x);\n\n  float a = gln_rand(i);\n  float b = gln_rand(i + vec2(1.0, 0.0));\n  float c = gln_rand(i + vec2(0.0, 1.0));\n  float d = gln_rand(i + vec2(1.0, 1.0));\n\n  vec2 u = f * f * (3.0 - 2.0 * f);\n  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;\n}\n\nfloat gln_noise(vec3 x) {\n  const vec3 step = vec3(110, 241, 171);\n\n  vec3 i = floor(x);\n  vec3 f = fract(x);\n\n  float n = dot(i, step);\n\n  vec3 u = f * f * (3.0 - 2.0 * f);\n  return mix(mix(mix(gln_rand(n + dot(step, vec3(0, 0, 0))),\n                     gln_rand(n + dot(step, vec3(1, 0, 0))), u.x),\n                 mix(gln_rand(n + dot(step, vec3(0, 1, 0))),\n                     gln_rand(n + dot(step, vec3(1, 1, 0))), u.x),\n                 u.y),\n             mix(mix(gln_rand(n + dot(step, vec3(0, 0, 1))),\n                     gln_rand(n + dot(step, vec3(1, 0, 1))), u.x),\n                 mix(gln_rand(n + dot(step, vec3(0, 1, 1))),\n                     gln_rand(n + dot(step, vec3(1, 1, 1))), u.x),\n                 u.y),\n             u.z);\n}"; // eslint-disable-line

  var _Utils = "#define GLSLIFY 1\nfloat gln_map(float value, float min1, float max1, float min2, float max2) {\n  return min2 + (value - min1) * (max2 - min2) / (max1 - min1);\n}"; // eslint-disable-line

  const Perlin = _Perlin;
  const Simplex = _Simplex;
  const Voronoi = _Voronoi;
  const Noise = _Noise;
  const Utils = _Utils;
  async function loadShaders(frag, vert, chunks, splitUp) {
      const shaders = [frag, vert];
      let [_frag, _vert] = await Promise.all(shaders.map(async (s) => {
          return (await fetch(s)).text();
      }));
      if (splitUp) {
          return [
              {
                  defines: _Head,
                  header: chunks.frag.join("\n"),
                  main: _frag,
              },
              {
                  defines: _Head,
                  header: chunks.vert.join("\n") + _vert.split("// MAIN")[0],
                  main: _vert.split("// MAIN")[1],
              },
          ];
      }
      if (chunks) {
          if (chunks.frag)
              _frag = _Head + chunks.frag.join("\n") + _frag;
          if (chunks.vert)
              _vert = _Head + chunks.vert.join("\n") + _vert;
      }
      return [_frag, _vert];
  }

  exports.Noise = Noise;
  exports.Perlin = Perlin;
  exports.Simplex = Simplex;
  exports.Utils = Utils;
  exports.Voronoi = Voronoi;
  exports.loadShaders = loadShaders;

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;

}({}));
