mkdir -p docs &&\
node doc.js &&\

cp -R Assets docs/Assets &&\
cp -R examples docs/examples &&\
cp -R build docs/build &&\

jsdoc --configure jsdoc.json --verbose &&\
chmod +x scripts/patch.sh &&\
scripts/patch.sh docs Assets/favicon.ico