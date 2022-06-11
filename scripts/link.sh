rm -rf ./node_modeules ./yarn.lock
yarn
yarn build

cd dist
yarn link
cd ../

cd ./node_modules/three
yarn link
cd ../../

for d in ./examples/* ; do
    cd $d
    rm -rf ./node_modeules ./yarn.lock
    yarn

    yarn link gl-noise
    yarn link three
    cd ../../
done