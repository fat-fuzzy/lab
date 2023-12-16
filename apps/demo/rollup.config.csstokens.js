import scss from 'rollup-plugin-scss'
import postcss from 'postcss'
import autoprefixer from 'autoprefixer'

/**
 * Preprocess scss in `src/lib/styles/` to use css directly in svelte components
 * Use this library to experiment with design tokens styles
 */
export default {
	input: 'src/lib/styles/scss/tokens/index.js',
	output: {dir: 'src/lib/styles/css/tokens/', format: 'esm'},
	plugins: [
		scss({
			fileName: 'main.css',
			processor: () => postcss([autoprefixer()]),
			// processor: () => postcss([autoprefixer({overrideBrowserslist: 'Edge 18'})]),
			watch: 'src/scss/tokens/',
		}), // will output compiled styles to "assets/output-123hash.css"
	],
}
