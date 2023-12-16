import type {LayoutServerLoad} from './$types'

export const load = (async (event) => {
	let styles = {}
	let settings = {}
	let app = {}
	if (event.locals.styles) {
		styles = JSON.parse(event.locals.styles)
	}
	if (event.locals.settings) {
		settings = JSON.parse(event.locals.settings)
	}
	if (event.locals.app) {
		app = JSON.parse(event.locals.app)
	}

	return {styles, settings, app}
}) satisfies LayoutServerLoad
