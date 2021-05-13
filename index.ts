import _Perlin from "./src/Perlin.glsl";
import _Simplex from "./src/Simplex.glsl";
import _Voronoi from "./src/Voronoi.glsl";
import _Common from "./src/Common.glsl";

const _Head = "precision highp float;\n" + _Common + "\n";

export const Perlin: string = _Perlin;
export const Simplex: string = _Simplex;
export const Voronoi: string = _Voronoi;
export const Head: string = _Head;

interface Chunks {
  vert: string[];
  frag: string[];
}

interface CSMShader {
  defines: string;
  header: string;
  main: string;
}

export async function loadShadersRaw(...shaders: string[]) {
  return Promise.all(
    shaders.map(async (s) => {
      return (await fetch(s)).text();
    })
  );
}

export async function loadShaders(frag: string, vert: string, chunks: Chunks) {
  const shaders: string[] = [frag, vert];

  let [_frag, _vert] = await Promise.all(
    shaders.map(async (s) => {
      if (s) return (await fetch(s)).text();
      else return undefined;
    })
  );

  if (chunks) {
    if (chunks.frag) _frag = _Head + chunks.frag.join("\n") + "\n" + _frag;
    if (chunks.vert) _vert = _Head + chunks.vert.join("\n") + "\n" + _vert;
  }

  let obj = [];
  if (frag) {
    obj.push(_frag);
  }

  if (vert) {
    obj.push(_vert);
  }

  return obj;
}

export async function loadShadersCSM(shaders: CSMShader, chunks: Chunks) {
  let _defines: string = "",
    _header: string = "",
    _main: string = "";

  if (shaders.defines) _defines = await (await fetch(shaders.defines)).text();
  if (shaders.header) _header = await (await fetch(shaders.header)).text();
  if (shaders.main) _main = await (await fetch(shaders.main)).text();

  return {
    defines: _Head + _defines,
    header: chunks.frag.join("\n") + "\n" + _header,
    main: _main,
  };
}
