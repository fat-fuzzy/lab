<script lang="ts">
	import Toggle from '$lib/components/blocks/buttons/Toggle.svelte'
	import {createEventDispatcher} from 'svelte'

	const dispatch = createEventDispatcher()

	export let id = 'toggle-menu'
	export let title = ''
	export let size = ''
	export let threshold = ''
	export let layout = 'switcher'
	export let container = ''
	export let color = ''
	export let variant = ''
	export let asset = ''
	export let shape = ''
	export let mode = 'radio'
	export let formaction: string | undefined = undefined
	export let items: any = [] // TODO fix types
	export let disabled = false

	let selected: {
		id: string
		value: string
		pressed: boolean
		name: string
		send: (event: string) => unknown
	}[] = []

	const onClick = (event: CustomEvent) => {
		let toggleValue = selected.find((c) => {
			c.name === event.detail.id
		})
		switch (mode) {
			case 'multiple':
				if (event.detail.pressed) {
					selected = [...selected, event.detail]
				} else {
					selected = selected.filter((c) => c.name !== event.detail.id)
				}
				break
			case 'radio':
				if (event.detail.pressed) {
					if (toggleValue) {
						selected = [toggleValue]
					}
					selected.map((c) => {
						if (c.name !== event.detail.id && c.pressed) {
							c.send('TOGGLE')
						}
					})
				}
				selected = [event.detail]
				break
			case 'check':
				if (event.detail.pressed) {
					selected.map((c) => {
						if (c.name === event.detail.id) {
							c.send('TOGGLE')
						}
						if (c.name !== event.detail.id && c.pressed) {
							c.send('TOGGLE')
						}
					})
				}
				selected = [event.detail]
				break
			default:
				break
		}

		dispatch('click', {
			selected,
		})
	}

	$: type = formaction ? 'submit' : 'button'
	$: containerClass = container ? `${container}:${size}` : ''
</script>

{#if title}
	<div class={`menu l:stack ${size} ${containerClass}`}>
		<p>{title}</p>
		<menu {id} class={`l:${layout}:${size} th:${threshold} ${size} mode:${mode}`}>
			{#each items as props}
				<li>
					<Toggle
						id={`${id}-${props.id}`}
						on:click={onClick}
						{type}
						{formaction}
						{...props}
						color={props.color ?? color}
						variant={props.variant ?? variant}
						size={props.size ?? size}
						shape={props.shape ?? shape}
						asset={props.asset ?? asset}
						disabled={disabled ||
						(mode === 'radio' && selected[0] && selected[0].value === props.value)
							? true
							: false}
					/>
				</li>
			{/each}
		</menu>
	</div>
{:else}
	<menu {id} class={`l:${layout}:${size} ${containerClass} th:${threshold} ${size} mode:${mode}`}>
		{#each items as props}
			<li>
				<Toggle
					id={`${id}-${props.id}`}
					on:click={onClick}
					{type}
					{formaction}
					{...props}
					color={props.color ?? color}
					variant={props.variant ?? variant}
					size={props.size ?? size}
					shape={props.shape ?? shape}
					asset={props.asset ?? asset}
					disabled={disabled ||
					(mode === 'radio' && selected[0] && selected[0].value === props.value)
						? true
						: false}
				/>
			</li>
		{/each}
	</menu>
{/if}
