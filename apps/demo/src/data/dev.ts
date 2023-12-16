import markdownUtils from './markdown'

const pathPrefix = '/src/assets/dev/'

const imports = import.meta.glob('/src/assets/dev/*.md')

async function fetchMarkdowns() {
	const markdowns = await markdownUtils.fetchMarkdowns(pathPrefix, imports)
	return markdowns.sort(markdownUtils.sortByIdDesc)
}

export default {fetchMarkdowns}
