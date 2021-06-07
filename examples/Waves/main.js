import waves from "./waves.js";

import { initScene, render, initHelpers } from "./setup.js";
import cloud from "./cloud.js";
import lights from "./lights.js";
import plane from "./plane.js";

const { scene, renderer } = initScene();

// initHelpers();

lights(scene);

const animate_cloud = cloud(scene);
const displace = waves(scene);
const animate = plane(scene);

render(0, (dt) => {
  displace(dt * 0.00015);
  animate(dt * 0.0005);
  animate_cloud(dt * 0.00005);
});
