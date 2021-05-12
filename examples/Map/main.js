import {
  Renderer,
  Program,
  Color,
  Mesh,
  Triangle,
  Vec3,
} from "https://cdn.skypack.dev/ogl";
import {
  loadShaders,
  Perlin,
  Utils,
  Noise,
  Simplex,
  Voronoi,
} from "../../build/glNoise.m.js";

const chunks = {
  frag: [Perlin, Utils, Noise, Simplex, Voronoi],
  vert: [Perlin, Utils, Noise, Simplex, Voronoi],
};

loadShaders("./shader_f.glsl", "./shader_v.glsl", chunks).then(
  ([fragment, vertex]) => {
    const renderer = new Renderer();
    const gl = renderer.gl;
    document.body.appendChild(gl.canvas);
    gl.clearColor(1, 1, 1, 1);

    function resize() {
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener("resize", resize, false);
    resize();

    const geometry = new Triangle(gl);

    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new Color(0.3, 0.2, 0.5) },
        uResolution: { value: new Vec3(0, 0, 0) },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });

    requestAnimationFrame(update);
    function update(t) {
      requestAnimationFrame(update);

      program.uniforms.uTime.value = t * 0.001;
      program.uniforms.uResolution.value.set(
        gl.canvas.width,
        gl.canvas.height,
        0
      );

      // Don't need a camera if camera uniforms aren't required
      renderer.render({ scene: mesh });
    }
  }
);
