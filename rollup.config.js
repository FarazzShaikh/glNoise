import glslify from "rollup-plugin-glslify";

const glslOpts = {
  // Default
  include: ["**/*.vs", "**/*.fs", "**/*.vert", "**/*.frag", "**/*.glsl"],

  // Undefined by default
  exclude: "node_modules/**",

  // Compress shader by default using logic from rollup-plugin-glsl
  compress: false,
};

export default [
  {
    input: "index.js",
    output: {
      file: "build/glNoise.m.js",
      format: "es",
    },
    plugins: [glslify(glslOpts)],
  },
  {
    input: "index.js",
    output: {
      file: "build/glNoise.js",
      format: "iife",
      name: "glNoise",
    },
    plugins: [glslify(glslOpts)],
  },
];
