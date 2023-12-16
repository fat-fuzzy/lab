export const links = [
	{slug: 'about', title: 'About'},
	{slug: 'dev', title: 'Dev'},
	{slug: 'ui', title: 'UI'},
	{slug: 'log', title: 'Log'},
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
				active: {text: 'night', value: 'night', asset: 'emoji:night'},
				inactive: {text: 'day', value: 'day', asset: 'emoji:day'},
			},
		},
		// {
		// 	id: 'contrast',
		// 	name: 'contrast',
		// 	title: 'Contrast',
		// 	variant: 'outline',
		// 	shape: 'round',
		// 	color: 'primary',
		// 	size: 'md',
		// 	states: {
		// 		active: {text: 'contrast', value: 'contrast', asset: 'emoji:contrast'},
		// 		inactive: {text: 'blend', value: 'blend', asset: 'emoji:blend'},
		// 	},
		// },
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
