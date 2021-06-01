

varying vec2 vUv;
varying vec3 vViewPosition;

struct MaskOpts {
  float scale;
};

struct WorldOpts {
  float height;
  float seaLevel;
  float simplexOpacity;
};

uniform gln_tFBMOpts uRidgeOpts;
uniform gln_tFBMOpts uSimplexOpts;
uniform MaskOpts uMaskOpts;
uniform WorldOpts uWorldOpts;

varying float vHeight;
varying vec3 vNormal;

vec3 displace(vec3 point) {

  vec3 p = point;

  float seed = uSimplexOpts.seed;
  float mask = gln_normalize(gln_simplex(
      (point + ((seed * 100.0) + (seed * 1000.0))) * uMaskOpts.scale));

  gln_tFBMOpts opts1 = uSimplexOpts;
  opts1.redistribution = 1.0;
  float f_simplex = gln_normalize(gln_sfbm(point, opts1));

  gln_tFBMOpts opts2 = uRidgeOpts;
  opts2.redistribution = 1.0;
  float f_ridge = gln_normalize(gln_sfbm(point, opts2));

  float blend = gln_blend(vec4(f_ridge),
                          vec4(f_simplex * uWorldOpts.simplexOpacity), gln_ADD)
                    .x;
  float f = blend;

  blend = gln_blend(vec4(f), vec4(mask), gln_MULTIPLY).x;
  f = blend;

  if (f < uWorldOpts.seaLevel)
    f = uWorldOpts.seaLevel;

  f *= uWorldOpts.height;
  vHeight = f;
  p = point + (normal * (f));

  return p;
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

void main() {

  vec3 pos = displace(position);

  vec3 norm = calcNormal(pos);

  // determine view space position
  mat4 modelViewMatrix = viewMatrix * modelMatrix;
  vec4 viewModelPosition = modelViewMatrix * vec4(pos, 1.0);

  // pass varyings to fragment shader
  vViewPosition = viewModelPosition.xyz;
  vUv = uv;
  vNormal = norm;

  // determine final 3D position
  gl_Position = projectionMatrix * viewModelPosition;
}