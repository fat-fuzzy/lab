<script lang="ts">
	import {page} from '$app/stores'
</script>

<h1>Error</h1>
<p>{$page.status}: {$page.error?.message}</p>
