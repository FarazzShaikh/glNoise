// #include <begin_vertex>

vec3 pos = displace(position);

vec3 norm = calcNormal(pos);

// vUv = uv;
// vNormal = norm;

vec3 newPos = pos;
vec3 newNormal = norm;

// #include <defaultnormal_vertex>

// determine view space position

// pass varyings to fragment shader

// determine final 3D position
// gl_Position = projectionMatrix * viewModelPosition;

// #include <worldpos_vertex>
// //
// #include <shadowmap_vertex>