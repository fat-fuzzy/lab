<script lang="ts">
	import {page} from '$app/stores'
	import {layouts} from '@fat-fuzzy/ui'

	const {RevealAuto} = layouts

	let title: string
	let date: string
	$: markdown = $page.data.markdowns.find((d) => d.path === $page.data.path)
	$: title = markdown.meta.title
	$: date = markdown.meta.date
	$: html = $page.data.html
	$: headerClass = 'page-header bg:polar'
</script>

<svelte:head>
	<title>DSUV - Librairie de Composants | {title}</title>
	<meta name="description" content={`${title} documentation`} />
</svelte:head>

<header class={headerClass}>
	<h1 class="card:xl">{title}</h1>

	<RevealAuto
		size="sm"
		threshold="sm"
		color="primary:light"
		align="start"
		asset="&nbsp;💡&nbsp;"
		title="Info"
	>
		<div slot="content" class="l:side shrink ui:menu">
			<p>Published: {date}</p>
		</div>
	</RevealAuto>
</header>

<article class="l:text:xl">
	<div class="card:xl">{@html html}</div>
</article>
