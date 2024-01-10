<script lang="ts">
	import type {Scene, SketchProps, SceneMeta, Filters} from '$lib/types'

	import {afterUpdate, onDestroy} from 'svelte'

	import Geometry2D from '$lib/components/graphics/Geometry2D.svelte'
	import Geometry3D from '$lib/components/graphics/Geometry3D.svelte'
	import FieldOfView from '$lib/components/graphics/FieldOfView.svelte'
	import Camera from '$lib/components/graphics/Camera.svelte'
	import Player from '$lib/components/graphics/Player.svelte'
	import ToggleMenu from '../recipes/menus/ToggleMenu.svelte'

	export let id = 'sketch'
	export let scene: Scene
	export let title: string
	export let asset: string
	export let dimensions = 'video'
	export let layer = 'layer' // if 'layer' the canvas will appear on a layer (with drop shadow)
	export let color = ''
	export let size = ''
	export let variant = ''
	export let background = ''
	export let layout = 'switcher'
	export let breakpoint = ''
	export let threshold = ''
	export let meta: SceneMeta | undefined = undefined

	let feedback: {message: string; status: string} | undefined = undefined
	let canvas: HTMLCanvasElement | null = null
	let width: number
	let height: number
	let context: SketchProps
	let programInfo
	let fieldOfView = 60
	let cameraAngle = 60

	let frame: number
	let state = 'clear'
	let filters: Filters = {
		channels: 'rgba',
		blur: undefined,
	}

	function degToRad(degrees: number) {
		return degrees * (Math.PI / 180)
	}

	$: state = feedback ? `${feedback.status}` : state
	$: showGeometry =
		context !== undefined &&
		scene.meta?.type !== 'texture' &&
		(state === 'play' || state === 'pause')
	$: currentAsset = state === 'clear' && asset ? asset : `emoji:${state}`
	$: backgroundClass = background
		? `l:frame:${dimensions} bg:${background}`
		: `l:frame:${dimensions}`
	$: frameClasses = canvas
		? `canvas ${backgroundClass} ${layer} state:${state} ${currentAsset}`
		: `canvas ${backgroundClass} ${layer} card:xl`

	function init() {
		if (canvas) {
			try {
				programInfo = scene.main(canvas, {filters})
				if (state === 'clear' || !context) {
					context = programInfo.context
				}
				scene.update(context)
			} catch (e: any) {
				feedback = {status: 'error', message: e}
			}
		}
	}

	const loop = (t) => {
		scene.draw(t)
		if (scene.meta?.type !== 'texture') {
			frame = requestAnimationFrame((t) => {
				loop(t)
			})
		} else {
			frame = requestAnimationFrame((t) => {
				scene.draw(t)
			})
		}
	}

	const play = () => {
		loop(Date.now())
	}

	const clear = () => {
		cancelAnimationFrame(frame)
		scene.clear()
		filters = {
			channels: 'rgba',
			blur: undefined,
		}
	}

	const pause = () => {
		cancelAnimationFrame(frame)
		scene.update(context)
	}

	function updateGeometry(event: CustomEvent) {
		context = event.detail.value
	}

	function updateFieldOfView(event: CustomEvent) {
		context.fieldOfView = degToRad(event.detail.value)
	}

	function updateCamera(event: CustomEvent) {
		context.cameraAngle = degToRad(event.detail.value)
	}

	const handleToggle = (event: CustomEvent) => {
		state = event.detail.selected[0].value
		switch (state) {
			case 'play':
				play()
				break
			case 'pause':
				pause()
				break
			case 'clear':
				clear()
				break
		}
	}

	const handleToggleChannel = (event: CustomEvent) => {
		const value = event.detail.selected[0].value

		filters = {
			channels: value,
			blur: undefined,
		}

		if (canvas) {
			programInfo = scene.main(canvas, {filters})
		}
	}

	const handleToggleBlur = (event: CustomEvent) => {
		const value = event.detail.selected[0].value

		if (value === filters.blur) {
			filters.blur = undefined
		} else {
			filters.blur = value
		}

		if (canvas) {
			programInfo = scene.main(canvas, {filters})
		}
	}

	const handleMouseEvent = (event: MouseEvent) => {
		scene.update(context, event)
	}

	afterUpdate(() => {
		if (state !== 'pause') {
			init()
		}
	})
	onDestroy(() => {
		if (frame) {
			clear()
		}
	})
