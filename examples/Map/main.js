import { Renderer, Program, Color, Mesh, Triangle, Vec3 } from "https://cdn.skypack.dev/ogl";
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

  const geometry = new Triangle(gl);

  const program = new Program(gl, {
    vertex,
    fragment,
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new Color(0.3, 0.2, 0.5) },
      uResolution: { value: new Vec3(0, 0, 0) },
      uSeed: { value: Math.random() },

      uType: { value: 0 },

      uPersistance: { value: 0.5 },
      uLacunarity: { value: 2.0 },
      uScale: { value: 1.0 },
      uOctaves: { value: 5 },
      uDistance: { value: 0 },
      uInvert: { value: false },
    },
  });

  const mesh = new Mesh(gl, { geometry, program });

  let doesAnimate = {
    value: true,
  };

  let gui_fbmHidden = true;
  let gui_voronoiHidden = true;
  let gui_folder_fmb;
  let gui_folder_voronoi;
  const gui = new dat.gui.GUI();

  gui.add(doesAnimate, "value").name("Move with time?");
  gui.add(program.uniforms.uScale, "value").min(0).max(10).step(0.01).name("Scale");

  gui
    .add(program.uniforms.uType, "value", {
      "Perlin Noise": 0,
      "Simplex Noise": 1,
      "FBM (Perlin)": 2,
      "FBM (Simplex)": 3,
      "Ridge Noise": 4,
      Worley: 5,
      "FBM (Worley)": 6,
    })
    .name("Type")
    .onChange((e) => {
      if (e == 2 || e == 3 || e == 4 || e == 6) {
        if (gui_fbmHidden) {
          gui_folder_fmb.show();
          gui_folder_fmb.open();
          gui_fbmHidden = false;
          gui_folder_voronoi.hide();
          gui_voronoiHidden = true;
        }
      } else if (e == 5) {
        if (gui_voronoiHidden) {
          gui_folder_voronoi.show();
          gui_folder_voronoi.open();
          gui_voronoiHidden = false;
          gui_folder_fmb.hide();
          gui_fbmHidden = true;
        }
      } else {
        gui_folder_fmb.hide();
        gui_fbmHidden = true;
        gui_folder_voronoi.hide();
        gui_voronoiHidden = true;
      }
    });

  gui_folder_fmb = gui.addFolder("FBM");
  gui_folder_fmb.hide();
  gui_folder_fmb.add(program.uniforms.uPersistance, "value").min(0).max(1).step(0.01).name("Smoothness");

  gui_folder_fmb.add(program.uniforms.uLacunarity, "value").min(0).max(4).step(0.01).name("Detail");

  gui_folder_fmb.add(program.uniforms.uOctaves, "value").min(0).max(10).step(1).name("Octaves");

  gui_folder_voronoi = gui.addFolder("Voronoi");
  gui_folder_voronoi.hide();
  gui_folder_voronoi.add(program.uniforms.uDistance, "value").min(0).max(10).step(1).name("Distance");

  gui_folder_voronoi.add(program.uniforms.uInvert, "value").name("Invert");

  requestAnimationFrame(update);
  function update(t) {
    requestAnimationFrame(update);

    if (doesAnimate.value) program.uniforms.uTime.value = t * 0.0001;
    program.uniforms.uResolution.value.set(gl.canvas.width, gl.canvas.height, 0);

    // Don't need a camera if camera uniforms aren't required
    renderer.render({ scene: mesh });
  }
});
