<script lang="ts">
	import type {ComponentType} from 'svelte'
	import type {StylesApi} from '$lib/api/styles'

	import {onDestroy, getContext} from 'svelte'

	import type {StyleTree} from './types'

	import * as ui from '$stores/ui'

	export let title = ''
	export let component: ComponentType
	export let props: any
	const stylesApi: StylesApi = getContext('stylesApi')
	let styles: StyleTree = stylesApi.getStyleTree()

	let color = props?.color || ''
	let status = props?.status || ''
	let context = props?.context || ''
	let variant = props?.variant || ''
	let asset = props?.asset || ''
	let size = props?.size || '' // element's own size
	let shape = props?.shape || ''
	let layout = props?.layout || ''
	let breakpoint = props?.breakpoint || ''
	let threshold = props?.threshold || ''

	const stores = [
		ui.styles.subscribe((value) => {
			if (value) {
				styles = stylesApi.getStyleTree()
			}
		}),
	]

	// Block options
	$: variant = styles.blocks?.element.variant ?? variant
	$: color = styles.blocks?.element.color ?? color
	$: status = styles.blocks?.element.status ?? status
	$: context = styles.blocks?.element.context ?? context
	$: size = styles.blocks?.element.size ?? size
	$: asset = styles.blocks?.element.asset ?? asset
	$: shape = styles.blocks?.element.shape ?? shape
	// Layout options
	// - [layout + breakpoint] work together
	$: layout = styles.layouts?.layout.layout ?? layout
	$: breakpoint = styles.layouts?.layout.breakpoint ?? breakpoint
	$: threshold = styles.layouts?.layout.threshold ?? threshold

	$: props = {
		...props,
		asset,
		title,
		color,
		status,
		context,
		variant,
		size,
		shape,
		layout,
		threshold,
		breakpoint,
	}

	onDestroy(() => {
		stores.forEach((unsubscribe) => unsubscribe())
	})
</script>

<svelte:component this={component} id={title} {...props} />