</script>

<article class={`l:grid:sketch bp:xs`}>
	<div class="scene">
		<div class={frameClasses} bind:offsetWidth={width} bind:offsetHeight={height}>
			{#if scene.meta?.input === 'mouse'}
				<canvas
					id={`${id}.canvas`}
					aria-label={title}
					data-test="canvas"
					bind:this={canvas}
					on:mousedown={handleMouseEvent}
					on:mousemove={handleMouseEvent}
					on:mouseup={handleMouseEvent}
				>
					<slot name="fallback-canvas">
						<p class={`feedback emoji:default ${size} content`}>
							With JavaScript enabled, you would see a demo of a canvas component used to display
							and interact with WebGL animations
						</p>
					</slot>
				</canvas>
			{:else}
				<canvas id={`${id}.canvas`} aria-label={title} data-test="canvas" bind:this={canvas}>
					<slot name="fallback-canvas">
						<p class={`feedback emoji:default ${size} content`}>
							With JavaScript enabled, you would see a demo of a canvas component used to display
							and interact with WebGL animations
						</p>
					</slot>
				</canvas>
			{/if}
			{#await Promise.resolve()}
				<p class={`feedback ${size} emoji:default content`}>Scene is loading...</p>
			{:then}
				{#if feedback}
					<pre class={`feedback emoji:${feedback.status} content ${size}`}>{feedback.message}</pre>
				{/if}
			{/await}
		</div>
	</div>
	<aside class="context">
		{#if canvas}
			<Player on:click={handleToggle} {color} size="xs" {variant} disabled={Boolean(feedback)} />
			{#if showGeometry}
				{#if meta?.type === 'matrix-2d'}
					<Geometry2D
						id={`${id}-context-2d`}
						on:update={updateGeometry}
						threshold={breakpoint}
						geometry={context}
						canvasWidth={canvas.getBoundingClientRect().width}
						canvasHeight={canvas.getBoundingClientRect().height}
						disabled={state === 'pause'}
					/>
				{:else}
					<div class={`l:${layout}:${size} th:${threshold} maki:block lg context bg:${background}`}>
						{#if meta?.camera}
							<Camera
								id={`${id}-camera-3d`}
								bind:angle={cameraAngle}
								on:input={updateCamera}
								{color}
								size={`xs l:burrito:${threshold}`}
								disabled={state === 'pause'}
							/>
							<FieldOfView
								id={`${id}-fieldOfView`}
								bind:fieldOfView
								max={180}
								on:input={updateFieldOfView}
								{color}
								size={`xs l:burrito:${threshold}`}
								disabled={state === 'pause'}
							/>
						{:else if meta?.type === 'matrix-3d'}
							<FieldOfView
								id={`${id}-fieldOfView`}
								bind:fieldOfView
								max={180}
								on:input={updateFieldOfView}
								{color}
								size={`xs l:burrito:${threshold}`}
								disabled={state === 'pause'}
							/>
							<Geometry3D
								id={`${id}-context-3d`}
								on:update={updateGeometry}
								threshold={breakpoint}
								geometry={context}
								canvasWidth={canvas.getBoundingClientRect().width}
								canvasHeight={canvas.getBoundingClientRect().height}
								disabled={state === 'pause'}
							/>
						{:else if meta?.type === 'texture'}
							{#if meta?.channels}
								<ToggleMenu
									size="xs"
									layout="switcher"
									color="primary"
									variant="bare"
									items={meta.channels.map((c) => ({
										id: c,
										text: c,
										value: c,
										initial: c === filters.channels ? 'pressed' : undefined,
									}))}
									on:click={handleToggleChannel}
									disabled={state === 'pause'}
								/>
							{/if}
							{#if meta?.blur}
								<ToggleMenu
									size="xs"
									mode="check"
									layout="switcher"
									color="accent"
									variant="bare"
									items={meta.blur.map((b) => ({
										id: b,
										text: b,
										value: b,
										initial: b === filters.blur ? 'pressed' : undefined,
									}))}
									on:click={handleToggleBlur}
									disabled={state === 'pause'}
								/>
							{/if}
						{/if}
					</div>
				{/if}
			{/if}
		{/if}
	</aside>
</article>
