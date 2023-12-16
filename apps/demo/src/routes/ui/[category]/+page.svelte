<script lang="ts">
	import {onDestroy} from 'svelte'
	import {page} from '$app/stores'
	import {tokens, blocks, compositions, layouts, api, stores} from '@fat-fuzzy/ui'
	const {Collection, Api} = api
	const {RevealAuto} = layouts
	export let actionPath = '/ui'

	let stylesApi = api.stylesApi.initStyles()
	let revealContext: {[key: string]: string} = {reveal: ''}

	function getComponentType(cat: string) {
		switch (cat) {
			case 'tokens':
				return tokens
			case 'blocks':
				return blocks
			case 'layouts':
				return layouts
			case 'compositions':
				return compositions
			default:
				return {}
		}
	}

	const localStores = [
		stores.ui.styles.subscribe((value) => {
			if (value) {
				stylesApi.applyStyles(value)
			}
		}),
		stores.ui.reveal.subscribe((value) => {
			if (value) {
				revealContext = value
			}
		}),
	]

	function handleToggle(event: CustomEvent) {
		stores.ui.reveal.set(event.detail)
	}

	$: reveal = revealContext.reveal
	$: category = $page.params.category
	$: markdowns = $page.data.markdowns
	$: content = markdowns.categories.find(({meta}) => meta.slug === category)
	$: title = `${category.charAt(0).toUpperCase()}${category.slice(1)}`
	$: components = getComponentType(category)
	$: path = $page.url.pathname
	$: headerClass = 'page-header card:md l:switcher:xs bp:xxs bg:polar'

	onDestroy(() => {
		localStores.forEach((unsubscribe) => unsubscribe())
	})
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={`${title} documentation`} />
</svelte:head>

<header class={headerClass}>
	<h1 class="l:main:40 maki lg">{title}</h1>
	<RevealAuto
		id="ui-category-app-context"
		size="sm"
		breakpoint="sm"
		color="primary"
		align="start"
		variant="outline"
		title="Context"
		formaction="toggleContext"
		{actionPath}
		{reveal}
		redirect={$page.url.pathname}
		on:toggle={handleToggle}
	>
		<div slot="content" class="l:side ui:menu reverse">
			<Api {title} {path} {actionPath} redirect={$page.url.pathname} />
		</div>
	</RevealAuto>
</header>

<Collection
	{title}
	depth={1}
	isPage={true}
	{components}
	{category}
	{content}
	{stylesApi}
	{path}
	{actionPath}
	redirect={$page.url.pathname}
/>
