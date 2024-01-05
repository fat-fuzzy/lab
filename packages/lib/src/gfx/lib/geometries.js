import matrices from './matrices'
import utils from './utils'

const {MATRIX_3D} = matrices

/* prettier-ignore */
const DEFAULT_GEOMETRY_COORDS = [
	// left column
	0, 0,
	30, 0,
	0, 150,
	0, 150,
	30, 0,
	30, 150,

	// top rung
	30, 0,
	100, 0,
	30, 30,
	30, 30,
	100, 0,
	100, 30,

	// middle rung
	30, 60,
	67, 60,
	30, 90,
	30, 90,
	67, 60,
	67, 90,
]

/* prettier-ignore */
const DEFAULT_3D_GEOMETRY_COORDS = [
	// left column front
	0,   0,  0,
	0, 150,  0,
	30,   0,  0,
	0, 150,  0,
	30, 150,  0,
	30,   0,  0,

	// top rung front
	30,   0,  0,
	30,  30,  0,
	100,   0,  0,
	30,  30,  0,
	100,  30,  0,
	100,   0,  0,

	// middle rung front
	30,  60,  0,
	30,  90,  0,
	67,  60,  0,
	30,  90,  0,
	67,  90,  0,
	67,  60,  0,

	// left column back
		0,   0,  30,
	 30,   0,  30,
		0, 150,  30,
		0, 150,  30,
	 30,   0,  30,
	 30, 150,  30,

	// top rung back
	 30,   0,  30,
	100,   0,  30,
	 30,  30,  30,
	 30,  30,  30,
	100,   0,  30,
	100,  30,  30,

	// middle rung back
	 30,  60,  30,
	 67,  60,  30,
	 30,  90,  30,
	 30,  90,  30,
	 67,  60,  30,
	 67,  90,  30,

	// top
		0,   0,   0,
	100,   0,   0,
	100,   0,  30,
		0,   0,   0,
	100,   0,  30,
		0,   0,  30,

	// top rung right
	100,   0,   0,
	100,  30,   0,
	100,  30,  30,
	100,   0,   0,
	100,  30,  30,
	100,   0,  30,

	// under top rung
	30,   30,   0,
	30,   30,  30,
	100,  30,  30,
	30,   30,   0,
	100,  30,  30,
	100,  30,   0,

	// between top rung and middle
	30,   30,   0,
	30,   60,  30,
	30,   30,  30,
	30,   30,   0,
	30,   60,   0,
	30,   60,  30,

	// top of middle rung
	30,   60,   0,
	67,   60,  30,
	30,   60,  30,
	30,   60,   0,
	67,   60,   0,
	67,   60,  30,

	// right of middle rung
	67,   60,   0,
	67,   90,  30,
	67,   60,  30,
	67,   60,   0,
	67,   90,   0,
	67,   90,  30,

	// bottom of middle rung.
	30,   90,   0,
	30,   90,  30,
	67,   90,  30,
	30,   90,   0,
	67,   90,  30,
	67,   90,   0,

	// right of bottom
	30,   90,   0,
	30,  150,  30,
	30,   90,  30,
	30,   90,   0,
	30,  150,   0,
	30,  150,  30,

	// bottom
	0,   150,   0,
	0,   150,  30,
	30,  150,  30,
	0,   150,   0,
	30,  150,  30,
	30,  150,   0,

	// left side
	0,   0,   0,
	0,   0,  30,
	0, 150,  30,
	0,   0,   0,
	0, 150,  30,
	0, 150,   0,
]

