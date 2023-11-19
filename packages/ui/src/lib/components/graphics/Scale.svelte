<script lang="ts">
	import {createEventDispatcher} from 'svelte'

	import Fieldset from '$lib/components/blocks/forms/Fieldset.svelte'
	import InputRange from '$lib/components/blocks/forms/InputRange.svelte'

	export let size = 'xxs'
	export let scaleX = 0
	export let scaleY = 0
	export let minX = 0
	export let maxX = 0
	export let minY = 0
	export let maxY = 0
	export let label = ''

	const dispatch = createEventDispatcher()
	const legend = 'Scale'

	function updateX() {
		dispatch('input', {
			value: scaleX,
		})
	}

	function updateY() {
		dispatch('input', {
			value: scaleY,
		})
	}
</script>

<Fieldset {legend} {size}>
	<InputRange
		bind:value={scaleX}
		label="{label} x"
		min={minX}
		max={maxX}
		on:input={updateX}
		{size}
	/>
	<InputRange
		bind:value={scaleY}
		label="{label} y"
		min={minY}
		max={maxY}
		on:input={updateY}
		{size}
	/>
</Fieldset>
