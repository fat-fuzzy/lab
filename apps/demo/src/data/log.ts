import markdownUtils from './markdown'

const pathPrefix = '/src/assets/log/'

const imports = import.meta.glob('/src/assets/log/*.md')

async function fetchMarkdowns() {
	const markdowns = await markdownUtils.fetchMarkdowns(pathPrefix, imports)
	return markdowns.sort(markdownUtils.sortByIdDesc)
}

export default {fetchMarkdowns}
