const links = [
	{slug: '', title: 'Home'},
	{slug: 'about', title: 'About'},
]

const nav = [
	{
		slug: 'ui',
		title: 'RevealNav Example',
		items: [
			{
				slug: 'design-tokens',
				title: 'Design Tokens',
			},
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
]

const button = {id: 'idea', text: 'Idea', type: 'button', variant: '', emoji: '💡'}

const toggle = {id: 'favorite', text: 'Favorite', type: 'button', variant: '', emoji: '❤️'}

const menu = [
	{id: 'invader', text: 'Invader', asset: '👾'},
	{id: 'ally', text: 'Ally', asset: '🐙'},
	{id: 'player', text: 'Player', asset: '🐳'},
]

const toggleMenu = [
	{id: 'idea', text: 'Idea', type: 'button', asset: '💡'},
	{id: 'user', text: 'User', type: 'button', asset: '🦁'},
	{id: 'favorite', text: 'Favorite', type: 'button', asset: '❤️'},
]

const radio = [
	{id: 'radio-1', label: 'Radio 1'},
	{id: 'radio-2', label: 'Radio 2'},
	{id: 'radio-3', label: 'Radio 3'},
]

const checkbox = [
	{id: 'check-1', label: 'Checkbox 1'},
	{id: 'check-2', label: 'Checkbox 2'},
	{id: 'check-3', label: 'Checkbox 3'},
]

const card = ['Card 1', 'Card 2', 'Card 3']
const form = ['Form input 1', 'Form input 2', 'Form input 3']
const text =
	'But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure. To take a trivial example, which of us ever undertakes laborious physical exercise, except to obtain some advantage from it? But who has any right to find fault with a man who chooses to enjoy a pleasure that has no annoying consequences, or one who avoids a pain that produces no resultant pleasure?But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure. To take a trivial example, which of us ever undertakes laborious physical exercise, except to obtain some advantage from it? But who has any right to find fault with a man who chooses to enjoy a pleasure that has no annoying consequences, or one who avoids a pain that produces no resultant pleasure?' // TODO: lorem ipsum

const sketch = {
	id: '004',
	slug: 'geometry-2d',
	title: 'Geometry 2D ',
	emoji: '📐',
}

export default {
	links,
	nav,
	button,
	menu,
	toggle,
	toggleMenu,
	radio,
	checkbox,
	card,
	form,
	text,
	sketch,
}
