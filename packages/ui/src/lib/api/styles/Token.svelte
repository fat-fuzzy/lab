<script lang="ts">
	import type {ComponentType} from 'svelte'
	import type {StyleTree} from './types'
	import type {StylesApi} from '$lib/api/styles'

	import {onDestroy, getContext} from 'svelte'

	import * as ui from '$stores/ui'

	export let title = ''
	export let component: ComponentType
	export let props: any
	const stylesApi: StylesApi = getContext('stylesApi')

	let color = ''
	let variant = ''
	let asset = props?.asset || ''
	let size = '' // element's own size
	let typography = '' // element's own size

	let styles: StyleTree = stylesApi.getStyleTree()

	const stores = [
		ui.styles.subscribe((value) => {
			if (value) {
				styles = stylesApi.getStyleTree()
			}
		}),
	]

	// Block options
	// $: variant = styles.tokens?.element.variant ?? variant
	$: color = styles.tokens?.element.color ?? color
	$: typography = styles.tokens?.element.typography ?? typography
	$: props = {...props, asset, title, color, variant, size}

	onDestroy(() => {
		stores.forEach((unsubscribe) => unsubscribe())
	})
</script>

<svelte:component this={component} id={title} {...props} />
