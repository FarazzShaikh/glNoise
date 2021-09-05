# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Version 1.6.1

### BREAKING

- Patch functions are no longer async.

## Version 1.6.0

### New

- Added patch functions that take in shaders as strings directly. 
  - These functions do not load shaders from file.

### NOTE

- **Loader functions will be depricated in a future release**. Instead getting their own package.
  - These include:
    - `loadShaders`
    - `loadShadersRaw`
    - `loadShadersCSM`
  - This is to remove [`CSM`](https://github.com/FarazzShaikh/THREE-CustomShaderMaterial)'s dependance on `gl-noise` to easy load shaders.


## Version 1.5.1

### Changed
- Added TS types to NPM module

## Version 1.5.0

### Changed

- Remove UMD modules in favor of ES Modules
- Build tools 

### Fix

- Patched more bugs with newlines 
- Redirect examples to [FarazzShaikh/Experiemnts](https://github.com/FarazzShaikh/experiments)

## Version 1.4.2

### Fix

- Patched bug with newlines 
  
## Version 1.4.1

### Fix

- Patched bug in `glNoise.m.js`

## Version 1.4.0

### New

- [Curl Noise](https://farazzshaikh.github.io/glNoise/examples/index.html?src=Curl/index.html)
- Introduced dependency system
  - This will allow for more complex, compound noise functions.

## Version 1.3.1

### Breaking

- Patched bugs

## Version 1.3.0

### Breaking

- `build/glNoise.m.js` now stubs out NodeJS specific imports. Use `build/glNoise.m.node.js` instead.

## Version 1.2.0

### Breaking

- Renamed `gln_tVoronoiOpts -> gln_tVoronoiOpts`
- Moved `gln_tVoronoiOpts` from the `Common` to the `Worley` chunk. 

### Changed

- Added Gerstner Waves

## Version 1.1.0

### Breaking

- Renamed `gln_voronoi -> gln_worley`
- Changed implementation of `loadShadersRaw()`. Now you must specify precision if your WebGL library does not already.

### Changed

- Added 3D versions of Perlin, Simplex, and FBM functions.
- Added Photoshop-like blend modes.
- Added examples to demonstrate 3D noise and blend modes.
- Added Worley Noise based FBM
- Changed implementation of Worley Noise
- Updated Readme

## Version 1.0.4

### Changed

- Fixed bug related to a typo in `package.json`
- Fixed bug with `fs/promises` not being found in React.

## Version 1.0.0

### Chnaged

- Initial Release! 🎉
