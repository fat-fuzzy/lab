const links = [
	{slug: '', title: 'Home'},
	{slug: 'about', title: 'About'},
]

const nav = [
	{
		slug: 'ui',
		title: 'UI LIbrary Link - RevealNav Example',
		items: [
			{
				slug: 'blocks',
				title: 'Blocks Link 1',
				items: [
					{slug: 'item-1-a', title: 'RevealNav Item  1 A'},
					{slug: 'item-2-b', title: 'RevealNav Item  1 B'},
				],
			},
			{
				slug: 'blocks',
				title: 'Blocks Link 2',
			},
			{
				slug: 'blocks',
				title: 'Blocks Link 3',
				items: [
					{slug: 'item-2-a', title: 'RevealNav Item 2 A'},
					{slug: 'item-2-b', title: 'RevealNav Item 2 B'},
				],
			},
			{
				slug: 'blocks',
				title: 'Blocks Link 4',
			},
		],
	},
]

const menu = [
	{id: 'btn-1', label: 'Button 1', type: 'button', variant: '', icon: '💡'},
	{id: 'btn-2', label: 'Button 2', type: 'button', variant: '', icon: '🦁'},
	{id: 'btn-3', label: 'Button 3', type: 'button', variant: '', icon: '❤️'},
]

const toggle = [
	{id: 'toggle-1', label: 'Toggle 1'},
	{id: 'toggle-2', label: 'Toggle 2'},
	{id: 'toggle-3', label: 'Toggle 3'},
]

const card = ['Card content 1', 'Card content item 2', 'Card content item 3']
const form = ['Form item 1', 'Form item 2', 'Form item 3']
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
	menu,
	toggle,
	card,
	form,
	text,
	sketch,
}
