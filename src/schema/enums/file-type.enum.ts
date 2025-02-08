import { registerEnumType } from '@nestjs/graphql'

export enum EFileType {
	WAV = 'wav',
	MP3 = 'mp3',
	FLAC = 'flac',
	AAC = 'aac',
	OGG = 'ogg',
	AIFF = 'aiff',
}

registerEnumType(EFileType, {
	name: 'FileType',
	description: 'The type of audio file format.',
	valuesMap: {
		WAV: {
			description: 'Waveform Audio File Format, a raw audio format.',
		},
		MP3: {
			description: 'MPEG-1 Audio Layer III, a compressed audio format.',
		},
		FLAC: {
			description: 'Free Lossless Audio Codec, a lossless compression format.',
		},
		AAC: {
			description: 'Advanced Audio Coding, a lossy compression format.',
		},
		OGG: {
			description: 'Ogg Vorbis, a free and open-source lossy compression format.',
		},
		AIFF: {
			description: 'Audio Interchange File Format, a standard for storing sound data.',
		},
	},
})
