<script lang="ts">
	import {onDestroy, setContext} from 'svelte'
	import {page} from '$app/stores'
	import {tokens, blocks, layouts, recipes, graphics, stores, constants, api} from '@fat-fuzzy/ui'
	const {RevealNav} = recipes
	let path = $page.url.pathname

	// TODO: move to utils / clean
	function sortAsc(a, b) {
		return a < b ? -1 : b < a ? 1 : 0
	}

	const tokenNames = Object.keys(tokens).sort(sortAsc)
	const blockNames = Object.keys(blocks).sort(sortAsc)
	const layoutNames = Object.keys(layouts).sort(sortAsc)
	const recipeNames = Object.keys(recipes).sort(sortAsc)
	const graphicsNames = Object.keys(graphics).sort(sortAsc)
	let title = 'Fat Fuzzy UI' // TODO : Fix title in children components: add breadcrumb nav component ?

	let sidebarReveal: {[key: string]: string} = {reveal: ''}
	let stylesApi = api.stylesApi.initStyles()
	setContext('stylesApi', stylesApi)
	setContext('styles', stylesApi.getStyleTree())

	const {styles, context, state} = $page.data
	const {DEFAULT_REVEAL_STATE, DEFAULT_NAV_REVEAL_STATE} = constants

	stores.ui.styles.set(styles)
	stores.ui.reveal.set(context)
	stores.ui.navReveal.set(state?.navReveal || DEFAULT_NAV_REVEAL_STATE)
	stores.ui.settingsReveal.set(state?.settingsReveal || DEFAULT_REVEAL_STATE)
	stores.ui.sidebarReveal.set(state?.sidebarReveal || DEFAULT_NAV_REVEAL_STATE)

	const localStores = [
		stores.settings.sidebarReveal.subscribe((value) => {
			if (value) {
				sidebarReveal = value
			}
		}),
	]

	$: path = ''
	$: items = [
		{
			slug: 'ui',
			title,
			items: [
				{
					slug: 'tokens',
					title: 'Tokens',
					items: tokenNames.map((c) => ({slug: c, title: c})),
				},
				{
					slug: 'blocks',
					title: 'Blocks',
					items: blockNames.map((c) => ({slug: c, title: c})),
				},
				{
					slug: 'layouts',
					title: 'Layouts',
					items: layoutNames.map((c) => ({slug: c, title: c})),
				},
				{
					slug: 'recipes',
					title: 'Recipes',
					items: recipeNames.map((c) => ({slug: c, title: c})),
				},
				{
					slug: 'graphics',
					title: 'Graphics',
					items: graphicsNames.map((c) => ({slug: c, title: c})),
				},
			],
		},
	]

	onDestroy(() => {
		localStores.forEach((unsubscribe) => unsubscribe())
	})
</script>

<div class="l:sidebar:xs align-content:start">
	<div class={`l:side ${sidebarReveal.reveal}`}>
		<RevealNav
			title="Design Library"
			name="reveal"
			id="nav-page"
			{items}
			{path}
			settings={stores.settings}
			breakpoint="sm"
			size="md"
			color="bg:primary:light"
			position="fixed"
			place="left"
			background="polar"
			container="card"
			formaction="toggleSidebar"
			actionPath="/"
			redirect={$page.url.pathname}
		/>
	</div>
	<div class="l:main l:center l:stack:xl">
		<slot />
	</div>
</div>
