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