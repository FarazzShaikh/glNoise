

vec3 p = position;
// p += uTargetPos * 0.1;

vec3 f = gln_curl((p * 0.2) + uTime * 0.05);

vUv = uv;

vec3 newPos = position + f;

vec3 seg = newPos - uTargetPos;
vec3 dir = normalize(seg);
float dist = length(seg);
if (dist < 3.) {
  float force = clamp(1. / (dist * dist), 0., 1.);
  newPos += dir * force;
}

vPosition = newPos;
vec3 newNormal = normal;
