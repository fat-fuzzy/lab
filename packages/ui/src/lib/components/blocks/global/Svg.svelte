<script lang="ts">
	import {base} from '$app/paths'
	import svgSprite from '$lib/images/fat-fuzzy.svg?raw' // TODO : optimize images

	export let asset = 'svg:placeholder'
	export let size = ''
	export let color = ''
	export let variant = ''

	// TODO: Figure out a scale for SVG
	const SVG_SIZES: {[key: string]: string} = {
		xxs: `12px`,
		xs: `16px`,
		sm: `20px`,
		md: `24px`,
		lg: `32px`,
		xl: `38px`,
		xxl: `46px`,
	}

	const assetFound = asset.split(':').length === 2 ? asset.split(':')[1] : false
	const svgFile = assetFound
		? `${base}/static/fat-fuzzy.svg#${assetFound}`
		: `${base}/static/fat-fuzzy.svg#placeholder`
</script>

<svg class={variant} width={SVG_SIZES[size]} height={SVG_SIZES[size]} fill={color}>
	<use href={svgFile} />
</svg>
{@html svgSprite}
