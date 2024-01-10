<script lang="ts">
	import {onDestroy, createEventDispatcher} from 'svelte'
	import {enhance} from '$app/forms'
	import constants from '$lib/types/constants'
	import {clickOutside} from '$lib/utils/click-outside.js'

	import Button from '$lib/components/blocks/buttons/Button.svelte'
	import Expand from '$lib/components/blocks/buttons/Expand.svelte'

	import * as ui from '$stores/ui'

	const {ALIGN_OPPOSITE, ALIGN_ANIMATION_DIRECTION} = constants

	const dispatch = createEventDispatcher()
	export let layout = 'stack'
	export let container = 'card'
	export let size = ''
	export let threshold = ''
	export let variant = ''
	export let height = ''
	export let color = ''
	export let background = ''
	export let id = 'ui'
	export let title = 'RevealMenu'
	export let name = 'reveal-menu'
	export let align = 'start'
	export let place = 'left'
	export let value = 'minimize' // TODO: get value from page data
	export let position: string | undefined = undefined
	export let formaction: string | undefined = undefined
	export let actionPath: string | undefined = undefined
	export let redirect: string | undefined = undefined
	export let disabled = false

	export let items: any = []

	let menuReveal: {[key: string]: string} = {reveal: value}

	function handleClickOutside(event) {
		// expanded = false
		// TODO : fix this
	}

	const stores = [
		ui.menuReveal.subscribe((value) => {
			if (value) {
				menuReveal = value
			}
		}),
	]

	function toggleMenu(event: CustomEvent) {
		const updated = event.detail.expanded ? 'show' : 'minimize'
		ui.menuReveal.set({reveal: updated})
	}

	let clicked = ''
	let innerVariant = ''

	// Override this function to override menu button actions
	export let onClick = (event) => {
		dispatch('click', {
			clicked,
		})
	}
	const VARIANT_MATCH: {[key: string]: string} = {
		outline: 'bare',
		bare: 'bare',
		default: 'outline',
	}

	$: reveal = menuReveal.reveal
	$: buttonAlign = place ? ALIGN_OPPOSITE[align] : ''
	$: animationDirection = place ? ALIGN_ANIMATION_DIRECTION[place][reveal] : ''
	$: show = reveal ? `show ${place}` : `minimize ${place}`
	$: setHeight = height ? ` h:${height}` : ''
	$: innerVariant = VARIANT_MATCH[variant]
	$: layoutClasses = position
		? `l:reveal ${position} ${place} ${reveal}`
		: `l:reveal ${place} ${reveal}`
	$: action = formaction && redirect ? `${formaction}&redirectTo=${redirect}` : formaction

	onDestroy(() => {
		stores.forEach((unsubscribe) => unsubscribe())
	})
</script>

<form
	method="post"
	class={layoutClasses}
	action={action && actionPath ? `${actionPath}?/${action}` : `?/${action}`}
	use:enhance={() => {
		// prevent default callback from resetting the form
		return ({update}) => {
			update({reset: false})
		}
	}}
	use:clickOutside
	on:clickOutside={handleClickOutside}
>
	<Expand
		id={`button-expand-${id}`}
		{variant}
		{title}
		{size}
		{color}
		name={`button-${name}`}
		align={buttonAlign}
		controls={`menu-${id}`}
		value={title}
		states={{
			active: {text: title, value: 'show', asset: `emoji:point-${animationDirection}`},
			inactive: {text: title, value: 'minimize', asset: `emoji:point-${animationDirection}`},
		}}
		on:click={toggleMenu}
	>
		{title}
	</Expand>
	<menu
		id={`menu-${id}`}
		class={`content l:${layout}:${size} ${container}:${size} th:${threshold} layer bg:${background} card:${size} align:${align} ${size}`}
	>
		{#each items as buttonProps}
			<li>
				<Button {onClick} {...buttonProps} variant={innerVariant} {color} {disabled} />
			</li>
		{/each}
	</menu>
</form>
