<script lang="ts">
	import {page} from '$app/stores'

	import {headless} from '@fat-fuzzy/ui'

	const {Head} = headless

	let title = 'Error'

	$: asset = $page.status === 404 ? 'not-found' : 'error'
</script>

<Head page={title} description="Something went wrong!" />

<div class="l:frame:twin">
	<div class="l:stack:xxl card:xxl l:text:lg">
		<h1>Error</h1>
		<p class={`feedback emoji:${asset} font:md`}>{$page.status}: {$page.error?.message}</p>
	</div>
</div>
