#define gln_COPY 1
#define gln_ADD 2
#define gln_SUBSTRACT 3
#define gln_MULTIPLY 4
#define gln_ADDSUB 5
#define gln_LIGHTEN 6
#define gln_DARKEN 7
#define gln_SWITCH 8
#define gln_DIVIDE 9
#define gln_OVERLAY 10
#define gln_SCREEN 11
#define gln_SOFTLIGHT 12

float gln_softLight(float f, float b) {
  return (f < 0.5)
             ? b - (1.0 - 2.0 * f) * b * (1.0 - b)
             : (b < 0.25)
                   ? b + (2.0 * f - 1.0) * b * ((16.0 * b - 12.0) * b + 3.0)
                   : b + (2.0 * f - 1.0) * (sqrt(b) - b);
}

vec4 gln_softLight(vec4 f, vec4 b) {
  vec4 result;
  result.x = gln_softLight(f.x, b.x);
  result.y = gln_softLight(f.y, b.y);
  result.z = gln_softLight(f.z, b.z);
  result.a = gln_softLight(f.a, b.a);
  return result;
}

vec4 gln_screen(vec4 f, vec4 b) {
  vec4 result;

  result = 1.0 - (1.0 - f) * (1.0 - b);

  return result;
}

float gln_overlay(float f, float b) {
  return (b < 0.5) ? 2.0 * f * b : 1.0 - 2.0 * (1.0 - f) * (1.0 - b);
}

vec4 gln_overlay(vec4 f, vec4 b) {
  vec4 result;
  result.x = gln_overlay(f.x, b.x);
  result.y = gln_overlay(f.y, b.y);
  result.z = gln_overlay(f.z, b.z);
  result.a = gln_overlay(f.a, b.a);
  return result;
}

vec4 gln_divide(vec4 f, vec4 b) {
  vec4 result = vec4(0.0);

  result = b / f;

  return result;
}

vec4 gln_switch(vec4 f, vec4 b, float o) {
  vec4 result = vec4(0.0);

  result = max((f * o), (b * (1.0 - o)));

  return result;
}

vec4 gln_darken(vec4 f, vec4 b) {
  vec4 result = vec4(0.0);

  result = min(f, b);

  return result;
}

vec4 gln_lighten(vec4 f, vec4 b) {
  vec4 result = vec4(0.0);

  result = max(f, b);

  return result;
}

float gln_addSub(float f, float b) { return f > 0.5 ? f + b : b - f; }

vec4 gln_addSub(vec4 f, vec4 b) {
  vec4 result = vec4(0.0);

  result.r = gln_addSub(f.r, b.r);
  result.g = gln_addSub(f.g, b.g);
  result.b = gln_addSub(f.b, b.b);
  result.a = gln_addSub(f.a, b.a);

  return result;
}

vec4 gln_multiply(vec4 f, vec4 b) {
  vec4 result = vec4(0.0);

  result = f * b;
  result.a = f.a + b.a * (1.0 - f.a);

  return result;
}

vec4 gln_subtract(vec4 f, vec4 b) {
  vec4 result = vec4(0.0);

  result = b - f;
  result.a = f.a + b.a * (1.0 - f.a);

  return result;
}

vec4 gln_add(vec4 f, vec4 b) {
  vec4 result = vec4(0.0);

  result = f + b;
  result.a = f.a + b.a * (1.0 - f.a);

  return result;
}

vec4 gln_copy(vec4 f, vec4 b) {
  vec4 result = vec4(0.0);

  result.a = f.a + b.a * (1.0 - f.a);
  result.rgb = ((f.rgb * f.a) + (b.rgb * b.a) * (1.0 - f.a));

  return result;
}

vec4 gln_blend(vec4 f, vec4 b, int type) {

  vec4 n;

  if (type == gln_COPY) {
    n = gln_copy(f, b);
  } else if (type == gln_ADD) {
    n = gln_add(f, b);
  } else if (type == gln_SUBSTRACT) {
    n = gln_subtract(f, b);
  } else if (type == gln_MULTIPLY) {
    n = gln_multiply(f, b);
  } else if (type == gln_ADDSUB) {
    n = gln_addSub(f, b);
  } else if (type == gln_LIGHTEN) {
    n = gln_lighten(f, b);
  } else if (type == gln_DARKEN) {
    n = gln_darken(f, b);
  } else if (type == gln_DIVIDE) {
    n = gln_divide(f, b);
  } else if (type == gln_OVERLAY) {
    n = gln_overlay(f, b);
  } else if (type == gln_SCREEN) {
    n = gln_screen(f, b);
  } else if (type == gln_SOFTLIGHT) {
    n = gln_softLight(f, b);
  }

  return n;
}