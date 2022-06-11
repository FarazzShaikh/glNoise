
// private
vec3 _gln_mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 _gln_mod289(vec4 x) { 
    return x - floor(x * (1.0 / 289.0)) * 289.0; 
}

vec4 _gln_permute(vec4 x) {
  return _gln_mod289(((x * 34.0) + 10.0) * x);
}

vec4 _gln_taylorInvSqrt(vec4 r) {
  return 1.79284291400159 - 0.85373472095314 * r;
}

vec2 _gln_fade(vec2 t) {
  return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
}

vec3 _gln_fade(vec3 t) {
  return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
}

// public

float gln_map(float value, float min1, float max1, float min2, float max2) {
  return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

float gln_normalize(float v) { 
    return gln_map(v, -1., 1.0, 0.0, 1.0); 
}