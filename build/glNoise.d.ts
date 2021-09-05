declare const Perlin: string;
declare const Simplex: string;
declare const Worley: string;
declare const BlendModes: string;
declare const Common: string;
declare const GerstnerWave: string;
declare const Curl: string;
declare const All: string[];
/**
 * Loads Shaders without appeneding any Shader Chunks.
 * @deprecated
 *
 * @async
 * @param {string[]} shaders Array of paths to shaders.
 * @returns {Promise<string[]>}         Array of shaders corresponding to each path.
 *
 * @example
 * const [vert, frag] = await loadShadersRaw(["vert.glsl", "frag.glsl"]);
 */
declare function loadShadersRaw(shaders: string | string[]): Promise<string | string[]>;
/**
 * Loads shaders with specified Shader Chunks.
 * If chunks not specified, all chunks will be appended.
 * @deprecated
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
declare function loadShaders(paths: string | string[], chunks?: string[][], headers?: string[]): Promise<string | string[]>;
/**
 * Patches shaders with specified Shader Chunks.
 * If chunks not specified, all chunks will be appended.
 *
 * @async
 * @param {string[]} paths      Array of Shaders as strings.
 * @param {string[][]} chunks   Array of chunks to append to each shader
 * @param {string[]} headers    Array of headers to be appended to each shader. Can be used to provide precision;
 * @returns {string[]}          Array of shaders corresponding to each path with respective chunks applied.
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
 * const shaders = [
 *      `
 *         gl_Posiiton = ...
 *      `,
 *         gl_FragColor = ...
 *      `,
 * ];
 * const [vert, frag] = await loadShaders(shaders, chunks, head);
 */
declare function patchShaders(shader: string | string[], chunks?: string[][], headers?: string[]): string | string[];
/**
 * Loads shaders with Shader Chunks for use with [THREE-CustomShaderMaterial.]{@link https://github.com/FarazzShaikh/THREE-CustomShaderMaterial}
 * If chunks not specified, all chunks will be appended.
 * @deprecated
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
declare function loadShadersCSM(shaders: {
    defines: string;
    header: string;
    main: string;
}, chunks?: string[]): Promise<{
    defines: string;
    header: string;
    main: string;
}>;
/**
 * Patches shaders with Shader Chunks for use with [THREE-CustomShaderMaterial.]{@link https://github.com/FarazzShaikh/THREE-CustomShaderMaterial}
 * If chunks not specified, all chunks will be appended.
 *
 * @async
 * @param {Object} shaders              Paths of shaders.
 * * @param {string} shaders.defines        Path of definitions shader.
 * * @param {string} shaders.header         Path of header shader.
 * * @param {string} shaders.main           Path of main shader.
 * @param {string[]} chunks             Array of chunks to append into the Header Section.
 * @returns {Object}                    CSM friendly shader.
 *
 * @example
 * const chunks =  [Perlin, Simplex];
 * const shaders = [
 *      defines: "...",
 *      header: "...",
 *      main: "...",
 * ];
 * const {defines, header, main} = await loadShadersCSM(shaders, chunks);
 */
declare function patchShadersCSM(shaders: {
    defines: string;
    header: string;
    main: string;
}, chunks?: string[]): {
    defines: string;
    header: string;
    main: string;
};

export { All, BlendModes, Common, Curl, GerstnerWave, Perlin, Simplex, Worley, loadShaders, loadShadersCSM, loadShadersRaw, patchShaders, patchShadersCSM };
