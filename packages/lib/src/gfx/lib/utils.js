/**
 ***********************
 * HELPER FUNCTIONS
 ***********************
 */

/**
 * Canvas, like Images, has 2 sizes
 * - Size the canvas is displayed: set with CSS
 * - Number of pixels displayed inside the canvas
 * @param {HTMLCanvasElement} canvas
 */
function resize(canvas) {
	// Get the size that the browser is displaying the canvas
	const displayWidth = canvas.clientWidth
	const displayHeight = canvas.clientHeight

	// Check if the canvas is the same size
	if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
		// If not, make it the same
		canvas.width = displayWidth
		canvas.height = displayHeight
	}
}

/**
 * Use with caution, as this makes the WebGL program draw more pixels
 * -> it might be better to let the GPU take over
 * @param {HTMLCanvasElement} canvas
 */
function resizeHD(canvas) {
	const realToCSSPixels = window.devicePixelRatio

	// - Get the size that the browser is displaying the canvas in CSS pixels
	// - Compute the size needed to make the drawing buffer match it in device pixels
	const displayWidth = Math.floor(canvas.clientWidth * realToCSSPixels)
	const displayHeight = Math.floor(canvas.clientHeight * realToCSSPixels)

	// Check if the canvas is the same size
	if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
		// If not, make it the same
		canvas.width = displayWidth
		canvas.height = displayHeight
	}
}

/**
 * Canvas, like Images, has 2 sizes
 * - Size the canvas is displayed: set with CSS
 * - Number of pixels displayed inside the canvas
 * @param {number} range
 */
function randomInt(range) {
	return Math.floor(Math.random() * range)
}

/**
 *
 * @param {*} characters
 */
function multiply(characters) {
	return new Array(100) // code from Svelte tutorial confetti
		.fill(0)
		.map((_, i) => {
			return {
				class: 'hide:rm-block',
				character: characters[i % characters.length],
				x: Math.random() * 100,
				y: -10 - Math.random() * 100,
				ratio: 0.1 + Math.random() * 1,
			}
		})
		.sort((a, b) => a.ratio - b.ratio)
}

/**
 * @param {number} degrees
 * @returns number
 */
function degToRad(degrees) {
	return degrees * (Math.PI / 180)
}

/**
 * @param {number} rads
 * @returns number
 */
function radToDeg(rads) {
	return (rads * Math.PI) / 180
}

/**
 * @param {number} n
 * @param {number} decimals
 * @returns number
 */
function round(n, decimals) {
	return Number(Math.round(Number(n + 'e' + decimals)) + 'e-' + decimals)
}

export default {
	resize,
	resizeHD,
	randomInt,
	multiply,
	degToRad,
	radToDeg,
	round,
}
