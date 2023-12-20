<script lang="ts">
	import type {ComponentType} from 'svelte'
	import type {StyleTree} from './types'
	import type {StylesApi} from './styles-api'

	import {onDestroy} from 'svelte'

	import lib from '@fat-fuzzy/lib'
	import {initStyles} from '$lib/api/styles/styles-api'
	import * as ui from '$stores/ui'

	export let stylesApi: StylesApi = initStyles()

	export let title = ''
	export let name = title
	export let component: ComponentType
	export let props: any
	export let sceneId = '004'

	export let actionPath: string | undefined = undefined
	export let redirect: string | undefined = undefined
	export let settings: any = ui

	let breakpoint = props?.breakpoint || ''
	let threshold = props?.threshold || ''
	let layout = props?.layout || ''
	let color = props?.color || ''
	let variant = props?.variant || ''
	let asset = props?.asset || ''
	let size = props?.size || '' // element's own size

	let page = ''

	let styles: StyleTree = stylesApi.getStyleTree()

	const stores = [
		settings.styles.subscribe((value) => {
			if (value) {
				styles = value
			}
		}),
	]

	// Graphics options
	$: scene = lib.gfx.sketches[sceneId]
	$: geometry = lib.gfx.utils.getGeometryDefaults()
	// Block options
	$: variant = styles.blocks?.element.variant ?? variant
	$: color = styles.blocks?.element.color ?? color
	$: size = styles.blocks?.element.size ?? size
	// Layout options
	// - [layout + breakpoint] work together
	$: layout = styles.shared?.layout.layout ?? layout
	$: breakpoint = styles.shared?.layout.breakpoint ?? breakpoint
	$: threshold = styles.shared?.layout.threshold ?? threshold

	$: props = {
		...props,
		scene,
		geometry,
		page,
		title,
		color,
		variant,
		size,
		layout,
		breakpoint,
		threshold,
		asset,
		name: `ui-${name}`,
		settings,
		actionPath,
		redirect,
	}

	onDestroy(() => {
		stores.forEach((unsubscribe) => unsubscribe())
	})
</script>

<svelte:component this={component} id={title} {...props} />