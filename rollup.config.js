import glslify from "rollup-plugin-glslify";
import typescript from "@rollup/plugin-typescript";

const glslOpts = {
  // Default
  include: ["**/*.vs", "**/*.fs", "**/*.vert", "**/*.frag", "**/*.glsl"],

  // Undefined by default
  exclude: "node_modules/**",

  // Compress shader by default using logic from rollup-plugin-glsl
  compress: false,
};

const tscOpts = {
  lib: ["es5", "es6", "dom"],
  target: "ESNext",
  tsconfig: false,
  moduleResolution: "node",
};

export default [
  {
    input: "index.ts",
    output: {
      file: "build/glNoise.m.js",
      format: "es",
    },
    plugins: [glslify(glslOpts), typescript(tscOpts)],
  },
  {
    input: "index.ts",
    output: {
      file: "build/glNoise.js",
      format: "iife",
      name: "glNoise",
    },
    plugins: [glslify(glslOpts), typescript(tscOpts)],
  },
];
