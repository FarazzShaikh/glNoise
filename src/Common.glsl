#define MAX_FBM_ITERATIONS 30

struct gln_tFBMOpts // user defined structure.
{
  float seed;
  float persistance;
  float lacunarity;
  float scale;
  float redistribution;
  int octaves;
  bool terbulance;
  bool ridge;
};

struct gln_tVoronoiOpts // user defined structure.
{
  float seed;
  float distance;
  float scale;
  bool invert;
};

float gln_map(float value, float min1, float max1, float min2, float max2) {
  return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

float gln_normalize(float v) { return gln_map(v, -1.0, 1.0, 0.0, 1.0); }

vec2 gln_rand2(vec2 p) {
  return fract(
      sin(vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)))) *
      43758.5453);
}

vec4 gln_rand4(vec4 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
vec3 gln_rand3(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }

//	<https://www.shadertoy.com/view/4dS3Wd>
//	By Morgan McGuire @morgan3d, http://graphicscodex.com
//
float gln_rand(float n) { return fract(sin(n) * 1e4); }
float gln_rand(vec2 p) {
  return fract(1e4 * sin(17.0 * p.x + p.y * 0.1) *
               (0.1 + abs(sin(p.y * 13.0 + p.x))));
}

float gln_noise(float x) {
  float i = floor(x);
  float f = fract(x);
  float u = f * f * (3.0 - 2.0 * f);
  return mix(gln_rand(i), gln_rand(i + 1.0), u);
}

float gln_noise(vec2 x) {
  vec2 i = floor(x);
  vec2 f = fract(x);

  float a = gln_rand(i);
  float b = gln_rand(i + vec2(1.0, 0.0));
  float c = gln_rand(i + vec2(0.0, 1.0));
  float d = gln_rand(i + vec2(1.0, 1.0));

  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

float gln_noise(vec3 x) {
  const vec3 step = vec3(110, 241, 171);

  vec3 i = floor(x);
  vec3 f = fract(x);

  float n = dot(i, step);

  vec3 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(gln_rand(n + dot(step, vec3(0, 0, 0))),
                     gln_rand(n + dot(step, vec3(1, 0, 0))), u.x),
                 mix(gln_rand(n + dot(step, vec3(0, 1, 0))),
                     gln_rand(n + dot(step, vec3(1, 1, 0))), u.x),
                 u.y),
             mix(mix(gln_rand(n + dot(step, vec3(0, 0, 1))),
                     gln_rand(n + dot(step, vec3(1, 0, 1))), u.x),
                 mix(gln_rand(n + dot(step, vec3(0, 1, 1))),
                     gln_rand(n + dot(step, vec3(1, 1, 1))), u.x),
                 u.y),
             u.z);
}
