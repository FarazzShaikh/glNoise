
cd dist
yarn link
cd ../

cd ./node_modules/three
yarn link
cd ../../../

for d in ./examples/* ; do
    cd $d
    yarn link gl-noise
    yarn link three
    cd ../../
done