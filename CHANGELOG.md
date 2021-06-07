# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
