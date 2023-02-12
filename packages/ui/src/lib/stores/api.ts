import {writable} from 'svelte/store'
import {DEFAULT_STYLES} from '../api/style-api'

// Initial values

export const categoryStore = writable('app')
// Selected values
// TODO: figure out how I can deduct props from Svelte component

export const selectedStore = writable(DEFAULT_STYLES)
