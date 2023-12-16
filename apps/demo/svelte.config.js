import path from 'path'
import {mdsvex} from 'mdsvex'
import mdsvexConfig from './mdsvex.config.js'
import adapter from '@sveltejs/adapter-cloudflare'
import preprocess from 'svelte-preprocess'

function isWebComponentSvelte(code) {
	const svelteOptionsIdx = code.indexOf('<svelte:options ')
	if (svelteOptionsIdx < 0) {
		return false
	}
	const tagOptionIdx = code.indexOf('tag=', svelteOptionsIdx)
	const svelteOptionsEndIdx = code.indexOf('>', svelteOptionsIdx)
	return tagOptionIdx > svelteOptionsIdx && tagOptionIdx < svelteOptionsEndIdx
}

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', ...mdsvexConfig.extensions],

	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: [preprocess(), mdsvex(mdsvexConfig)],

	kit: {
		adapter: adapter(),

		alias: {
			$utils: path.resolve('./src/utils'),
			$data: path.resolve('./src/data'),
			$assets: path.resolve('./src/assets'),
		},
	},
	build: {
		target: 'esnext',
	},
	vitePlugin: {
		// To compile WC on the go: https://github.com/sveltejs/vite-plugin-svelte/issues/270#issuecomment-1033190138
		experimental: {
			dynamicCompileOptions({code}) {
				if (isWebComponentSvelte(code)) {
					return {
						customElement: true,
					}
				}
			},
		},
	},
}

export default config
