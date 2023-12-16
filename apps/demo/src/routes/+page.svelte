<script lang="ts">
	// TODO; conditional import
	import introDay from '$lib/images/day/001-intro.png' // TODO : optimize images
	import introNight from '$lib/images/night/001-intro.png' // TODO : optimize images

	let theme = 1
	const pageImage = {
		src: theme === 1 ? introDay : introNight,
		alt: `A drawing: "Creating a web app. Where to Start ?" asks a girl underneath a large cloud with a laptop connected to it and displaying an app in a browser. The cloud contains three boards: to the left is the CLIENT, which contains HTML, CSS, and JavaScript; to the right are RESOURCES which contain backend data and application logic; in the middle is the API, which connects the CLIENT to the RESOURCES using HTTP, URLs, JSON, REST, GraphQL, and enables calls to CRUD operations.`,
	}
	$: variant = 'bg:primary:light'
</script>

<svelte:head>
	<title>DSUV | Accueil</title>
	<meta name="description" content="Page de documentation du DSUV" />
</svelte:head>

<header class="bg:polar">
	<div class="l:text:xl l:center card:feature:xxl">
		<div class="l:frame l:text:xl">
			<img src={pageImage.src} alt={pageImage.alt} />
		</div>
		<h1 class="text:center">DSUV</h1>
	</div>
</header>

<section class="l:center l:text:xxl">
	<h2>Documentation</h2>
	<div class="l:switcher:sm bp:xs card:xxl">
		<article class={`card:lg text:center ${variant}`}>
			<a data-sveltekit-preload-data href="/ui" class="card font:md">UI</a>
		</article>
		<article class={`card:lg text:center ${variant}`}>
			<a data-sveltekit-preload-data href="/log" class="card font:md">LOG</a>
		</article>
	</div>
</section>
