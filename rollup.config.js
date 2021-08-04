import glslify from "rollup-plugin-glslify";
import typescript from "rollup-plugin-typescript2";
import dts from "rollup-plugin-dts";

const glslOpts = {
  include: ["**/*.vs", "**/*.fs", "**/*.vert", "**/*.frag", "**/*.glsl"],
  exclude: "node_modules/**",
};

const tscOpts = {
  useTsconfigDeclarationDir: true,
};

export default [
  {
    input: "index.ts",
    output: {
      file: "build/glNoise.m.node.js",
      format: "es",
    },
    external: ["fs", "path"],
    plugins: [glslify(glslOpts), typescript(tscOpts)],
  },
  {
    input: "index.ts",
    output: {
      file: "build/glNoise.js",
      format: "iife",
      name: "glNoise",
    },
    external: ["fs", "path"],
    plugins: [glslify(glslOpts), typescript(tscOpts)],
  },
  {
    input: "build/types/index.d.ts",
    output: [{ file: "build/three-csm.d.ts", format: "es" }],
    plugins: [dts()],
  },
];
