<script lang="ts">
	import {page} from '$app/stores'

	import {headless} from '@fat-fuzzy/ui'

	const {Head} = headless

	$: markdowns = $page.data.markdowns

	let title = 'Log'
	$: headerClass = 'l:flex card:sm bg:polar align:center'
</script>

<Head page={title} description="Log of Architectural decisions" />

<header class={headerClass}>
	<h1 class="card:md">Fat Fuzzy {title}</h1>
</header>

<div class="l:stack:xl card:xl">
	{#each markdowns as { meta }}
		<a class="font:xxl" href={`/log/${meta.slug}`}>{meta.title}</a>
	{/each}
</div>
