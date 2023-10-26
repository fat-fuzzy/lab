<script lang="ts">
	import type {ComponentType} from 'svelte'
	import type {StyleTree} from './types'

	import format from '$lib/utils/format'
	import ToggleMenu from '$lib/components/compositions/menus/ToggleMenu.svelte'
	import Fieldset from '$lib/components/blocks/forms/Fieldset.svelte'
	import InputRadio from '$lib/components/blocks/forms/InputRadio.svelte'
	import InputCheck from '$lib/components/blocks/forms/InputCheck.svelte'
	import {initStyles} from './styles-api'
	import {currentStyles} from '$lib/stores/api'

	export let title = ''
	export let category = 'app'
	export let page = ''

	let styles: StyleTree
	let apiSize = 'xs'
	let apiVariant = ''

	let styleCategories = [category]
	let stylesApi = initStyles()
	let formOptions = stylesApi.getFormOptions(styleCategories)
	export let options = formOptions[0]
	let fieldsetClass = ''

	const COMPONENT_IMPORTS: {[input: string]: ComponentType} = {
		radio: InputRadio,
		checkbox: InputCheck,
		toggle: ToggleMenu,
	}

	const updateStyles = (payload: {name: string; items: {id: string; value: string}[]}) => {
		payload.items.forEach(({id, value}) => {
			const [category, family, style, name] = id.split('.')
			const styleValue = {[style]: value}
			const familyValue = {[family]: styleValue}
			styles[category] = {...styles[category], ...familyValue}
		})
		stylesApi.applyStyles(styles)
		currentStyles.set(stylesApi.getStyleTree()) // This updates on the client if JS is available
	}

	function handleInput(event, name: string) {
		const payload = {
			name,
			items: [
				{
					id: event.target.id,
					name: event.target.name.toLowerCase(),
					value: event.target.value,
				},
			],
		}
		updateStyles(payload)
	}

	function handleSelect(event, familyName: string, name: string, id: string) {
		// TODO: reject input if it's not in values list -> form validation /!\
		const payload = {
			name: familyName.toLowerCase(),
			items: [
				{
					id,
					name: name.toLowerCase(),
					value: event.target.value,
				},
			],
		}
		updateStyles(payload)
	}

	function handleToggle(event: CustomEvent, familyName: string, id: string) {
		const selected = event.detail.selected // TODO: no multiple values for no
		if (selected.length) {
			const payload = {
				name: familyName,
				items: [
					{
						id,
						value: selected[0].pressed ? selected[0].value : '',
					},
				],
			}
			updateStyles(payload)
		}
	}

	$: {
		styles = $currentStyles
		styles && stylesApi.applyStyles(styles)
		styleCategories = category === 'app' ? ['app'] : [category, 'shared']
		formOptions = stylesApi.getFormOptions(styleCategories)
		options = formOptions[0]
		fieldsetClass = category === 'app' ? 'bare' : 'box '
	}
	/**
	 * Trigger form logic in response to a keydown event, so that
	 * desktop users can use the keyboard
	 */
	function keydown(event: KeyboardEvent) {
		if (event.metaKey) return

		document
			.querySelector(`[data-key="${event.key}" i]`)
			?.dispatchEvent(new MouseEvent('click', {cancelable: true}))
	}
</script>

<svelte:window on:keydown={keydown} />

{#each Object.keys(options) as familyName}
	{@const styleFamily = options[familyName]}

	{#if styleFamily.canApplyStyles({item: title, category})}
		<Fieldset
			legend={styleFamily.title}
			id={styleFamily.id}
			type={`input-group ${fieldsetClass}`}
			layout={styleFamily.layout}
			container={`${styleFamily.container}`}
			size={styleFamily.size}
			name={familyName}
		>
			{#each styleFamily.items as styleInput}
				{@const {input, value, items} = styleInput}
				{#if styleInput.canApplyStyles({item: title, category})}
					{#if input === 'radio' || input === 'checkbox'}
						{@const InputComponent = COMPONENT_IMPORTS[input]}
						{#each items as { id, ...inputProps }}
							{@const checked = value && id === value}
							<svelte:component
								this={InputComponent}
								id={styleInput.id}
								{...inputProps}
								name={styleInput.id}
								{checked}
								layout={styleInput.layout || ''}
								variant={apiVariant || ''}
								size={apiSize || ''}
								on:input={(event) => handleInput(event, familyName)}
							/>
						{/each}
					{/if}
					{#if input === 'toggle'}
						{@const updatedItems = items.map((i) => {
							const pressed = value !== '' && i.value === value
							const updatedItem = {
								...i,
								text: i.text || '',
								asset: i.asset || '',
								initial: pressed,
								name: i.id,
							}
							return updatedItem
						})}
						<ToggleMenu
							id={styleInput.id}
							title={styleInput.name !== familyName ? styleInput.name : ''}
							items={updatedItems}
							{page}
							layout={styleInput.layout || ''}
							size={apiSize || ''}
							on:click={(event) => handleToggle(event, familyName, styleInput.id)}
						/>
					{/if}
					{#if input === 'datalist'}
						<label for={`choice-${styleInput.name}`} class={`l:stack ${apiSize} font:${apiSize}`}>
							{`Select ${styleInput.name}`}
							<input
								list={`datalist-${styleInput.name}`}
								id={`choice-${styleInput.name}`}
								name={styleInput.id}
								class={apiSize}
								on:input={(event) =>
									handleSelect(event, familyName, styleInput.name, styleInput.id)}
							/>
							<datalist id={`datalist-${styleInput.name}`}>
								{#each items as { id, text, asset }}
									<option {id} value={asset}>
										{format.formatLabel(text || '', asset)}
									</option>
								{/each}
							</datalist>
						</label>
					{/if}
				{/if}
			{/each}
		</Fieldset>
	{/if}
{/each}