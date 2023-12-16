<script lang="ts">
	import {page} from '$app/stores'
	import {compositions, layouts} from '@fat-fuzzy/ui'
	const {Sidebar} = layouts
	const {Nav} = compositions

	let title = 'DSUV'
	let description = 'DSUV: Contexte'
	$: path = ''
	$: items = [
		{
			slug: 'log',
			title: 'Log',
			items: $page.data.markdowns.map(({meta, path}) => ({
				id: meta.id,
				slug: meta.slug,
				title: meta.title,
			})),
		},
	]
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
</svelte:head>

<Sidebar size="xs">
	<svelte:fragment slot="side">
		<Nav {items} {path} background="polar" size="md" color="primary" />
	</svelte:fragment>
	<div slot="main" class="l:center l:stack:xxl">
		<slot />
	</div>
</Sidebar>
