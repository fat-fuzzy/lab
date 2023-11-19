<script lang="ts">
	import {createEventDispatcher} from 'svelte'

	import Fieldset from '$lib/components/blocks/forms/Fieldset.svelte'
	import InputRange from '$lib/components/blocks/forms/InputRange.svelte'

	const dispatch = createEventDispatcher()

	export let size = 'xxs'
	export let label = 'Angle'
	const legend = 'Rotation'
	export let angle = 0
	export let max = 0

	function update() {
		dispatch('input', {
			value: angle,
		})
	}
</script>

<Fieldset {legend} {size}>
	<!--https://css-tricks.com/accessible-svgs/-->
	<!-- <svg id="InteractiveSVG" role="group" /> -->
	<InputRange bind:value={angle} {label} {max} on:input={update} {size} />
</Fieldset>
