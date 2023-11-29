<script lang="ts">
	import {onDestroy} from 'svelte'
	import {enhance} from '$app/forms'

	import {clickOutside} from '$lib/utils/click-outside.js'
	import Expand from '$lib/components/blocks/buttons/Expand.svelte'
	import Switch from '$lib/components/blocks/buttons/Switch.svelte'

	import * as settings from '$lib/stores/settings'
	import {assets} from '$types/constants.js'

	const method = 'POST'
	export let breakpoint = 'xs'
	export let background: string | undefined = undefined
	export let id = 'menu-settings'
	export let size = ''
	export let color = ''
	export let variant = 'outline'
	export let layout = 'side'
	export let align = 'end'
	export let path: string | undefined = undefined

	export let items = {
		toggle: [
			// {
			// 	id: 'menu-lang',
			// 	title: 'Lang',
			// 	asset: langMenuIcon,
			// 	type: 'emoji',
			// 	// TODO: figure out a better way to [name / deal with] submenu items - see LinkList component
			// 	subitems: languages.map((l) => ({
			// 		id: l.code,
			// 		title: l.title,
			// 		action: setLanguage,
			// 		asset: langEmojis[l.code],
			// 		type: 'emoji',
			// 	})),
			// },
		],
	}

	let appLanguage: {[key: string]: string} = {brightness: '', contrast: ''}
	let settingsReveal: {[key: string]: string} = {reveal: ''}

	const stores = [
		settings.app.subscribe((value) => {
			if (value) {
				appLanguage = value
			}
		}),
		settings.settingsReveal.subscribe((value) => {
			if (value) {
				settingsReveal = value
			}
		}),
	]

	function handleClickOutsideSettings() {
		settings.settingsReveal.set({reveal: 'minimize'})
	}

	function handleToggle(event: CustomEvent) {
		const updated = event.detail.expanded ? 'show' : 'minimize'
		settings.settingsReveal.set({reveal: updated})
	}

	function handleUpdate(event: CustomEvent) {
		let updated
		switch (event.detail.id) {
			case 'contrast':
				updated = event.detail.pressed ? 'contrast' : 'blend'
				settings.app.set({brightness: appLanguage.brightness, contrast: updated})
				break
			case 'brightness':
				updated = event.detail.pressed ? 'night' : 'day'
				settings.app.set({brightness: updated, contrast: appLanguage.contrast})
				break
			default:
				break
		}
	}

	onDestroy(() => {
		stores.forEach((unsubscribe) => unsubscribe())
	})

	$: reveal = settingsReveal.settingsReveal
	$: brightness = appLanguage.brightness
	$: showBackground = background ? `bg:${background}` : 'bg:inherit'
	$: show = `show ${showBackground}`
	$: showSettings = reveal === 'show' ? show : 'hide:viz-only'
	$: revealClasses = `form:expand`
	$: formClasses = `l:switcher:lg ${showBackground} card:lg`
	$: layoutClass = layout ? `l:${layout}:${size}` : ''
	$: layoutClasses = `${layoutClass} l:reveal:auto bp:${breakpoint} ${size} align:${align}`
</script>

<div class={layoutClasses} use:clickOutside on:clickOutside={handleClickOutsideSettings}>
	<form
		name="settings-reveal"
		{method}
		action={`/?/toggleSettings&redirectTo=${path}`}
		use:enhance={() => {
			// prevent default callback from resetting the form
			return ({update}) => {
				update({reset: false})
			}
		}}
		class={revealClasses}
	>
		<Expand
			id={`${id}-settings-button`}
			{variant}
			{color}
			{size}
			title="Settings"
			name="reveal"
			controls={`reveal-${id}`}
			value={settingsReveal[id]}
			states={{
				active: {text: 'settings', value: 'show', asset: 'emoji:settings'},
				inactive: {text: 'settings', value: 'minimize', asset: 'emoji:settings'},
			}}
			on:click={handleToggle}
		>
			Settings
		</Expand>
	</form>
	<div id={`reveal-${id}`} class={`${showSettings} l:flex`}>
		<form
			name="settings-update"
			{method}
			action={`/?/updateSettings&redirectTo=${path}`}
			use:enhance={() => {
				// prevent default callback from resetting the form
				return ({update}) => {
					update({reset: false})
				}
			}}
			class={formClasses}
		>
			{#each items.switch as { id, name, title, variant, shape, color, size, states }}
				<Switch
					{id}
					{name}
					{title}
					{variant}
					{shape}
					{color}
					{size}
					asset={`emoji:${appLanguage[id]}`}
					value={appLanguage[id]}
					{states}
					on:click={handleUpdate}
				/>
			{/each}
		</form>
		<menu class={`maki:xl`}>
			{#each items.links as { id, title, url, shape, size, asset }}
				{@const assetValue = assets[brightness] ? assets[brightness][id] : ''}
				<li>
					<a
						class={`${variant} font:${size} ${shape} ${color}`}
						href={url}
						target="_blank"
						rel="noreferrer"
					>
						<!---TODO: Manage svg assets as SVGs -->
						<img src={assetValue} alt={title} class={`${id} ${asset}`} />
					</a>
				</li>
			{/each}
		</menu>
	</div>
</div>
