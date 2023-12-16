<script lang="ts">
	import {page} from '$app/stores'
	import {compositions, layouts} from '@fat-fuzzy/ui'
	const {Sidebar} = layouts
	const {Nav} = compositions

	let title = 'DSUV Dev'
	let description = 'DSUV Dev: Comment utiliser la librairie DSUV'
	$: path = ''
	$: items = [
		{
			slug: 'dev',
			title: 'Dev',
			items: $page.data.markdowns.map(({meta}) => ({
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
		<Nav {items} {path} size="md" color="primary" background="polar" />
	</svelte:fragment>
	<div slot="main" class="l:center l:stack:xxl">
		<slot />
	</div>
</Sidebar>
