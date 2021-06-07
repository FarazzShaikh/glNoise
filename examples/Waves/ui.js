import * as THREE from "../lib/three.module.js";
import ThreeMeshUI from "../lib/MeshUI/three-mesh-ui.js";

export default function ui(scene) {
  const container = new ThreeMeshUI.Block({
    width: 1.2,
    height: 0.7,
    padding: 0.2,
    fontFamily: "./Assets/Roboto-msdf.json",
    fontTexture: "./Assets/Roboto-msdf.png",
  });

  //

  const text = new ThreeMeshUI.Block({
    content: "Some text to be displayed",
    fontSize: 0.15,
  });

  container.add(text);

  // scene is a THREE.Scene (see three.js)
  //   scene.add(container);

  // This is typically done in the loop :
  return {
    update: ThreeMeshUI.update,
    container: container,
  };
}
