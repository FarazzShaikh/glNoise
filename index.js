import _Head from "./src/Head.glsl";
import _Perlin2D from "./src/Perlin2D.glsl";
import _Utils from "./src/Utils.glsl";

export const Perlin2D = _Perlin2D;
export const Utils = _Utils;

export async function loadShaders(frag, vert, chunks) {
  const shaders = [frag, vert];
  let [_frag, _vert] = await Promise.all(
    shaders.map(async (s) => {
      return (await fetch(s)).text();
    })
  );

  if (chunks) {
    if (chunks.frag) _frag = _Head + chunks.frag.join("\n") + _frag;
    if (chunks.vert) _vert = _Head + chunks.vert.join("\n") + _vert;
  }

  return [_frag, _vert];
}
