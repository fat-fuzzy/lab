<script lang="ts">
	import type {ComponentType} from 'svelte'
	import type {StyleTree} from './types'
	import type {StylesApi} from '$lib/api/styles'

	import {onDestroy, getContext} from 'svelte'

	import * as ui from '$stores/ui'
	import {getFixtures} from '$lib/api/fixtures/js'

	export let title = ''
	export let isPage = false
	export let component: ComponentType
	export let props: any

	let color = ''
	let variant = ''
	let size = '' // element's own size
	let threshold = '' // element's own threshold
	let breakpoint = '' // element's own breakpoint
	let background = ''
	let content = ''
	let sideContent = ''
	let mainContent = ''
	let category = 'layouts'

	const stylesApi: StylesApi = getContext('stylesApi')
	let styles: StyleTree = stylesApi.getStyleTree()
	let settings = styles.app

	const stores = [
		ui.app.subscribe((value) => {
			if (value) {
				settings = {app: value}
			}
		}),
		ui.styles.subscribe((value) => {
			if (value) {
				styles = stylesApi.getStyleTree()
			}
		}),
	]

	// App options
	$: background = settings.app.contrast ?? background
	// Block options
	$: size = styles.blocks?.element?.size ?? size
	$: color = styles.blocks?.element?.color ?? color
	$: variant = styles.blocks?.element?.variant ?? variant
	// Layout options
	$: breakpoint = styles.layouts?.layout.breakpoint ?? breakpoint
	$: threshold = styles.layouts?.layout.threshold ?? threshold
	// Content options
	// $: content = styles.layouts?.content.content ?? 'card'
	// $: sideContent = styles.layouts?.content.side ?? 'card'
	// $: mainContent = styles.layouts?.content.main ?? 'text'
	$: content = 'card'
	$: sideContent = 'card'
	$: mainContent = 'text'
	$: contentStyles = `card:${size} box ${size} bg:highlight:lightest`

	onDestroy(() => {
		stores.forEach((unsubscribe) => unsubscribe())
	})
</script>

{#if isPage}
	{#if title === 'Sidebar'}
		<svelte:component this={component} id={title} {size} {background} {props}>
			<div slot="side">
				{@const fixtureProps = getFixtures({category, component: title})}
				{#if sideContent === 'text'}
					<p>{fixtureProps.text}</p>
				{:else if sideContent === 'card' || sideContent === 'form'}
					{#each fixtureProps[sideContent] as item}
						<div class={contentStyles}>{item}</div>
					{/each}
				{/if}
			</div>
			<div slot="main">
				{@const fixtureProps = getFixtures({category, component: title})}
				{#if mainContent === 'text'}
					<p>{fixtureProps.text}</p>
				{:else if mainContent === 'card' || mainContent === 'form'}
					{#each fixtureProps[mainContent] as item}
						<div class={contentStyles}>{item}</div>
					{/each}
				{/if}
			</div>
		</svelte:component>
	{:else if title === 'Reveal' || title === 'RevealAuto' || title === 'Burrito'}
		<svelte:component
			this={component}
			id={title}
			{color}
			{variant}
			{size}
			{background}
			{breakpoint}
			{props}
		>
			<div slot="content">
				{@const fixtureProps = getFixtures({category, component: title})}
				{#if content === 'text'}
					<p>{fixtureProps.text}</p>
				{:else if content === 'card' || content === 'form'}
					{#each fixtureProps[content] as item}
						<div class={contentStyles}>{item}</div>
					{/each}
				{/if}
			</div>
		</svelte:component>
	{:else}
		<svelte:component
			this={component}
			id={title}
			{size}
			{background}
			{breakpoint}
			{threshold}
			{props}
		>
			{@const fixtureProps = getFixtures({category, component: title})}
			{#if content === 'text'}
				<p>{fixtureProps.text}</p>
			{:else if content === 'card' || content === 'form'}
				{#each fixtureProps[content] as item}
					<div class={contentStyles}>{item}</div>
				{/each}
			{/if}
		</svelte:component>
	{/if}
{:else}
	{@const fixtureProps = getFixtures({category, component: title})}
	{#if title === 'Sidebar'}
		<svelte:component this={component} id={title} {size} {background} {...props}>
			<div slot="side">
				{#each fixtureProps.card as item}
					<div class={contentStyles}>{item}</div>
				{/each}
			</div>
			<div slot="main">
				<p>{fixtureProps.text}</p>
			</div>
		</svelte:component>
	{:else if title === 'Reveal' || title === 'RevealAuto' || title === 'Burrito'}
		<svelte:component
			this={component}
			id={title}
			{color}
			{variant}
			{size}
			{background}
			{breakpoint}
			{...props}
		>
			<svelte:fragment slot="content">
				{#each fixtureProps.form as item}
					<div class={contentStyles}>{item}</div>
				{/each}
			</svelte:fragment>
		</svelte:component>
	{:else}
		<svelte:component
			this={component}
			id={title}
			{size}
			{background}
			{breakpoint}
			{threshold}
			{...props}
		>
			{#each fixtureProps.card as item}
				<div class={contentStyles}>{item}</div>
			{/each}
		</svelte:component>
	{/if}
{/if}
