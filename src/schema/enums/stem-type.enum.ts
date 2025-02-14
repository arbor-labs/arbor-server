import { registerEnumType } from '@nestjs/graphql'

export enum EStemType {
	MELODY = 'melody',
	HARMONY = 'harmony',
	RHYTHM = 'rhythm',
	BASS = 'bass',
	DRUMS = 'drums',
	VOCALS = 'vocals',
	FX = 'fx',
	OTHER = 'other',
}

registerEnumType(EStemType, {
	name: 'StemType',
	description: 'The type/role of the stem in the project',
	valuesMap: {
		MELODY: {
			description: 'Lead melodic elements like guitar solos or synth leads',
		},
		HARMONY: {
			description: 'Harmonic elements like chord progressions or pad sounds',
		},
		RHYTHM: {
			description: 'Rhythmic elements like rhythm guitar or percussion',
		},
		BASS: {
			description: 'Bass instruments including bass guitar or synth bass',
		},
		DRUMS: {
			description: 'Drum and percussion elements',
		},
		VOCALS: {
			description: 'Vocal tracks including lead and backing vocals',
		},
		FX: {
			description: 'Sound effects and atmospheric elements',
		},
		OTHER: {
			description: "Other musical elements that don't fit the above categories",
		},
	},
})
