import { registerEnumType } from '@nestjs/graphql'

export enum EStemType {
	DRUMS = 'drums',
	PERCUSSION = 'percussion',
	BASS = 'bass',
	CHORDS = 'chords',
	MELODY = 'melody',
	VOCALS = 'vocals',
	COMBO = 'combo',
	OTHER = 'other',
}

registerEnumType(EStemType, {
	name: 'StemType',
	description: 'The type of stem in a musical composition.',
	valuesMap: {
		DRUMS: {
			description: 'Drum instruments such as kick, snare, and hi-hat.',
		},
		PERCUSSION: {
			description: 'Percussion instruments such as shakers and cymbals.',
		},
		BASS: {
			description: 'Bass instruments providing the low-end frequencies.',
		},
		CHORDS: {
			description: 'Chordal instruments providing harmonic support.',
		},
		MELODY: {
			description: 'Melodic instruments carrying the main tune.',
		},
		VOCALS: {
			description: 'Vocal tracks including lead and backing vocals.',
		},
		COMBO: {
			description: 'A combination of multiple stem types.',
		},
		OTHER: {
			description: 'Any other type of recording, such as samples, nature sounds, sound effects, etc.',
		},
	},
})
