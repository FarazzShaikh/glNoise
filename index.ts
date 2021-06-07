import _Perlin from "./src/Perlin.glsl";
import _Simplex from "./src/Simplex.glsl";
import _Worley from "./src/Worley.glsl";
import _BlendModes from "./src/BlendModes.glsl";
import _Common from "./src/Common.glsl";
import _GerstnerWave from "./src/GerstnerWave.glsl";

export const Perlin: string = _Perlin;
export const Simplex: string = _Simplex;
export const Worley: string = _Worley;
export const BlendModes: string = _BlendModes;
export const Common: string = _Common;
export const GerstnerWave: string = _GerstnerWave;

const _all = [Perlin, Simplex, Worley, BlendModes, GerstnerWave];

const isNode = typeof process !== "undefined" && process.versions != null && process.versions.node != null;

async function nodeFetch(s: string) {
  // @ts-ignore
  const fs = await import("fs");
  // @ts-ignore
  const path = (await import("path")).default;

  const f = fs.readFileSync(path.resolve(s));

  return {
    text: async function () {
      return f.toString();
    },
  };
}

/**
 * Loads Shaders without appeneding any Shader Chunks.
 *
 * @async
 * @param {string[]} shaders Array of paths to shaders.
 * @returns {Promise<string>}         Array of shaders corresponding to each path.
 *
 * @example
 * const [vert, frag] = await loadShadersRaw(["vert.glsl", "frag.glsl"]);
 */
export async function loadShadersRaw(shaders: string[]) {
  const _fetch = isNode ? nodeFetch : window.fetch;

  return Promise.all(
    shaders.map(async (s) => {
      return (await _fetch(s)).text();
    })
  );
}

/**
 * Loads shaders with specified Shader Chunks.
 * If chunks not specified, all chunks will be appended.
 *
 * @async
 * @param {string[]} paths      Array of Paths to shaders.
 * @param {string[][]} chunks   Array of chunks to append to each shader
 * @param {string[]} headers    Array of headers to be appended to each shader. Can be used to provide precision;
 * @returns {Promise<string[]>}          Array of shaders corresponding to each path with respective chunks applied.
 *
 * @example
 * const head = `
 * precision highp float;
 * ${Common}
 * `;
 *
 * const chunks = [
 *      [Perlin, Simplex],
 *      []
 * ];
 * const paths = [
 *      "vert.glsl",
 *      "frag.glsl",
 * ];
 * const [vert, frag] = await loadShaders(paths, chunks, head);
 */
export async function loadShaders(paths: string[], chunks?: string[][], headers?: string[]) {
  if (!paths || paths.length <= 0) throw new Error("glNoise::loadShaders requires atleast one path.");
  if (!headers) headers = new Array(paths.length).fill(Common);

  let shaders: string[] = await loadShadersRaw(paths);

  if (chunks) {
    shaders = shaders.map((s, i) => {
      let c: string[];
      if (chunks[i]) c = chunks[i];
      else c = _all;

      let h: string;
      if (headers[i]) h = headers[i];
      else h = Common;

      return h + c.join("\n") + "\n" + s;
    });
  } else {
    shaders = shaders.map((s, i) => {
      let h: string;
      if (headers[i]) h = headers[i];
      else h = Common;
      return h + _all.join("\n") + "\n" + s;
    });
  }

  return shaders;
}

/**
 * Loads shaders with Shader Chunks for use with [THREE-CustomShaderMaterial.]{@link https://github.com/FarazzShaikh/THREE-CustomShaderMaterial}
 * If chunks not specified, all chunks will be appended.
 *
 * @async
 * @param {Object} shaders              Paths of shaders.
 * * @param {string} shaders.defines        Path of definitions shader.
 * * @param {string} shaders.header         Path of header shader.
 * * @param {string} shaders.main           Path of main shader.
 * @param {string[]} chunks             Array of chunks to append into the Header Section.
 * @returns {Promise<Object>}                    CSM friendly shader.
 *
 * @example
 * const chunks =  [Perlin, Simplex];
 * const paths = [
 *      defines: "defines.glsl",
 *      header: "header.glsl",
 *      main: "main.glsl",
 * ];
 * const {defines, header, main} = await loadShadersCSM(paths, chunks);
 */
export async function loadShadersCSM(
  shaders: {
    defines: string;
    header: string;
    main: string;
  },
  chunks?: string[]
) {
  const _fetch = isNode ? nodeFetch : window.fetch;
  let _defines: string = "",
    _header: string = "",
    _main: string = "";

  if (shaders.defines) _defines = await (await _fetch(shaders.defines)).text();
  if (shaders.header) _header = await (await _fetch(shaders.header)).text();
  if (shaders.main) _main = await (await _fetch(shaders.main)).text();

  if (!chunks)
    return {
      defines: _defines + Common,
      header: _all.join("\n") + "\n" + _header,
      main: _main,
    };

  return {
    defines: _defines + Common,
    header: chunks.join("\n") + "\n" + _header,
    main: _main,
  };
}
