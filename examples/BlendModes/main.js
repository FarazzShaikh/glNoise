import {
  Renderer,
  Program,
  Color,
  Mesh,
  Triangle,
  Plane,
  Vec3,
  TextureLoader,
} from "https://cdn.skypack.dev/ogl";
import { loadShaders } from "../../build/glNoise.m.js";

const paths = ["./shader_f.glsl", "./shader_v.glsl"];

loadShaders(paths).then(([fragment, vertex]) => {
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
      uType: { value: Number(localStorage.getItem("type")) || 0 },
      uRect: { value: rect },
      uLogo: { value: logo },
    },
  });

  const mesh = new Mesh(gl, { geometry, program });

  window.addEventListener(
    "storage",
    function (e) {
      program.uniforms.uType.value = Number(this.localStorage.getItem("type"));
    },
    false
  );

  requestAnimationFrame(update);
  function update(t) {
    requestAnimationFrame(update);

    // Don't need a camera if camera uniforms aren't required
    renderer.render({ scene: mesh });
  }
});
