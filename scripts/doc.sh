#!/usr/bin/env bash

set -e

DISCS=(
"Blend Modes provider. All discriptions from <a href=\"https://docs.substance3d.com/sddoc/blending-modes-description-132120605.html\">Substance Desinger - Blending modes description.</a>"
"Utility functions required by gln other funcitons."
"Perlin Noise provider."
"Simplex Noise provider."
"Voronoi Noise provider."
)


echo "" > index.tmp.ts

i=0
for FILEPATH in src/*.glsl; do
    BASENAME="${FILEPATH##*/}"
    FILENAME="${BASENAME%.*}"

DISC=${DISCS[$i]}

_HEAD=$(cat << EOF
/**
* $DISC
@module $FILENAME
*/
EOF
)

echo "$_HEAD" >> index.tmp.ts

cat $FILEPATH | awk ' /\/\*/ {aux=1}; {if(aux) print $0}; /\*\// {aux=0}' >> index.tmp.ts

((i=i+1))
done

mkdir -p docs

cp -R Assets docs/Assets
cp -R examples docs/examples
cp -R build docs/build

jsdoc --configure jsdoc.json --verbose
chmod +x scripts/patch.sh
scripts/patch.sh docs Assets/favicon.ico

rm -rf index.tmp.ts
