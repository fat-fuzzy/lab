import scss from 'rollup-plugin-scss'
import postcss from 'postcss'
import autoprefixer from 'autoprefixer'

export default {
	input: 'src/styles/play.js',
	output: {file: 'dist/play/css/index.js', format: 'esm'},
	plugins: [
		scss({
			fileName: 'main.css',
			processor: () => postcss([autoprefixer()]),
			// processor: () => postcss([autoprefixer({overrideBrowserslist: 'Edge 18'})]),
			watch: 'src/styles/components',
		}), // will output compiled styles to "assets/output-123hash.css"
	],
}
