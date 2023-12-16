import type {Actions} from './$types'
import {fail, redirect} from '@sveltejs/kit'

import {constants, forms} from '@fat-fuzzy/ui'

const {DsStateUpdate, DsStylesUpdate, DsContextReveal} = forms
const {DEFAULT_STYLES, DEFAULT_DS_STATE, DEFAULT_REVEAL_STATE} = constants

export const actions = {
	toggleContext: async ({request, url, cookies}) => {
		const data = await request.formData()
		const serialized = cookies.get('fat-fuzzy-ui-context-reveal')
		let currentState = DEFAULT_REVEAL_STATE
		if (serialized) {
			currentState = JSON.parse(serialized)
		}
		let settingsReveal = new DsContextReveal(currentState)
		if (!settingsReveal.reveal(data)) {
			return fail(400, {settingsRevealError: true})
		}
		cookies.set('fat-fuzzy-ui-context-reveal', settingsReveal.toString(), {path: '/'})
		if (url.searchParams.has('redirectTo')) {
			const redirectTo = url.searchParams.get('redirectTo') ?? url.pathname
			throw redirect(303, redirectTo)
		}
		return {success: true}
	},

	updateStyles: async ({request, url, cookies}) => {
		const data = await request.formData()
		const serialized = cookies.get('fat-fuzzy-ui-styles')
		let currentStyles = DEFAULT_STYLES
		if (serialized) {
			currentStyles = JSON.parse(serialized)
		}
		const styles = new DsStylesUpdate(currentStyles)
		if (!styles.enter(data)) {
			return fail(400, {stylesError: true})
		}
		cookies.set('fat-fuzzy-ui-styles', styles.toString(), {path: '/'})
		if (url.searchParams.has('redirectTo')) {
			const redirectTo = url.searchParams.get('redirectTo') ?? url.pathname
			throw redirect(303, redirectTo)
		}

		return {success: true}
	},

	updateState: async ({request, url, cookies}) => {
		const data = await request.formData()
		const serialized = cookies.get('fat-fuzzy-ui-state')
		let currentState = DEFAULT_DS_STATE
		if (serialized) {
			currentState = JSON.parse(serialized)
		}
		const state = new DsStateUpdate(currentState)
		if (!state.enter(data)) {
			return fail(400, {stylesError: true})
		}
		cookies.set('fat-fuzzy-ui-state', state.toString(), {path: '/'})
		if (url.searchParams.has('redirectTo')) {
			const redirectTo = url.searchParams.get('redirectTo') ?? url.pathname
			throw redirect(303, redirectTo)
		}

		return {success: true}
	},

	restart: async ({cookies, url}) => {
		cookies.delete('fat-fuzzy-ui-styles', {path: '/'})
		cookies.delete('fat-fuzzy-ui-state', {path: '/'})
		cookies.delete('fat-fuzzy-ui-context-reveal', {path: '/'})
	},
} satisfies Actions
