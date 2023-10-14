export default {
	links: [
		{slug: '', title: 'Home'},
		{slug: 'about', title: 'About'},
	],
	linksNested: [
		{
			slug: 'ui',
			title: 'RevealNav Example',
			items: [
				{
					slug: 'blocks',
					title: 'Block',
					items: [
						{slug: 'nav', title: 'Nav'},
						{slug: 'reveal-nav', title: 'RevealNav'},
					],
				},
				{
					slug: 'layouts',
					title: 'Layouts',
					items: [
						{slug: 'burrito', title: 'Burrito'},
						{slug: 'stack', title: 'Stack'},
					],
				},
			],
		},
	],
}
