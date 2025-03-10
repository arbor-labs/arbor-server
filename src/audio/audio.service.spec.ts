import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing'

import { AudioService } from './audio.service'

jest.mock('fluent-ffmpeg', () => {
	return jest.fn().mockImplementation(() => ({
		addInput: jest.fn().mockReturnThis(),
		complexFilter: jest.fn().mockReturnThis(),
		toFormat: jest.fn().mockReturnThis(),
		on: jest.fn().mockReturnThis(),
		save: jest.fn().mockReturnThis(),
	}))
})

jest.mock('@ffmpeg-installer/ffmpeg', () => ({
	path: '/mock/ffmpeg/path',
}))

describe('AudioService', () => {
	let service: AudioService

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [AudioService],
		}).compile()

		service = module.get<AudioService>(AudioService)
	})

	it('should be defined', () => {
		expect(service).toBeDefined()
	})

	// it('should merge audio binaries', async () => {
	// 	const result = await service.mergeAudioBinaries(['test1', 'test2'], { outputPath: 'test.wav' })
	// 	expect(result).toBeDefined()
	// })
})
