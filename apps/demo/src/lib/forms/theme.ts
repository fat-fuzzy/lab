type AppSettings = {
	[key: string]: string
}

export class Theme {
	settings: AppSettings

	constructor({brightness, contrast}: AppSettings) {
		this.settings = {brightness, contrast}
	}

	/**
	 * Update Settings based on inputs
	 */
	enter(data: FormData) {
		for (const [key, value] of data) {
			this.settings[key] = value.toString()
		}
	}

	/**
	 * Serialize Settings so it can be set as a cookie
	 */
	toString() {
		return JSON.stringify(this.settings)
	}
}
