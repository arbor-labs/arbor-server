import { registerEnumType } from '@nestjs/graphql'

export enum EFileType {
	WAV = 'audio/wav',
	XWAV = 'audio/x-wav',
	WAVE = 'audio/wave',
	// MP3 = 'mp3',
	// FLAC = 'flac',
	// AAC = 'aac',
	// OGG = 'ogg',
	// AIFF = 'aiff',
}

registerEnumType(EFileType, {
	name: 'FileType',
	description: 'The MIME type of the audio file format.',
	valuesMap: {
		WAV: {
			description: 'Standard MIME type for Waveform Audio File Format (WAV)',
		},
		XWAV: {
			description: 'Alternative MIME type for WAV files, used by some systems',
		},
		WAVE: {
			description: 'Legacy MIME type for WAV files, maintained for compatibility',
		},
		// MP3: {
		// 	description: 'MPEG-1 Audio Layer III, a compressed audio format.',
		// },
		// FLAC: {
		// 	description: 'Free Lossless Audio Codec, a lossless compression format.',
		// },
		// AAC: {
		// 	description: 'Advanced Audio Coding, a lossy compression format.',
		// },
		// OGG: {
		// 	description: 'Ogg Vorbis, a free and open-source lossy compression format.',
		// },
		// AIFF: {
		// 	description: 'Audio Interchange File Format, a standard for storing sound data.',
		// },
	},
})
