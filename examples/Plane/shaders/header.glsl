
// the function which defines the displacement
float displace(vec3 point) {

  gln_tFBMOpts pfbmOpts =
      gln_tFBMOpts(uSeed, 0.3, 2.0, 0.5, 1.0, 5, false, false);

  gln_tFBMOpts sfbmOpts =
      gln_tFBMOpts(uSeed, 0.3, 2.0, 0.3, 1.0, 5, false, false);

  gln_tFBMOpts fbmOpts2 =
      gln_tFBMOpts(uSeed, 0.4, 1.8, 0.2, 1.0, 5, true, true);

  gln_tVoronoiOpts voronoiOpts = gln_tVoronoiOpts(uSeed, 0.0, 0.5, false);
  gln_tVoronoiOpts voronoiOpts2 = gln_tVoronoiOpts(uSeed, 0.0, 0.5, true);

  float n;

  point.xy += uTime;

  if (uType == 0) {
    n = gln_normalize(gln_perlin(point.xy * 0.7));
  } else if (uType == 1) {
    n = gln_normalize(gln_simplex(point.xy * 0.5));
  } else if (uType == 2) {
    n = gln_normalize(gln_pfbm(point.xy, pfbmOpts)) * 2.0;
  } else if (uType == 3) {
    n = gln_normalize(gln_sfbm(point.xy, sfbmOpts)) * 2.0;
  } else if (uType == 4) {
    n = gln_normalize(gln_sfbm(point.xy, fbmOpts2)) * 2.0;
  } else if (uType == 5) {
    n = gln_voronoi(point.xy, voronoiOpts);
  } else if (uType == 6) {
    n = gln_voronoi(point.xy, voronoiOpts2);
  }

  return n;
}
vec3 orthogonal(vec3 v) {
  return normalize(abs(v.x) > abs(v.z) ? vec3(-v.y, v.x, 0.0)
                                       : vec3(0.0, -v.z, v.y));
}
