#!/usr/bin/env bash

cat build/glNoise.m.node.js > temp

echo "" > build/glNoise.m.js
sed -n '1,/\/\/~START~/p;/\/\/~END~/,$p' temp >> build/glNoise.m.js
cat build/glNoise.m.js > temp
echo "" > build/glNoise.m.js
sed 's/nodeFetch/window.fetch/g' temp >> build/glNoise.m.js
rm -rf temp