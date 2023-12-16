import type {LayoutServerLoad} from './$types'
import markdownData from '$data/dev'

export const load: LayoutServerLoad = async () => {
	const markdowns = await markdownData.fetchMarkdowns()

	return {markdowns}
}