/* prettier-ignore */
const DEFAULT_3D_GEOMETRY_COLORS = [
	// left column front
	200,  70, 120,
	200,  70, 120,
	200,  70, 120,
	200,  70, 120,
	200,  70, 120,
	200,  70, 120,

		// top rung front
	200,  70, 120,
	200,  70, 120,
	200,  70, 120,
	200,  70, 120,
	200,  70, 120,
	200,  70, 120,

		// middle rung front
	200,  70, 120,
	200,  70, 120,
	200,  70, 120,
	200,  70, 120,
	200,  70, 120,
	200,  70, 120,

		// left column back
	80, 70, 200,
	80, 70, 200,
	80, 70, 200,
	80, 70, 200,
	80, 70, 200,
	80, 70, 200,

		// top rung back
	80, 70, 200,
	80, 70, 200,
	80, 70, 200,
	80, 70, 200,
	80, 70, 200,
	80, 70, 200,

		// middle rung back
	80, 70, 200,
	80, 70, 200,
	80, 70, 200,
	80, 70, 200,
	80, 70, 200,
	80, 70, 200,

		// top
	70, 200, 210,
	70, 200, 210,
	70, 200, 210,
	70, 200, 210,
	70, 200, 210,
	70, 200, 210,

		// top rung right
	200, 200, 70,
	200, 200, 70,
	200, 200, 70,
	200, 200, 70,
	200, 200, 70,
	200, 200, 70,

		// under top rung
	210, 100, 70,
	210, 100, 70,
	210, 100, 70,
	210, 100, 70,
	210, 100, 70,
	210, 100, 70,

		// between top rung and middle
	210, 160, 70,
	210, 160, 70,
	210, 160, 70,
	210, 160, 70,
	210, 160, 70,
	210, 160, 70,

		// top of middle rung
	70, 180, 210,
	70, 180, 210,
	70, 180, 210,
	70, 180, 210,
	70, 180, 210,
	70, 180, 210,

		// right of middle rung
	100, 70, 210,
	100, 70, 210,
	100, 70, 210,
	100, 70, 210,
	100, 70, 210,
	100, 70, 210,

		// bottom of middle rung.
	76, 210, 100,
	76, 210, 100,
	76, 210, 100,
	76, 210, 100,
	76, 210, 100,
	76, 210, 100,

		// right of bottom
	140, 210, 80,
	140, 210, 80,
	140, 210, 80,
	140, 210, 80,
	140, 210, 80,
	140, 210, 80,

		// bottom
	90, 130, 110,
	90, 130, 110,
	90, 130, 110,
	90, 130, 110,
	90, 130, 110,
	90, 130, 110,

		// left side
	160, 160, 220,
	160, 160, 220,
	160, 160, 220,
	160, 160, 220,
	160, 160, 220,
	160, 160, 220,
]

/* prettier-ignore */
const STAR_GEOMETRY_COORDS = [
	// left column
	0, 0,
	30, 0,
	0, 150,
	0, 150,
	30, 0,
	30, 150,

	// top rung
	30, 0,
	100, 0,
	30, 30,
	30, 30,
	100, 0,
	100, 30,

	// middle rung
	30, 60,
	67, 60,
	30, 90,
	30, 90,
	67, 60,
	67, 90,
]

/* prettier-ignore */
const DEFAULT_RECT_COORDS = [
	// left column
	0, 0,
	30, 0,
	0, 150,
	0, 150,
	30, 0,
	30, 150,
]

function flipAndCenter(geometry) {
	let coords = []
	var matrix = MATRIX_3D.xRotation(Math.PI)
	matrix = MATRIX_3D.translate(matrix, -50, -75, -15) // This is specific to DEFAULT_3D_GEOMETRY_COORDS

	for (var ii = 0; ii < geometry.length; ii += 3) {
		var vector = MATRIX_3D.transformVector(matrix, [
			geometry[ii + 0],
			geometry[ii + 1],
			geometry[ii + 2],
			1,
		])
		coords[ii + 0] = vector[0]
		coords[ii + 1] = vector[1]
		coords[ii + 2] = vector[2]
	}
	return coords
}

/**
 *
 * @param {number} radius
 * @param {number} points
 * @param {number} inset
 */
function generatePolygon(points, radius, inset) {
	let angleInRadians
	let x
	let y

	let outerCoords = []
	let innerCoords = []
	let coords = []

	for (let i = 0; i < points; i++) {
		if (i === 0) {
			angleInRadians = 0
		} else {
			angleInRadians = utils.degToRad(360 / (points * i))
		}
		x = Math.cos(angleInRadians)
		y = Math.sin(angleInRadians)
		coords.push(x, y)
		coords.push(x / 2, y / 2)
		coords.push(x, 0)
		coords.push(0, 0)
	}

	return coords
}

export default {
	DEFAULT_RECT_COORDS,
	DEFAULT_GEOMETRY_COORDS,
	DEFAULT_3D_GEOMETRY_COORDS,
	DEFAULT_3D_GEOMETRY_COLORS,
	flipAndCenter,
	generatePolygon,
}
