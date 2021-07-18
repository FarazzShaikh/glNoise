
vec2 uv = vUv;
uv.x += uShift;

vec4 shapeData = texture2D(uShape, gl_PointCoord);
if (shapeData.a < 0.0625)
  discard;

vec4 newColor = vec4(vPosition, 1.0);
newColor = newColor * shapeData;
