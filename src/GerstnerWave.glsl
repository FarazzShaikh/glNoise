vec3 gln_GerstnerWave(vec3 p, vec4 wave, float dt) {
  float steepness = wave.z;
  float wavelength = wave.w;
  float k = 2.0 * gln_PI / wavelength;
  float c = sqrt(9.8 / k);
  vec2 d = normalize(wave.xy);
  float f = k * (dot(d, p.xy) - c * dt);
  float a = steepness / k;

  return vec3(d.x * (a * cos(f)), a * sin(f), d.y * (a * cos(f)));
}
