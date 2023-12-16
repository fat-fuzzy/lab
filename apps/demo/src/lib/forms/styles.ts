import {api, constants} from '@fat-fuzzy/ui'

const {DEFAULT_REVEAL_STATE, DEFAULT_APP_SETTINGS} = constants

export class Styles {
	api
	settings
	contextReveal
	numberToClass: {[key: string]: string} = {
		// TODO: figure out a better way to map range number values to class strings
		'0': 'xs',
		'25': 'sm',
		'50': 'md',
		'75': 'lg',
		'100': 'xl',
	}

	/**
	 * Initialize default Styles object, then update styles from the user's cookie, if any
	 */
	constructor(styles = undefined) {
		this.api = api.stylesApi.initStyles()
		this.settings = DEFAULT_APP_SETTINGS
		this.contextReveal = DEFAULT_REVEAL_STATE
		if (styles) {
			this.api.applyStyles(styles)
			this.settings = this.api.app
		}
	}

	/**
	 * Update UI library styles based on inputs
	 */
	enter(data: FormData) {
		const styleValues = []

		// TODO: see how I can improve this

		for (const [key, value] of data) {
			let [category, family, style, _] = key.split('.')
			let styleValue = {[style]: value.toString()}

			// FIXES: allows to enter range number values mapped to class names with no JS on client
			// TODO: figure out generic way to map range number values to string labels
			if (this.numberToClass[String(value)]) {
				styleValue = {[style]: this.numberToClass[String(value)]}
			}
			const familyValue = {[family]: styleValue}
			// TODO: Fix / understand:
			// - for some reason, the only way to get values out of FormData is to push them into an array
			// - if I set {name, value} properties in `this.styles`, all other properties except the last one updated become unset
			//    (i.e. once out of this loop, the only property of `this.styles` is the last one set in the loop)
			styleValues.push({id: key, value: {[category]: familyValue}})
		}

		const styles = this.api.getStyleTree()
		styleValues.forEach(({id, value}) => {
			const [category, family, style, _] = id.split('.')
			styles[category][family][style] = value[category][family][style]
			if (style === 'brightness' || style === 'contrast') {
				this.settings[style] = value[category][family][style]
			}
		})
		this.api.applyStyles(styles)
		return true
	}

	/**
	 * Serialize Styles so it can be set as a cookie
	 */
	toString() {
		const styleTree = this.api.getStyleTree()
		return JSON.stringify(styleTree)
	}
}
