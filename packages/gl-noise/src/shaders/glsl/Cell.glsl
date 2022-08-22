
// Cellular noise ("Worley noise") 2D and 3D in GLSL.
//
// Author:  Stefan Gustavson.
// Version: 2021-06-30
//
// Copyright (c) Stefan Gustavson 2011-04-19. All rights reserved.
// This code is released under the conditions of the MIT license.
// See LICENSE file for details.
// https://github.com/stegu/webgl-noise

#define GLN_CELL_K 0.142857142857 // 1/7
#define GLN_CELL_Ko 0.428571428571 // 3/7

#define GLN_CELL_K2 0.020408163265306 // 1/(7*7)
#define GLN_CELL_Kz 0.166666666667 // 1/6
#define GLN_CELL_Kzo 0.416666666667 // 1/2-1/6*2

struct gln_CellOpts {
  float seed;
  float jitter;
};

// Cell noise 2D
vec2 gln_cell(vec2 P, gln_CellOpts opts) {
	P += (_gln_permute(opts.seed * 0.01) + _gln_permute(opts.seed * 0.1)) * 10.;
	float jitter  = opts.jitter;

	vec2 Pi = _gln_mod289(floor(P));
 	vec2 Pf = fract(P);
	vec3 oi = vec3(-1.0, 0.0, 1.0);
	vec3 of = vec3(-0.5, 0.5, 1.5);
	vec3 px = _gln_permute(Pi.x + oi);
	vec3 p = _gln_permute(px.x + Pi.y + oi); // p11, p12, p13
	vec3 ox = fract(p*GLN_CELL_K) - GLN_CELL_Ko;
	vec3 oy = _gln_mod7(floor(p*GLN_CELL_K))*GLN_CELL_K - GLN_CELL_Ko;
	vec3 dx = Pf.x + 0.5 + jitter*ox;
	vec3 dy = Pf.y - of + jitter*oy;
	vec3 d1 = dx * dx + dy * dy; // d11, d12 and d13, squared
	p = _gln_permute(px.y + Pi.y + oi); // p21, p22, p23
	ox = fract(p*GLN_CELL_K) - GLN_CELL_Ko;
	oy = _gln_mod7(floor(p*GLN_CELL_K))*GLN_CELL_K - GLN_CELL_Ko;
	dx = Pf.x - 0.5 + jitter*ox;
	dy = Pf.y - of + jitter*oy;
	vec3 d2 = dx * dx + dy * dy; // d21, d22 and d23, squared
	p = _gln_permute(px.z + Pi.y + oi); // p31, p32, p33
	ox = fract(p*GLN_CELL_K) - GLN_CELL_Ko;
	oy = _gln_mod7(floor(p*GLN_CELL_K))*GLN_CELL_K - GLN_CELL_Ko;
	dx = Pf.x - 1.5 + jitter*ox;
	dy = Pf.y - of + jitter*oy;
	vec3 d3 = dx * dx + dy * dy; // d31, d32 and d33, squared
	// Sort out the two smallest distances (F1, F2)
	vec3 d1a = min(d1, d2);
	d2 = max(d1, d2); // Swap to keep candidates for F2
	d2 = min(d2, d3); // neither F1 nor F2 are now in d3
	d1 = min(d1a, d2); // F1 is now in d1
	d2 = max(d1a, d2); // Swap to keep candidates for F2
	d1.xy = (d1.x < d1.y) ? d1.xy : d1.yx; // Swap if smaller
	d1.xz = (d1.x < d1.z) ? d1.xz : d1.zx; // F1 is in d1.x
	d1.yz = min(d1.yz, d2.yz); // F2 is now not in d2.yz
	d1.y = min(d1.y, d1.z); // nor in  d1.z
	d1.y = min(d1.y, d2.x); // F2 is in d1.y, we're done.
	return sqrt(d1.xy);
}

