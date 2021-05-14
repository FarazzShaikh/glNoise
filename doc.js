import ExtractDocumentationComments from "extract-documentation-comments";
import fs, { readFileSync } from "fs";

function doc(path, disc) {
  const doc =
    ExtractDocumentationComments.getDocumentationStringFromFilePathSync(
      `src/${path}.glsl`
    ).split("\n\n");

  const head = `
/**
* ${disc}
@module ${path}
*/
`;

  let res = head;

  doc.forEach((d, i) => {
    res += `
/**
${d}
*/
Math.random();`;
  });

  return res;
}

const r = [
  doc("Common", "Utility functions required by gln other funcitons."),
  doc("Perlin", "Perlin Noise provider."),
  doc("Simplex", "Simplex Noise provider."),
  doc("Voronoi", "Voronoi Noise provider."),
];

const index = readFileSync("index.ts");

fs.writeFileSync("index.temp.ts", index + "\n" + r.join("\n"));
