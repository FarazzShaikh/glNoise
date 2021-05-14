
vec2 _fade(vec2 t) { return t * t * t * (t * (t * 6.0 - 15.0) + 10.0); }

/**
 * Generats Perlin Noise.
 *
 * @name gln_perlin
 * @function
 * @param {vec2} p  Point to sample Perlin Noise at.
 * @return {float}  Value of Perlin Noise at point "p".
 *
 * @example
 * float n = gln_perlin(position.xy);
 */
float gln_perlin(vec2 P) {
  vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
  vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
  Pi = mod(Pi, 289.0); // To avoid truncation effects in permutation
  vec4 ix = Pi.xzxz;
  vec4 iy = Pi.yyww;
  vec4 fx = Pf.xzxz;
  vec4 fy = Pf.yyww;
  vec4 i = gln_rand4(gln_rand4(ix) + iy);
  vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0; // 1/41 = 0.024...
  vec4 gy = abs(gx) - 0.5;
  vec4 tx = floor(gx + 0.5);
  gx = gx - tx;
  vec2 g00 = vec2(gx.x, gy.x);
  vec2 g10 = vec2(gx.y, gy.y);
  vec2 g01 = vec2(gx.z, gy.z);
  vec2 g11 = vec2(gx.w, gy.w);
  vec4 norm =
      1.79284291400159 - 0.85373472095314 * vec4(dot(g00, g00), dot(g01, g01),
                                                 dot(g10, g10), dot(g11, g11));
  g00 *= norm.x;
  g01 *= norm.y;
  g10 *= norm.z;
  g11 *= norm.w;
  float n00 = dot(g00, vec2(fx.x, fy.x));
  float n10 = dot(g10, vec2(fx.y, fy.y));
  float n01 = dot(g01, vec2(fx.z, fy.z));
  float n11 = dot(g11, vec2(fx.w, fy.w));
  vec2 fade_xy = _fade(Pf.xy);
  vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
  float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
  return 2.3 * n_xy;
}

/**
 * Generats Fractional Brownian motion (fBm) from Perlin Noise.
 *
 * @name gln_pfbm
 * @function
 * @param {vec2} p               Point to sample fBm at.
 * @param {gln_tFBMOpts} opts    Options for generating Perlin Noise.
 * @return {float}               Value of fBm at point "p".
 *
 * @example
 * gln_tFBMOpts opts =
 *      gln_tFBMOpts(uSeed, 0.3, 2.0, 0.5, 1.0, 5, false, false);
 *
 * float n = gln_pfbm(position.xy, opts);
 */
float gln_pfbm(vec2 p, gln_tFBMOpts opts) {
  p += (opts.seed * 100.0);
  float persistance = opts.persistance;
  float lacunarity = opts.lacunarity;
  float redistribution = opts.redistribution;
  int octaves = opts.octaves;
  bool terbulance = opts.terbulance;
  bool ridge = opts.terbulance && opts.ridge;

  float result = 0.0;
  float amplitude = 1.0;
  float frequency = 1.0;
  float maximum = amplitude;

  for (int i = 0; i < MAX_FBM_ITERATIONS; i++) {
    if (i >= octaves)
      break;

    vec2 p = p.xy * frequency * opts.scale;

    float noiseVal = gln_perlin(p);

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