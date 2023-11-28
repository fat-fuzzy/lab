import markdownUtils from './markdown'

const categoryPrefix = '/src/assets/doc/'
const blocksPathPrefix = '/src/assets/doc/blocks/'

// const tokens = import.meta.glob('/src/assets/doc/blocks/*.md')
const categoryImports = import.meta.glob('/src/assets/doc/*.md')
const blocksImports = import.meta.glob('/src/assets/doc/blocks/*.md')
// const layouts = import.meta.glob('/src/assets/doc/blocks/*.md')
// const compositions = import.meta.glob('/src/assets/doc/blocks/*.md')

async function fetchMarkdowns() {
	const [categories, blocks] = await Promise.all([
		markdownUtils.importMarkdowns(categoryPrefix, categoryImports),
		markdownUtils.importMarkdowns(blocksPathPrefix, blocksImports),
	])
	return {
		categories: categories.sort(markdownUtils.sortByTitleDesc),
		blocks: blocks.sort(markdownUtils.sortByTitleDesc),
	}
}

export default {fetchMarkdowns}
