import _Head from "./src/Head.glsl";
import _Perlin from "./src/Perlin.glsl";
import _Simplex from "./src/Simplex.glsl";
import _Voronoi from "./src/Voronoi.glsl";
import _Noise from "./src/Noise.glsl";
import _Utils from "./src/Utils.glsl";

export const Perlin: string = _Perlin;
export const Simplex: string = _Simplex;
export const Voronoi: string = _Voronoi;
export const Noise: string = _Noise;
export const Utils: string = _Utils;

interface Chunks {
  vert: string[];
  frag: string[];
}

export async function loadShaders(
  frag: string,
  vert: string,
  chunks: Chunks,
  splitUp?: boolean
) {
  const shaders: string[] = [frag, vert];

  let [_frag, _vert] = await Promise.all(
    shaders.map(async (s) => {
      return (await fetch(s)).text();
    })
  );

  if (splitUp) {
    return [
      {
        defines: _Head,
        header: chunks.frag.join("\n"),
        main: _frag,
      },
      {
        defines: _Head,
        header: chunks.vert.join("\n") + _vert.split("// MAIN")[0],
        main: _vert.split("// MAIN")[1],
      },
    ];
  }

  if (chunks) {
    if (chunks.frag) _frag = _Head + chunks.frag.join("\n") + _frag;
    if (chunks.vert) _vert = _Head + chunks.vert.join("\n") + _vert;
  }

  return [_frag, _vert];
}
