import type {LayoutServerLoad} from './$types'
import markdownData from '$data/doc'

export const load = (async (event) => {
	let styles = null
	let context = null
	let state = null
	let sidebar = null

	if (event.locals.dsStyles) {
		styles = JSON.parse(event.locals.dsStyles)
	}
	if (event.locals.dsContext) {
		context = JSON.parse(event.locals.dsContext)
	}
	if (event.locals.dsState) {
		state = JSON.parse(event.locals.dsState)
	}
	if (event.locals.sidebar) {
		sidebar = JSON.parse(event.locals.sidebar)
	}
	const markdowns = await markdownData.fetchMarkdowns()

	return {sidebar, styles, context, state, markdowns}
}) satisfies LayoutServerLoad
