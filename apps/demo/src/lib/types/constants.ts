export type ButtonType = 'button' | 'submit' | 'reset' | null | undefined

export type Settings = {
	[key: string]: string
}

export type ButtonState = {
	[key: string]: {text: string; value: string; asset: string}
}

const DEFAULT_REVEAL_STATE: Settings = {reveal: 'minimize'}
const DEFAULT_APP_SETTINGS: Settings = {brightness: 'day', contrast: 'blend'}

const TRANSITION_REVEAL: {[key: string]: string} = {
	show: 'minimize',
	minimize: 'show',
}

const TRANSITION_BRIGHTNESS: {[key: string]: string} = {
	day: 'night',
	night: 'day',
}

const TRANSITION_CONTRAST: {[key: string]: string} = {
	contrast: 'blend',
	blend: 'contrast',
}

const ALIGN_OPPOSITE: {[key: string]: string} = {
	end: 'start',
	start: 'end',
}

const NUMBER_TO_SIZE: {[key: string]: string} = {
	// TODO: figure out a better way to map range number values to class strings
	'0': 'xs',
	'25': 'sm',
	'50': 'md',
	'75': 'lg',
	'100': 'xl',
}
/**
 * Indicates the direction that icons should point in when used to indicate direction of movement of the UI element under control
 */
const ALIGN_ANIMATION_DIRECTION: {[inactivePosition: string]: {[state: string]: string}} = {
	left: {show: 'down', minimize: 'left'},
	right: {show: 'down', minimize: 'right'},
	top: {show: 'down', minimize: 'up'},
	bottom: {show: 'up', minimize: 'down'},
}

const UI_STATE = {
	DEFAULT: 'default',
	FOCUS: 'focus',
	HOVER: 'hover',
	ACTIVE: 'active',
	SUCCESS: 'success',
	ERROR: 'error',
}

const themes = ['night', 'day']

const emojis: {[key: string]: string} = {
	lang: '🌐',
	day: '☀️',
	night: '🌙',
	'fr-fr': '🇫🇷 FR',
	'es-es': '🇪🇸 ES',
	'en-uk': '🇬🇧 EN',
}

const langEmojis: {[key: string]: string} = {
	'fr-fr': '🇫🇷 FR',
	'es-es': '🇪🇸 ES',
	'en-uk': '🇬🇧 EN',
}

const langMenuIcon = emojis['lang']
const languages = [
	{code: 'fr-fr', title: 'Français'},
	{code: 'en-uk', title: 'English'},
	{code: 'es-es', title: 'Español'},
]

// TODO: make svg css themeable / fix dark theme
import githubDay from '$lib/images/day/icon-github.svg'
import githubNight from '$lib/images/night/icon-github.svg'
// TODO: make svg css themeable / fix dark theme
const SVG_ASSETS: {[key: string]: {[key: string]: string}} = {
	day: {
		'link-github': githubDay,
		'button-theme': '☀️',
	},
	night: {'link-github': githubNight, 'button-theme': emojis.night},
}

export default {
	UI_STATE,
	DEFAULT_REVEAL_STATE,
	DEFAULT_APP_SETTINGS,
	TRANSITION_REVEAL,
	TRANSITION_BRIGHTNESS,
	TRANSITION_CONTRAST,
	ALIGN_OPPOSITE,
	ALIGN_ANIMATION_DIRECTION,
	NUMBER_TO_SIZE,
	SVG_ASSETS,
}
