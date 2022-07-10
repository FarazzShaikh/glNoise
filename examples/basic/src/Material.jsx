import { gln } from 'gl-noise'
import { useEffect, useMemo } from 'react'
import { DoubleSide, MeshDepthMaterial, MeshPhysicalMaterial, RGBADepthPacking, ShadowMaterial } from 'three'
import CustomShaderMaterial from 'three-custom-shader-material'

const conditionals = /* glsl */ `
gln_FBMOpts opts = gln_FBMOpts(uSeed, 0.5, 2., 8);

float n;
if(uType == 0.) {
  n = gln_perlin(vUv * uScale, uSeed);
} else if(uType == 1.)  {
  n = gln_simplex(vUv * uScale, uSeed);
} else if(uType == 2.)  {
  gln_CellOpts opts = gln_CellOpts(uSeed, 1.0);
  n = gln_cell1(vUv * uScale, opts);
} else if(uType == 3.)  {
  gln_CellOpts opts = gln_CellOpts(uSeed, 1.0);
  n = gln_cell2(vUv * uScale, opts);
} else if(uType == 4.)  {
  gln_PSRDOpts opts = gln_PSRDOpts(uSeed, vec3(100.), 0.);
  n = gln_psrd(vUv * uScale, opts);
} else if(uType == 10.)  {
  n = gln_perlin_fbm(vUv * uScale, opts);
} else if(uType == 11.)  {
  n = gln_simplex_fbm(vUv * uScale, opts);
} else if(uType == 12.)  {
  n = gln_cell_fbm(vUv * uScale, opts).x;
} else if(uType == 13.)  {
  n = gln_cell_fbm(vUv * uScale, opts).y;
} else if(uType == 14.)  {
  n = gln_psrd_fbm(vUv * uScale, opts);
}
`

export default function Material({ type, scale, seed, threeD, fbm, disp }) {
  const uniforms = useMemo(
    () => ({
      uType: { value: 0 }, //
      uScale: { value: 4 },
      uSeed: { value: Math.random() },
    }),
    []
  )
  useEffect(() => void (uniforms.uType.value = type + (fbm ? 10 : 0)), [type, fbm])
  useEffect(() => void (uniforms.uScale.value = scale), [scale])
  useEffect(() => void (uniforms.uSeed.value = seed), [seed])

  const vertexShader = useMemo(
    () =>
      gln(/* glsl */ `
      varying ${threeD ? 'vec3' : 'vec2'} vUv;

      uniform float uType;
      uniform float uScale;
      uniform float uSeed;

      ${
        disp
          ? /* glsl */ `
          vec3 displace(vec3 point) {
            ${conditionals}

            return point + (normal * n);
          }

          vec3 orthogonal(vec3 v) {
            return normalize(abs(v.x) > abs(v.z) ? vec3(-v.y, v.x, 0.0)
            : vec3(0.0, -v.z, v.y));
          }
          vec3 recalcNormals(vec3 newPos) {
            float offset = 0.001;
            vec3 tangent = orthogonal(normal);
            vec3 bitangent = normalize(cross(normal, tangent));
            vec3 neighbour1 = position + tangent * offset;
            vec3 neighbour2 = position + bitangent * offset;
            vec3 displacedNeighbour1 = displace(neighbour1);
            vec3 displacedNeighbour2 = displace(neighbour2);
            vec3 displacedTangent = displacedNeighbour1 - newPos;
            vec3 displacedBitangent = displacedNeighbour2 - newPos;
            return normalize(cross(displacedTangent, displacedBitangent));
          }
          `
          : ``
      }

      void main() { 

        ${threeD ? 'vUv = position;' : 'vUv = uv;'}

        ${
          disp
            ? /* glsl */ `
            csm_Position = displace(position);
            csm_Normal = recalcNormals(csm_Position);
          `
            : ``
        }
      }
    `),
    [threeD, disp, conditionals]
  )
  const fragmentShader = useMemo(
    () =>
      gln(/* glsl */ `
      varying ${threeD ? 'vec3' : 'vec2'} vUv;
      
      uniform float uType;
      uniform float uScale;
      uniform float uSeed;

      void main() {
        ${conditionals}
        csm_FragColor = vec4(vec3(n), 1.);
    }
  `),
    [threeD, conditionals]
  )

  return (
    <>
      <CustomShaderMaterial
        baseMaterial={MeshPhysicalMaterial}
        side={DoubleSide}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
      <CustomShaderMaterial
        baseMaterial={MeshDepthMaterial}
        uniforms={uniforms}
        vertexShader={vertexShader}
        attach="customDepthMaterial"
        depthPacking={RGBADepthPacking}
      />
    </>
  )
}
