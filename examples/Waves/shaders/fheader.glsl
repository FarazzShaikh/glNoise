varying float vHeight;

vec3 calcColor() {

  vec3 diffuseColor;

  diffuseColor =
      mix(vec3(0., 0.514, 1.), vec3(0.549, 0.871, 1.), vHeight * 2.3);

  diffuseColor *= 0.65;

  return diffuseColor;
}
