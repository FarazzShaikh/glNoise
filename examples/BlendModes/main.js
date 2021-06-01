import { Renderer, Program, Mesh, Triangle, Vec2, TextureLoader } from "https://cdn.skypack.dev/ogl";

import * as dat from "../lib/dat.gui.module.js";
import { loadShaders, Common } from "../../build/glNoise.m.js";

const paths = ["./shader_f.glsl", "./shader_v.glsl"];

const head = `
precision highp float;
${Common}
`;

loadShaders(paths, null, [head, head]).then(([fragment, vertex]) => {
  const renderer = new Renderer();
  const gl = renderer.gl;
  document.body.appendChild(gl.canvas);
  gl.clearColor(1, 1, 1, 1);

  function resize() {
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
  window.addEventListener("resize", resize, false);
  resize();

  const rect = TextureLoader.load(gl, {
    src: {
      png: "./textures/rect.png",
    },
  });

  const logo = TextureLoader.load(gl, {
    src: {
      png: "./textures/logo.png",
    },
  });

  const geometry = new Triangle(gl);

  const program = new Program(gl, {
    vertex,
    fragment,
    uniforms: {
      uType: { value: 2 },
      uRect: { value: rect },
      uLogo: { value: logo },
      uResolution: { value: new Vec2() },
    },
  });

  const mesh = new Mesh(gl, { geometry, program });

  const gui = new dat.gui.GUI();
  gui.add(program.uniforms.uType, "value", {
    Copy: 0,
    Add: 1,
    Subtract: 2,
    Multiply: 3,
    AddSub: 4,
    Lighten: 5,
    Darken: 6,
    Divide: 7,
    Overlay: 8,
    Screen: 9,
    SoftLight: 10,
  });

  requestAnimationFrame(update);
  function update(t) {
    requestAnimationFrame(update);

    program.uniforms.uResolution.value.set(gl.canvas.width, gl.canvas.height);

    // Don't need a camera if camera uniforms aren't required
    renderer.render({ scene: mesh });
  }
});
