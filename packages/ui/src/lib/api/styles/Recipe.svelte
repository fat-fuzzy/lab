<script lang="ts">
	import type {ComponentType} from 'svelte'
	import type {StyleTree} from './types'
	import type {StylesApi} from '.'

	import {onDestroy, getContext} from 'svelte'

	import * as ui from '$stores/ui'

	export let title = ''
	export let name = title
	export let component: ComponentType
	export let props: any

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

	const stylesApi: StylesApi = getContext('stylesApi')
	let styles: StyleTree = stylesApi.getStyleTree()

	const stores = [
		settings.styles.subscribe((value) => {
			if (value) {
				styles = stylesApi.getStyleTree()
			}
		}),
	]

	// Block options
	$: variant = styles.blocks?.element.variant ?? variant
	$: color = styles.blocks?.element.color ?? color
	$: size = styles.blocks?.element.size ?? size
	// Layout options
	// - [layout + breakpoint] work together
	$: layout = styles.layouts?.layout.layout ?? layout
	$: threshold = styles.layouts?.layout.threshold ?? threshold
	$: breakpoint = styles.layouts?.layout.breakpoint ?? breakpoint

	$: props = {
		...props,
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
