import type {LayoutServerLoad} from './$types'
import markdownData from '$data/log'

export const load: LayoutServerLoad = async () => {
	const markdowns = await markdownData.fetchMarkdowns()

	return {markdowns}
}