vec2 gln_cell(vec2 P) { 
	gln_CellOpts opts = gln_CellOpts(0.0, 1.0);
	return gln_cell(P, opts); 
}


float gln_cell1(vec2 P, gln_CellOpts opts) {
	return gln_cell(P, opts).x;
}

float gln_cell1(vec2 P) {
	gln_CellOpts opts = gln_CellOpts(0.0, 1.0);
	return gln_cell1(P, opts);
}

float gln_cell2(vec2 P, gln_CellOpts opts) {
	return gln_cell(P, opts).y;
}

float gln_cell2(vec2 P) {
	gln_CellOpts opts = gln_CellOpts(0.0, 1.0);
	return gln_cell2(P, opts);
}

// Cell noise 3D
// Note from author:
//  Cellular noise, returning F1 and F2 in a vec2.
//  3x3x3 search region for good F2 everywhere, but a lot
//  slower than the 2x2x2 version.
//  The code below is a bit scary even to its author,
//  but it has at least half decent performance on a
//  modern GPU. In any case, it beats any software
//  implementation of Worley noise hands down.


vec2 gln_cell(vec3 P, gln_CellOpts opts) {
	P += (_gln_permute(opts.seed * 0.01) + _gln_permute(opts.seed * 0.1)) * 10.;
	float jitter = opts.jitter;

	vec3 Pi = _gln_mod289(floor(P));
 	vec3 Pf = fract(P) - 0.5;

	vec3 Pfx = Pf.x + vec3(1.0, 0.0, -1.0);
	vec3 Pfy = Pf.y + vec3(1.0, 0.0, -1.0);
	vec3 Pfz = Pf.z + vec3(1.0, 0.0, -1.0);

	vec3 p = _gln_permute(Pi.x + vec3(-1.0, 0.0, 1.0));
	vec3 p1 = _gln_permute(p + Pi.y - 1.0);
	vec3 p2 = _gln_permute(p + Pi.y);
	vec3 p3 = _gln_permute(p + Pi.y + 1.0);

	vec3 p11 = _gln_permute(p1 + Pi.z - 1.0);
	vec3 p12 = _gln_permute(p1 + Pi.z);
	vec3 p13 = _gln_permute(p1 + Pi.z + 1.0);

	vec3 p21 = _gln_permute(p2 + Pi.z - 1.0);
	vec3 p22 = _gln_permute(p2 + Pi.z);
	vec3 p23 = _gln_permute(p2 + Pi.z + 1.0);

	vec3 p31 = _gln_permute(p3 + Pi.z - 1.0);
	vec3 p32 = _gln_permute(p3 + Pi.z);
	vec3 p33 = _gln_permute(p3 + Pi.z + 1.0);

	vec3 ox11 = fract(p11*GLN_CELL_K) - GLN_CELL_Ko;
	vec3 oy11 = _gln_mod7(floor(p11*GLN_CELL_K))*GLN_CELL_K - GLN_CELL_Ko;
	vec3 oz11 = floor(p11*GLN_CELL_K2)*GLN_CELL_Kz - GLN_CELL_Kzo; // p11 < 289 guaranteed

	vec3 ox12 = fract(p12*GLN_CELL_K) - GLN_CELL_Ko;
	vec3 oy12 = _gln_mod7(floor(p12*GLN_CELL_K))*GLN_CELL_K - GLN_CELL_Ko;
	vec3 oz12 = floor(p12*GLN_CELL_K2)*GLN_CELL_Kz - GLN_CELL_Kzo;

	vec3 ox13 = fract(p13*GLN_CELL_K) - GLN_CELL_Ko;
	vec3 oy13 = _gln_mod7(floor(p13*GLN_CELL_K))*GLN_CELL_K - GLN_CELL_Ko;
	vec3 oz13 = floor(p13*GLN_CELL_K2)*GLN_CELL_Kz - GLN_CELL_Kzo;

	vec3 ox21 = fract(p21*GLN_CELL_K) - GLN_CELL_Ko;
	vec3 oy21 = _gln_mod7(floor(p21*GLN_CELL_K))*GLN_CELL_K - GLN_CELL_Ko;
	vec3 oz21 = floor(p21*GLN_CELL_K2)*GLN_CELL_Kz - GLN_CELL_Kzo;

	vec3 ox22 = fract(p22*GLN_CELL_K) - GLN_CELL_Ko;
	vec3 oy22 = _gln_mod7(floor(p22*GLN_CELL_K))*GLN_CELL_K - GLN_CELL_Ko;
	vec3 oz22 = floor(p22*GLN_CELL_K2)*GLN_CELL_Kz - GLN_CELL_Kzo;

	vec3 ox23 = fract(p23*GLN_CELL_K) - GLN_CELL_Ko;
	vec3 oy23 = _gln_mod7(floor(p23*GLN_CELL_K))*GLN_CELL_K - GLN_CELL_Ko;
	vec3 oz23 = floor(p23*GLN_CELL_K2)*GLN_CELL_Kz - GLN_CELL_Kzo;

	vec3 ox31 = fract(p31*GLN_CELL_K) - GLN_CELL_Ko;
	vec3 oy31 = _gln_mod7(floor(p31*GLN_CELL_K))*GLN_CELL_K - GLN_CELL_Ko;
	vec3 oz31 = floor(p31*GLN_CELL_K2)*GLN_CELL_Kz - GLN_CELL_Kzo;

	vec3 ox32 = fract(p32*GLN_CELL_K) - GLN_CELL_Ko;
	vec3 oy32 = _gln_mod7(floor(p32*GLN_CELL_K))*GLN_CELL_K - GLN_CELL_Ko;
	vec3 oz32 = floor(p32*GLN_CELL_K2)*GLN_CELL_Kz - GLN_CELL_Kzo;

	vec3 ox33 = fract(p33*GLN_CELL_K) - GLN_CELL_Ko;
	vec3 oy33 = _gln_mod7(floor(p33*GLN_CELL_K))*GLN_CELL_K - GLN_CELL_Ko;
	vec3 oz33 = floor(p33*GLN_CELL_K2)*GLN_CELL_Kz - GLN_CELL_Kzo;

	vec3 dx11 = Pfx + jitter*ox11;
	vec3 dy11 = Pfy.x + jitter*oy11;
	vec3 dz11 = Pfz.x + jitter*oz11;

	vec3 dx12 = Pfx + jitter*ox12;
	vec3 dy12 = Pfy.x + jitter*oy12;
	vec3 dz12 = Pfz.y + jitter*oz12;

	vec3 dx13 = Pfx + jitter*ox13;
	vec3 dy13 = Pfy.x + jitter*oy13;
	vec3 dz13 = Pfz.z + jitter*oz13;

	vec3 dx21 = Pfx + jitter*ox21;
	vec3 dy21 = Pfy.y + jitter*oy21;
	vec3 dz21 = Pfz.x + jitter*oz21;

	vec3 dx22 = Pfx + jitter*ox22;
	vec3 dy22 = Pfy.y + jitter*oy22;
	vec3 dz22 = Pfz.y + jitter*oz22;

	vec3 dx23 = Pfx + jitter*ox23;
	vec3 dy23 = Pfy.y + jitter*oy23;
	vec3 dz23 = Pfz.z + jitter*oz23;

	vec3 dx31 = Pfx + jitter*ox31;
	vec3 dy31 = Pfy.z + jitter*oy31;
	vec3 dz31 = Pfz.x + jitter*oz31;

	vec3 dx32 = Pfx + jitter*ox32;
	vec3 dy32 = Pfy.z + jitter*oy32;
	vec3 dz32 = Pfz.y + jitter*oz32;

	vec3 dx33 = Pfx + jitter*ox33;
	vec3 dy33 = Pfy.z + jitter*oy33;
	vec3 dz33 = Pfz.z + jitter*oz33;

	vec3 d11 = dx11 * dx11 + dy11 * dy11 + dz11 * dz11;
	vec3 d12 = dx12 * dx12 + dy12 * dy12 + dz12 * dz12;
	vec3 d13 = dx13 * dx13 + dy13 * dy13 + dz13 * dz13;
	vec3 d21 = dx21 * dx21 + dy21 * dy21 + dz21 * dz21;
	vec3 d22 = dx22 * dx22 + dy22 * dy22 + dz22 * dz22;
	vec3 d23 = dx23 * dx23 + dy23 * dy23 + dz23 * dz23;
	vec3 d31 = dx31 * dx31 + dy31 * dy31 + dz31 * dz31;
	vec3 d32 = dx32 * dx32 + dy32 * dy32 + dz32 * dz32;
	vec3 d33 = dx33 * dx33 + dy33 * dy33 + dz33 * dz33;

	// Sort out the two smallest distances (F1, F2)
#if 0
	// Cheat and sort out only F1
	vec3 d1 = min(min(d11,d12), d13);
	vec3 d2 = min(min(d21,d22), d23);
	vec3 d3 = min(min(d31,d32), d33);
	vec3 d = min(min(d1,d2), d3);
	d.x = min(min(d.x,d.y),d.z);
	return vec2(sqrt(d.x)); // F1 duplicated, no F2 computed
#else
	// Do it right and sort out both F1 and F2
	vec3 d1a = min(d11, d12);
	d12 = max(d11, d12);
	d11 = min(d1a, d13); // Smallest now not in d12 or d13
	d13 = max(d1a, d13);
	d12 = min(d12, d13); // 2nd smallest now not in d13
	vec3 d2a = min(d21, d22);
	d22 = max(d21, d22);
	d21 = min(d2a, d23); // Smallest now not in d22 or d23
	d23 = max(d2a, d23);
	d22 = min(d22, d23); // 2nd smallest now not in d23
	vec3 d3a = min(d31, d32);
	d32 = max(d31, d32);
	d31 = min(d3a, d33); // Smallest now not in d32 or d33
	d33 = max(d3a, d33);
	d32 = min(d32, d33); // 2nd smallest now not in d33
	vec3 da = min(d11, d21);
	d21 = max(d11, d21);
	d11 = min(da, d31); // Smallest now in d11
	d31 = max(da, d31); // 2nd smallest now not in d31
	d11.xy = (d11.x < d11.y) ? d11.xy : d11.yx;
	d11.xz = (d11.x < d11.z) ? d11.xz : d11.zx; // d11.x now smallest
	d12 = min(d12, d21); // 2nd smallest now not in d21
	d12 = min(d12, d22); // nor in d22
	d12 = min(d12, d31); // nor in d31
	d12 = min(d12, d32); // nor in d32
	d11.yz = min(d11.yz,d12.xy); // nor in d12.yz
	d11.y = min(d11.y,d12.z); // Only two more to go
	d11.y = min(d11.y,d11.z); // Done! (Phew!)
	return sqrt(d11.xy); // F1, F2
#endif
}

vec2 gln_cell(vec3 P) { 
	gln_CellOpts opts = gln_CellOpts(0.0, 1.0);
	return gln_cell(P, opts); 
}

float gln_cell1(vec3 P, gln_CellOpts opts) {
	return gln_cell(P, opts).x;
}

float gln_cell1(vec3 P) {
	gln_CellOpts opts = gln_CellOpts(0.0, 1.0);
	return gln_cell1(P, opts);
}

float gln_cell2(vec3 P, gln_CellOpts opts) {
	return gln_cell(P, opts).y;
}

float gln_cell2(vec3 P) {
	gln_CellOpts opts = gln_CellOpts(0.0, 1.0);
	return gln_cell2(P, opts);
}