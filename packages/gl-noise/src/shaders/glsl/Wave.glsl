

#define GLN_Gerstner_DEF_wavelength 4.
#define GLN_Gerstner_DEF_steepness 0.5
#define GLN_Gerstner_DEF_direction vec2(1., 0.)

vec3 gln_wave(vec3 p, vec2 direction, float steepness, float wavelength) {
  float k = 2.0 * GLN_PI / wavelength;
  float c = sqrt(9.8 / k);
  vec2 d = normalize(direction);
  float f = k * (dot(d, p.xy) - c);
  float a = steepness / k;

  return vec3(d.x * (a * cos(f)), a * sin(f), d.y * (a * cos(f)));
}

vec3 gln_wave(vec3 p, vec2 direction, float steepness) {
 return gln_wave(p, direction, steepness, GLN_Gerstner_DEF_wavelength);
}

vec3 gln_wave(vec3 p, vec2 direction) {
 return gln_wave(p, direction, GLN_Gerstner_DEF_steepness, GLN_Gerstner_DEF_wavelength);
}

vec3 gln_wave(vec3 p) {
 return gln_wave(p, GLN_Gerstner_DEF_direction, GLN_Gerstner_DEF_steepness, GLN_Gerstner_DEF_wavelength);
}
