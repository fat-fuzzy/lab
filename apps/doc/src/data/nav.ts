export const links = [
	{slug: 'about', title: 'About', layout: 'center'},
	{slug: 'dev', title: 'Dev', layout: 'sidebar'},
	{slug: 'ui', title: 'UI', layout: 'sidebar'},
	{slug: 'log', title: 'Log', layout: 'sidebar'},
]

export const itemsSettings = {
	switch: [
		{
			id: 'brightness',
			name: 'brightness',
			title: 'Brightness',
			variant: 'outline',
			shape: 'round',
			color: 'primary',
			size: 'md',
			states: {
				active: {
					id: 'app.brightness.night',
					text: 'night',
					value: 'night',
					asset: 'emoji:night',
				},
				inactive: {
					id: 'app.brightness.day',
					text: 'day',
					value: 'day',
					asset: 'emoji:day',
					initial: 'pressed',
				},
			},
		},
		{
			id: 'contrast',
			name: 'contrast',
			title: 'Contrast',
			variant: 'outline',
			shape: 'round',
			color: 'primary',
			size: 'md',
			states: {
				active: {
					id: 'app.contrast.contrast',
					text: 'contrast',
					value: 'contrast',
					asset: 'emoji:contrast',
				},
				inactive: {
					id: 'app.contrast.blend',
					text: 'blend',
					value: 'blend',
					asset: 'emoji:blend',
					initial: 'pressed',
				},
			},
		},
	],
	links: [
		{
			id: 'link-github',
			title: 'GitHub icon',
			url: 'https://github.com/fat-fuzzy/rocks',
			asset: 'svg:icon-github',
			shape: 'round',
			size: 'xs',
		},
	],
}
