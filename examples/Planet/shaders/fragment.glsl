
#define PI 3.14159265
varying vec3 vViewPosition;
varying vec2 vUv;

struct WorldOpts {
  float height;
  float seaLevel;
  float simplexOpacity;
};

uniform WorldOpts uWorldOpts;

varying float vHeight;
varying vec3 vNormal;

vec3 faceNormals(vec3 pos) {
  vec3 fdx = dFdx(pos);
  vec3 fdy = dFdy(pos);
  return normalize(cross(fdx, fdy));
}

float attenuation(float r, float f, float d) {
  float denom = d / r + 1.0;
  float attenuation = 1.0 / (denom * denom);
  float t = (attenuation - f) / (1.0 - f);
  return max(t, 0.0);
}

float computeDiffuse(vec3 lightDirection, vec3 viewDirection,
                     vec3 surfaceNormal, float roughness, float albedo) {

  float LdotV = dot(lightDirection, viewDirection);
  float NdotL = dot(lightDirection, surfaceNormal);
  float NdotV = dot(surfaceNormal, viewDirection);

  float s = LdotV - NdotL * NdotV;
  float t = mix(1.0, max(NdotL, NdotV), step(0.0, s));

  float sigma2 = roughness * roughness;
  float A = 1.0 + sigma2 * (albedo / (sigma2 + 0.13) + 0.5 / (sigma2 + 0.33));
  float B = 0.45 * sigma2 / (sigma2 + 0.09);

  return albedo * max(0.0, NdotL) * (A + B * s / t) / PI;
}

float computeSpecular(vec3 lightDirection, vec3 viewDirection,
                      vec3 surfaceNormal, float shininess) {

  // Calculate Phong power
  vec3 R = -reflect(lightDirection, surfaceNormal);
  return pow(max(0.0, dot(viewDirection, R)), shininess);
}

struct Light {
  vec3 position;
  vec3 color;
  vec3 ambient;
  float falloff;
  float radius;
};

uniform Light ulight1;
float specularScale = 0.65;
float shininess = 0.0;
float roughness = 1.0;
float albedo = 1.0;

vec3 calcColor() {

  vec3 diffuseColor;

  if (vHeight <= uWorldOpts.seaLevel)
    diffuseColor = vec3(0.161, 0.443, 0.902);

  else if (vHeight <= uWorldOpts.seaLevel + 0.01)
    diffuseColor = vec3(0.294, 0.839, 0.804);

  else if (vHeight <= uWorldOpts.seaLevel + 0.04)
    diffuseColor = vec3(1., 0.827, 0.706);

  else if (vHeight <= uWorldOpts.seaLevel + 0.09)
    diffuseColor = vec3(0.741, 0.824, 0.714);

  else if (vHeight <= uWorldOpts.seaLevel + 0.19)
    diffuseColor = vec3(0.329, 0.369, 0.325);

  else
    diffuseColor = vec3(1.0);

  return diffuseColor;
}

vec3 calcLight(Light light) {
  vec3 normal = faceNormals(vViewPosition);

  vec3 diffuseColor = calcColor();

  // determine perturbed surface normal
  vec3 V = normalize(vViewPosition);
  vec3 N = normal;

  vec4 lightPosition = viewMatrix * vec4(light.position, 1.0);
  vec3 lightVector = lightPosition.xyz - vViewPosition;

  // calculate attenuation
  float lightDistance = length(lightVector);
  float falloff = attenuation(light.radius, light.falloff, lightDistance);

  // light direction
  vec3 L = normalize(lightVector);

  // diffuse term
  vec3 diffuse =
      light.color * computeDiffuse(L, V, N, roughness, albedo) * falloff;

  float specularStrength = 1.0;
  float specular = specularStrength * computeSpecular(L, V, N, shininess);
  specular *= specularScale;
  specular *= falloff;

  return diffuseColor * (diffuse + light.ambient) + specular;
  //   return diffuseColor;
}

void main() {

  vec3 color1 = calcLight(ulight1);

  gl_FragColor.rgb = color1;
  gl_FragColor.a = 1.0;
}