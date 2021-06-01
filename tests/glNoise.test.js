import ava from "ava";
import fs from "fs/promises";
import path from "path";
import {
  loadShadersRaw,
  loadShaders,
  loadShadersCSM,
} from "../build/glNoise.m.js";

let files;
let expected;

ava.before(async () => {
  files = (await fs.readdir("src")).filter(
    (file) => path.extname(file).toLowerCase() === ".glsl"
  );

  expected = await Promise.all(
    files.map(async (f) =>
      (await fs.readFile(path.resolve(`src/${f}`))).toString()
    )
  );
});

ava("Test file extensions", async (t) => {
  const files = (await fs.readdir("src")).map((f) => {
    if (f !== "glsl.d.ts") {
      return f.split(".")[1];
    }
  });
  const isTrue = files.every((f) => (f ? f === "glsl" : true));
  t.true(
    isTrue,
    "File with extension other than .glsl found in 'src' directory"
  );
});

ava("Test loadShadersRaw()", async (t) => {
  const actual = await Promise.all(
    files.map(async (f) => (await loadShadersRaw([`src/${f}`]))[0])
  );

  const isTrue = expected.every((f, i) => {
    return f === actual[i];
  });

  t.true(isTrue);
});

ava("Test loadShaders()", async (t) => {
  const basePath = "tests/test.glsl";
  const base = (await fs.readFile(path.resolve(basePath))).toString();

  const actual = await Promise.all(
    files.map(async (f) => {
      const paths = [basePath];
      const chunks = [await loadShadersRaw([`src/${f}`])];
      return (await loadShaders(paths, chunks))[0];
    })
  );

  const isTrue = expected.every((f, i) => {
    return actual[i].includes(f) && actual[i].includes(base);
  });

  t.true(isTrue);
});

ava("Test loadShadersCSM()", async (t) => {
  const basePath = "tests/test.glsl";
  const base = (await fs.readFile(path.resolve(basePath))).toString();

  const actual = await Promise.all(
    files.map(async (f) => {
      const chunks = [await loadShadersRaw([`src/${f}`])];
      const csm = {
        defines: basePath,
        header: basePath,
        main: basePath,
      };

      return await loadShadersCSM(csm, chunks);
    })
  );

  const isTrue = expected.every((f, i) => {
    return actual[i].header.includes(f) && actual[i].main.includes(base);
  });

  t.true(isTrue);
});
