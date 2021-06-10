
uniform float uTime;

varying float vHeight;
// varying vec3 vNormal;

// the function which defines the displacement

vec3 displace(vec3 point) {

  vec3 p = point;

  p.y += uTime * 2.0;

  gln_tFBMOpts fbmOpts = gln_tFBMOpts(1.0, 0.4, 2.3, 0.4, 1.0, 5, false, false);

  gln_tGerstnerWaveOpts A = gln_tGerstnerWaveOpts(vec2(0.0, -1.0), 0.5, 2.0);
  gln_tGerstnerWaveOpts B = gln_tGerstnerWaveOpts(vec2(0.0, 1.0), 0.25, 4.0);
  gln_tGerstnerWaveOpts C = gln_tGerstnerWaveOpts(vec2(1.0, 1.0), 0.15, 6.0);
  gln_tGerstnerWaveOpts D = gln_tGerstnerWaveOpts(vec2(1.0, 1.0), 0.4, 2.0);

  vec3 n = vec3(0.0);
  n.z += gln_normalize(gln_pfbm(p.xy + (uTime * 0.5), fbmOpts));
  n += gln_GerstnerWave(p, A, uTime).xzy;
  n += gln_GerstnerWave(p, B, uTime).xzy * 0.5;
  n += gln_GerstnerWave(p, C, uTime).xzy * 0.25;
  n += gln_GerstnerWave(p, D, uTime).xzy * 0.2;

  vHeight = n.z;

  return point + n;
}

vec3 orthogonal(vec3 v) {
  return normalize(abs(v.x) > abs(v.z) ? vec3(-v.y, v.x, 0.0)
                                       : vec3(0.0, -v.z, v.y));
}

vec3 calcNormal(vec3 pos) {

  float offset = 20.0 / 256.0;
  vec3 tangent = orthogonal(normal);
  vec3 bitangent = normalize(cross(normal, tangent));
  vec3 neighbour1 = position + tangent * offset;
  vec3 neighbour2 = position + bitangent * offset;
  vec3 displacedNeighbour1 = displace(neighbour1);
  vec3 displacedNeighbour2 = displace(neighbour2);
  // https://i.ya-webdesign.com/images/vector-normals-tangent-16.png
  vec3 displacedTangent = displacedNeighbour1 - pos;
  vec3 displacedBitangent = displacedNeighbour2 - pos;
  // https://upload.wikimedia.org/wikipedia/commons/d/d2/Right_hand_rule_cross_product.svg
  return normalize(cross(displacedTangent, displacedBitangent));
}