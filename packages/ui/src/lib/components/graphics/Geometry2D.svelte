<script lang="ts">
	import type {GeometryProps} from '$types'

	import {createEventDispatcher, onMount} from 'svelte'
	import {enhance} from '$app/forms'

	import Position from '$lib/components/graphics/Position.svelte'
	import Scale from '$lib/components/graphics/Scale.svelte'
	import Rotation from '$lib/components/graphics/Rotation.svelte'
	import Button from '$lib/components/blocks/buttons/Button.svelte'

	export let id = 'geometry-2d'
	export let method = 'POST'
	export let canvasWidth: number
	export let canvasHeight: number
	export let geometry: GeometryProps
	export let background = ''
	export let layout = ''
	export let threshold = ''
	export let size = ''
	export let formaction = 'updateGeometry'
	export let actionPath: string | undefined = undefined
	export let redirect: string | undefined = undefined
	export let disabled: boolean

	const dispatch = createEventDispatcher()

	function degToRad(degrees: number) {
		return degrees * (Math.PI / 180)
	}

	let update = () =>
		dispatch('update', {
			value,
		})

	let {scale, translation, rotation} = geometry

	// input attributes
	let [angle] = rotation ?? []

	// Position
	let [coordX, coordY] = translation ?? []

	// Scale
	let [scaleX, scaleY] = scale ?? []

	$: maxX = canvasWidth
	$: maxY = canvasHeight
	$: translation = [coordX, coordY]
	$: rotatedAngle = degToRad(angle)
	$: scale = [scaleX, scaleY]
	$: value = {
		color: geometry.color,
		translation,
		rotation: [rotatedAngle],
		scale,
	}
	$: action = formaction && redirect ? `${formaction}&redirectTo=${redirect}` : formaction
	$: backgroundClass = background ? `bg:${background}` : ''
	onMount(() => {
		update()
	})
</script>

<form
	class={`l:${layout}:${size} th:${threshold} maki:block lg geometry ${backgroundClass}`}
	name="geometry-update"
	{method}
	action={action && actionPath ? `${actionPath}?/${action}` : `?/${action}`}
	use:enhance={() => {
		// prevent default callback from resetting the form
		return ({update}) => {
			update({reset: false})
		}
	}}
>
	<Position
		id={`${id}-position`}
		bind:coordX
		bind:coordY
		bind:maxX
		bind:maxY
		on:input={update}
		color={'primary'}
		size={`xs l:burrito:${threshold} maki:inline`}
		{disabled}
	/>
	<Rotation
		id={`${id}-rotation`}
		bind:angle
		max={360}
		on:input={update}
		color={'accent'}
		size={`xs l:burrito:${threshold} maki:inline`}
		{disabled}
	/>
	<Scale
		id={`${id}-scale`}
		bind:scaleX
		bind:scaleY
		maxX={5}
		maxY={5}
		minX={-5}
		minY={-5}
		on:input={update}
		color={'highlight'}
		size={`xs l:burrito:${threshold} maki:inline`}
		{disabled}
	/>
	{#await Promise.resolve()}
		<div class={`l:frame:twin card:lg`}>
			<Button
				title="Update geometry"
				size="xl"
				color="highlight"
				variant="outline"
				shape="round"
				asset="emoji:nojs"
				{disabled}
			/>
		</div>
	{:then}
		<slot />
	{/await}
</form>
