<script lang="ts">
	import {headless} from '@fat-fuzzy/ui'

	// TODO; conditional import
	import introDay from '$lib/images/day/001-intro.png' // TODO : optimize images
	import introNight from '$lib/images/night/001-intro.png' // TODO : optimize images

	const {Head} = headless

	let title = 'Rocks'
	let theme = 1
	const pageImage = {
		src: theme === 1 ? introDay : introNight,
		alt: `A drawing: "Creating a web app. Where to Start ?" asks a girl underneath a large cloud with a laptop connected to it and displaying an app in a browser. The cloud contains three boards: to the left is the CLIENT, which contains HTML, CSS, and JavaScript; to the right are RESOURCES which contain backend data and application logic; in the middle is the API, which connects the CLIENT to the RESOURCES using HTTP, URLs, JSON, REST, GraphQL, and enables calls to CRUD operations.`,
	}
	$: variant = 'bg:primary:light'
</script>

<Head
	page={title}
	description="This is the Fat Fuzzy Rocks website home page. The site contains a small Design System based on CUBE CSS, as well as developer documentation and decision logs. Welcome! 🐰"
/>

<header class="bg:polar">
	<div class="l:text:md l:center card:xl">
		<div class="l:frame">
			<img src={pageImage.src} alt={pageImage.alt} />
		</div>
		<h1 class="text:center">Fat Fuzzy Rocks</h1>
	</div>
</header>

<section class="l:center l:text:xxl">
	<h2>✨ Highlights</h2>
	<div class="l:switcher:sm bp:xs card:xxl">
		<article class={`card:lg text:center ${variant}`}>
			<a data-sveltekit-preload-data href="/ui" class="card font:md">🌈 UI</a>
		</article>
		<article class={`card:lg text:center ${variant}`}>
			<a data-sveltekit-preload-data href="/log" class="card font:md">✏️ LOG</a>
		</article>
	</div>
</section>
