<script lang="ts">
	import {createEventDispatcher} from 'svelte'
	import Button from '$lib/components/blocks/buttons/Button.svelte'

	const dispatch = createEventDispatcher()
	export let id = 'button-menu'
	export let title = ''
	export let size = ''
	export let threshold = ''
	export let layout = 'switcher'
	export let container = ''
	export let color = ''
	export let variant = ''
	export let asset = ''
	export let formaction: string | undefined = undefined
	export let items: any = [] // TODO Fix type
	export let disabled = false

	const onClick = (event: CustomEvent) => {
		dispatch('click', event.detail)
	}
	$: type = formaction ? 'submit' : 'button'
</script>

{#if title}
	<div class={`menu l:stack:${size}`}>
		<p>{title}</p>
		<menu {id} class={`l:${layout}:${size} ${container}:${size} th:${threshold} ${size}`}>
			{#each items as props, i}
				{@const itemColor = props.color ?? color}
				{@const itemVariant = props.variant ?? variant}
				{@const itemSize = props.size ?? size}
				{@const itemAsset = props.asset ?? asset}
				<li>
					<Button
						on:click={onClick}
						{type}
						{formaction}
						{...props}
						color={itemColor}
						variant={itemVariant}
						size={itemSize}
						asset={itemAsset}
						{disabled}
					/>
				</li>
			{/each}
		</menu>
	</div>
{:else}
	<menu {id} class={`l:${layout}:${size} ${container}:${size} th:${threshold} ${size}`}>
		{#each items as props, i}
			{@const itemColor = props.color ?? color}
			{@const itemVariant = props.variant ?? variant}
			{@const itemSize = props.size ?? size}
			{@const itemAsset = props.asset ?? asset}
			<li>
				<Button
					on:click={onClick}
					{type}
					{formaction}
					{...props}
					color={itemColor}
					variant={itemVariant}
					size={itemSize}
					asset={itemAsset}
					{disabled}
				/>
			</li>
		{/each}
	</menu>
{/if}
