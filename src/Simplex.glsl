
float gln_simplex(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626,
                      0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = gln_rand3(gln_rand3(i.y + vec3(0.0, i1.y, 1.0)) + i.x +
                     vec3(0.0, i1.x, 1.0));
  vec3 m = max(
      0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

float gln_sfbm(vec2 pos, gln_tFBMOpts props) {
  pos += (props.seed * 100.0);
  float persistance = props.persistance;
  float lacunarity = props.lacunarity;
  float redistribution = props.redistribution;
  int octaves = props.octaves;
  bool terbulance = props.terbulance;
  bool ridge = props.terbulance && props.ridge;

  float result = 0.0;
  float amplitude = 1.0;
  float frequency = 1.0;
  float maximum = amplitude;

  for (int i = 0; i < MAX_FBM_ITERATIONS; i++) {
    if (i >= octaves)
      break;

    vec2 p = pos.xy * frequency * props.scale;

    float noiseVal = gln_simplex(p);

    if (terbulance)
      noiseVal = abs(noiseVal);

    if (ridge)
      noiseVal = -1.0 * noiseVal;

    result += noiseVal * amplitude;

    frequency *= lacunarity;
    amplitude *= persistance;
    maximum += amplitude;
  }

  float redistributed = pow(result, redistribution);
  return redistributed / maximum;
}