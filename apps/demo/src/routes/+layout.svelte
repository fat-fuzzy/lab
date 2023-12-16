<script lang="ts">
	import {onDestroy} from 'svelte'
	import '$lib/styles/css/tokens/main.css'
	import '@fat-fuzzy/ui/csscore'

	import {page} from '$app/stores'
	import {links, itemsSettings} from '$data/nav'
	import {compositions, stores, utils} from '@fat-fuzzy/ui'

	const {Header} = compositions
	const {settings} = stores

	let appSettings: {[key: string]: string} = {brightness: 'day', contrast: 'night'}

	const localStores = [
		settings.app.subscribe((value) => {
			if (value) {
				appSettings = value
			}
		}),
	]

	$: brightness = appSettings.brightness
	$: contrast = appSettings.contrast
	$: pageClass = utils.format.getClassNameFromUrl($page.url)
	$: mainClass = `${pageClass} ${brightness} bg:${contrast}`
	$: headerClass = `header-app ${brightness} bg:${contrast}`
	$: footerClass = `l:center font:sm ${brightness} bg:${contrast}`

	onDestroy(() => {
		localStores.forEach((unsubscribe) => unsubscribe())
	})
</script>

<Header
	id="ui"
	className={headerClass}
	actionPath="/"
	formaction="toggleNav"
	redirect={$page.url.pathname}
	items={{links, settings: itemsSettings}}
	breakpoint="xs"
/>

<main class={mainClass}>
	<slot />
</main>

<footer class={footerClass}>
	<p>👉 Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to learn SvelteKit</p>
</footer>
