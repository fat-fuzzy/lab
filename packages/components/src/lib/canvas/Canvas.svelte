<script context="module" lang="ts">
	import {getGeometryDefaults} from '../../gl/animations.js'
	export const prerender = true
</script>

<script>
	import {animations, currentAnimationId, theme} from '../../stores.js'
	import Button from '../button/Button.svelte'
	import Controls from '../controls/Controls.svelte'
	import Geometry from '../geometry/Geometry.svelte'
	export let show = true
	// Canvas
	let canvas
	let canvasWidth = 300
	let canvasHeight = 600
	let animationId = $currentAnimationId
	let showGeometryInputs = true
	let animationFrame
	let variant = ''
	const btnVariant = 'outline'

	// TODO : fix
	let geometry = getGeometryDefaults(canvasWidth, canvasHeight)

	theme.subscribe((value) => {
		variant = value ? `${btnVariant} accent` : `${btnVariant} highlight`
	})

	currentAnimationId.subscribe((value) => {
		animationId = value
	})

	function runLoop(timestamp, duration) {
		if (animation.interactive) {
			if (animation.webGlProps) {
				animation.update(geometry)
			} else {
				animation.run(canvas, geometry)
			}
		} else {
			animation.run(canvas)
		}
		animationFrame = requestAnimationFrame(function (t) {
			// call requestAnimationFrame again with parameters
			runLoop(t, duration)
		})
	}

	function updateGeometry(event) {
		geometry = {...geometry, ...event.detail.value}
	}

	function play() {
		animationFrame = requestAnimationFrame(function (timestamp) {
			let {duration} = animation
			runLoop(timestamp, duration)
		})
	}

	function stop() {
		if (animation?.interactive && animation?.webGlProps) {
			geometry = getGeometryDefaults(canvasWidth, canvasHeight)
			animation.update(geometry)
		}
		cancelAnimationFrame(animationFrame)
		animation.clear()
	}

	function togglelDetails() {
		showGeometryInputs = !showGeometryInputs
	}
	$: canvasClass = show ? 'canvas' : 'u-visually-hidden'
	$: animation = $animations.find((animation) => animation.id === animationId)
	$: interactive = animation.interactive
	$: details = interactive
	$: detailsIcon = showGeometryInputs ? '👇' : '👉'
</script>

<div class="l-sidebar">
	<div class="l-sidebar-main">
		<div
			class="l-frame video layer"
			bind:offsetWidth={canvasWidth}
			bind:offsetHeight={canvasHeight}
		>
			<canvas
				alt={`HTML Canvas displaying scene: ${animation.name}`}
				data-test="canvas"
				class={canvasClass}
				bind:this={canvas}
			/>
		</div>
		<Controls {play} {stop} />
	</div>
	<div class="l-sidebar-side md">
		<aside class="l-stack sm">
			{#if details}
				<Button testId="btn-details" {variant} handleClick={() => togglelDetails()}>
					{detailsIcon} Details
				</Button>
				<Geometry
					show={showGeometryInputs}
					on:update={updateGeometry}
					{canvasWidth}
					{canvasHeight}
				/>
			{/if}
		</aside>
	</div>
</div>
