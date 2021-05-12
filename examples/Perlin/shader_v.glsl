
uniform float seed;

// the function which defines the displacement
float displace(vec3 point) {
  gln_tFBMOpts fbmOpts = gln_tFBMOpts(0.5, 2.0, 0.5, 1.0, 16, true, true);

  float n = gln_pfbm(point.xy + (seed * 100.0), fbmOpts);
  return n;
}
vec3 orthogonal(vec3 v) {
  return normalize(abs(v.x) > abs(v.z) ? vec3(-v.y, v.x, 0.0)
                                       : vec3(0.0, -v.z, v.y));
}

// MAIN

vec3 newPos = position;

newPos.z += displace(newPos);

float offset = 20.0 / 256.0;
vec3 tangent = orthogonal(normal);
vec3 bitangent = normalize(cross(normal, tangent));
vec3 neighbour1 = position + tangent * offset;
vec3 neighbour2 = position + bitangent * offset;
vec3 displacedNeighbour1 = neighbour1 + normal * displace(neighbour1);
vec3 displacedNeighbour2 = neighbour2 + normal * displace(neighbour2);
// https://i.ya-webdesign.com/images/vector-normals-tangent-16.png
vec3 displacedTangent = displacedNeighbour1 - newPos;
vec3 displacedBitangent = displacedNeighbour2 - newPos;
// https://upload.wikimedia.org/wikipedia/commons/d/d2/Right_hand_rule_cross_product.svg
vec3 newNormal = normalize(cross(displacedTangent, displacedBitangent));
