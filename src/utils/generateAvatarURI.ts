export const generateAvatarURI = async () => {
	const { createAvatar } = await import('@dicebear/core')
	const { botttsNeutral } = await import('@dicebear/collection')

	const seeds = [
		'Ryker',
		'Destiny',
		'Jude',
		'Kingston',
		'Brooklynn',
		'Robert',
		'Jade',
		'Jocelyn',
		'Sarah',
		'Christopher',
		'Valentina',
		'Leo',
		'Andrea',
		'Sawyer',
		'Katherine',
		'Jessica',
		'George',
		'Christian',
		'Luis',
		'Liam',
	]
	const avatar = createAvatar(botttsNeutral, {
		seed: seeds[Math.floor(Math.random() * seeds.length)],
		rotate: 350,
		radius: 50,
		backgroundColor: ['3949ab', '5e35b1', 'd81b60', 'ffd5dc', 'c0aede', '8e24aa', '1e88e5'],
		backgroundType: ['gradientLinear'],
		randomizeIds: true,
	})

	const svg = avatar.toDataUri()

	return svg
}
