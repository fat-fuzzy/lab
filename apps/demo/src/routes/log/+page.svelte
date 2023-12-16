<script lang="ts">
	import {page} from '$app/stores'

	$: markdowns = $page.data.markdowns

	let title = 'DSUV'
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={`${title} documentation`} />
</svelte:head>

<header class="page-header bg:polar">
	<h1 class="card:xl">{title}</h1>
</header>

<div class="l:stack:xl card:xl">
	{#each markdowns as { meta }}
		<a class="font:xxl" href={`/log/${meta.slug}`}>{meta.title}</a>
	{/each}
</div>
