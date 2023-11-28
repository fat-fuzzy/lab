import {base} from '$app/paths'

const svgPrefix = `${base}/static/svg/fat-fuzzy.svg`

/**
 * Load data from SVG files
 * @param pathPrefix relative path from this folder to SVG assets
 * @param imports SVG default imports
 * @returns a string with SVG source code
 */
const importSvg = async (imports: any) => {
	const svgObjects = Object.entries(imports)
	const svgImports = await Promise.all(
		// TODO: understand this vite functionality
		svgObjects.map(async ([path, resolver]) => {
			const result: any = await resolver()

			// const filePath = path.slice(pathPrefix.length, -4) // removes pathPrefix and '*.svg'
			const svg = result.default
			return {
				svg,
			}
		}),
	)
	return svgImports
}

async function fetchSvg() {
	const svg = await importSvg(svgPrefix)
	return {
		svg,
	}
}

export default {fetchSvg}
