import ava from "ava";
import fs from "fs/promises";
import path from "path";
import {
  loadShadersRaw,
  loadShaders,
  loadShadersCSM,
} from "../build/glNoise.m.js";

ava("Test loadShadersRaw()", async (t) => {
  const expected = (
    await fs.readFile(path.resolve("tests/test.glsl"))
  ).toString();
  const actual = (await loadShadersRaw("tests/test.glsl"))[0];

  t.is(actual, expected);
});

ava("Test loadShaders()", async (t) => {
  const chunks = [[]];
  const paths = ["tests/test.glsl"];

  const common = (
    await fs.readFile(path.resolve("src/Common.glsl"))
  ).toString();
  const vert = (await fs.readFile(path.resolve("tests/test.glsl"))).toString();

  const actual = (await loadShaders(paths, chunks))[0];

  t.assert(actual.includes(vert) && actual.includes(common));
});

ava("Test loadShadersCSM()", async (t) => {
  const paths = {
    defines: "tests/test.glsl",
    header: "tests/test.glsl",
    main: "tests/test.glsl",
  };
  const expected = (
    await fs.readFile(path.resolve("tests/test.glsl"))
  ).toString();

  const actual = await loadShadersCSM(paths, []);
  console.log(actual.header.includes(expected));

  t.assert(actual.defines.includes(expected));
  t.is(actual.header, "\n" + expected);
  t.is(actual.main, expected);
});
