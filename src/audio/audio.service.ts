import { existsSync } from 'node:fs'
import { mkdir, readFile, rmdir, unlink, writeFile } from 'node:fs/promises'

import ffmpegInstaller from '@ffmpeg-installer/ffmpeg'
import { BadRequestException, Injectable, Logger } from '@nestjs/common'
import ffmpeg from 'fluent-ffmpeg'
import { join } from 'path'
import type { GetCIDResponse } from 'pinata-web3'

import { sanitizeFilename } from '@/utils/sanitizeFilename'

type PinataResponseData = GetCIDResponse['data']

export interface MergeFilesOptions {
	outputDir: string
	outputFilename: string
}

export interface FileToMerge {
	buffer: Buffer
	filename: string
}

@Injectable()
export class AudioService {
	private readonly logger = new Logger(AudioService.name)

	constructor() {
		ffmpeg.setFfmpegPath(ffmpegInstaller.path)
	}

	static async toBinaryFromFile(file: Express.Multer.File | File): Promise<string> {
		const buffer =
			file instanceof File
				? await file.arrayBuffer()
				: await new File([file.buffer], file.originalname, { type: file.mimetype }).arrayBuffer()
		return Buffer.from(buffer).toString('binary')
	}

	static toBinaryFromPinata(data: PinataResponseData): string {
		if (!data) return ''
		return typeof data === 'string'
			? Buffer.from(data, 'binary').toString('binary')
			: Buffer.from(JSON.stringify(data)).toString('binary')
	}

	static toBuffer(data: PinataResponseData): Buffer {
		const audioBuffer = typeof data === 'string' ? Buffer.from(data, 'binary') : Buffer.from(String(data))
		return audioBuffer
	}

	async mergeFiles(
		files: FileToMerge[],
		{ outputDir, outputFilename }: MergeFilesOptions,
	): Promise<{
		outputData: Buffer
		outputPath: string
	}> {
		const tempDir = join(outputDir, 'temp')
		const tempFiles: string[] = []

		try {
			// Create directories if they don't exist
			if (!existsSync(tempDir)) await mkdir(tempDir, { recursive: true })

			// Delete the output file if it exists
			const outputPath = join(outputDir, outputFilename)
			if (existsSync(outputPath)) await unlink(outputPath)

			this.logger.log(`Starting to merge ${files.length} audio files to ${outputPath}`)

			await new Promise<void>(async (resolve, reject) => {
				const command = ffmpeg()

				// Create the temporary files
				await Promise.all(
					files.map(async file => {
						const tempPath = join(tempDir, `${sanitizeFilename(file.filename)}.wav`)
						await writeFile(tempPath, file.buffer)
						this.logger.log(`Saved temporary file at ${tempPath}`)
						command.input(tempPath)
						tempFiles.push(tempPath)
					}),
				)

				command
					.complexFilter([
						{
							filter: 'amix',
							options: {
								inputs: tempFiles.length,
								duration: 'longest',
								normalize: 1, // Normalize audio levels
							},
						},
					])
					.toFormat('wav')
					.on('start', commandLine => {
						this.logger.log(`FFmpeg command: ${commandLine}`)
					})
					.on('error', err => {
						this.logger.error('FFmpeg error:', err)
						reject(err)
					})
					.on('end', () => {
						this.logger.log('FFmpeg processing finished')
						resolve()
					})
					.save(outputPath)
			})

			// Read the merged file
			this.logger.log(`Reading merged file at ${outputPath}`)
			const mergedBuffer = await readFile(outputPath)

			return {
				outputData: mergedBuffer,
				outputPath,
			}
		} catch (error) {
			this.logger.error('Error merging audio files:', error)
			throw new BadRequestException(error instanceof Error ? error.message : 'Error merging audio files')
		} finally {
			// TODO: Clean up temporary files
			await rmdir(tempDir, { recursive: true })
			this.logger.log(`Cleaned up temporary files in ${tempDir}`)
		}
	}

	// async mergeAudioBinaries(
	// 	binaries: string[],
	// 	{ outputDir, filename }: MergeFilesOptions,
	// ): Promise<{
	// 	data: Buffer
	// 	previewPath: string
	// }> {
	// 	await mkdir(outputDir, { recursive: true })
	// 	const outputPath = join(outputDir, filename)

	// 	// Delete the output file if it exists
	// 	if (await existsSync(outputPath)) {
	// 		console.log('deleting file')
	// 		await unlink(outputPath)
	// 	}

	// 	await new Promise<void>(async (resolve, reject) => {
	// 		const command = ffmpeg()
	// 		binaries.forEach(binary => {
	// 			command.input(binary)
	// 		})
	// 		command
	// 			.complexFilter([
	// 				{
	// 					filter: 'amix',
	// 					options: {
	// 						// inputs: binaries.length,
	// 						duration: 'longest',
	// 						normalize: 1, // Normalize audio levels
	// 					},
	// 				},
	// 			])
	// 			.toFormat('wav')
	// 			.on('start', commandLine => {
	// 				this.logger.log(`FFmpeg command: ${commandLine}`)
	// 			})
	// 			.on('error', err => {
	// 				this.logger.error('FFmpeg error:', err)
	// 				reject(err)
	// 			})
	// 			.on('end', () => {
	// 				this.logger.log('FFmpeg processing finished')
	// 				resolve()
	// 			})
	// 			.save(outputPath)
	// 	})

	// 	this.logger.log(`Reading merged file at ${outputPath}`)
	// 	const mergedBuffer = await readFile(outputPath)

	// 	return {
	// 		data: mergedBuffer,
	// 		previewPath: outputPath,
	// 	}
	// }

	// async mergeFilesFromCIDs(
	// 	cids: string[],
	// 	projectName: string,
	// 	{outputPath}: MergeFilesOptions,
	// ): Promise<{
	// 	data: Buffer
	// 	previewPath: string
	// }> {
	// 	// const dir = join(process.cwd(), '/previews/', projectName, 'revisions')
	// 	// const filename = `output-${[cids.join('-').trim()].join('-')}.wav`
	// 	// const tempFiles: string[] = []
	// 	// const outputPath = join(dir, filename)

	// 	try {
	// 		// Create directory if it doesn't exist
	// 		await fs.mkdir(dir, { recursive: true })

	// 		this.logger.log(`Starting to fetch and merge ${cids.length} audio files`)

	// 		// 1. Download and save all files temporarily
	// 		for (const cid of cids) {
	// 			const response = await this.pinataService.getFile(cid)

	// 			// Convert binary string back to Buffer if necessary
	// 			const audioBuffer = AudioService.toBuffer(response.data)

	// 			// Write to temp file
	// 			const tempPath = join(dir, `temp-${cid}.wav`)
	// 			await fs.writeFile(tempPath, audioBuffer)
	// 			tempFiles.push(tempPath)
	// 			this.logger.log(`Saved temporary file at ${tempPath}`)
	// 		}

	// 		// 3. Merge files using ffmpeg
	// 		this.logger.log(`Merging ${tempFiles.length} audio files`)
	// 		await new Promise<void>((resolve, reject) => {
	// 			const command = ffmpeg()

	// 			// Add all input files
	// 			tempFiles.forEach(file => {
	// 				command.input(file)
	// 			})

	// 			command
	// 				.complexFilter([
	// 					{
	// 						filter: 'amix',
	// 						options: {
	// 							inputs: tempFiles.length,
	// 							duration: 'longest',
	// 							normalize: 1, // Normalize audio levels
	// 						},
	// 					},
	// 				])
	// 				.toFormat('wav')
	// 				.on('start', commandLine => {
	// 					this.logger.log(`FFmpeg command: ${commandLine}`)
	// 				})
	// 				.on('error', err => {
	// 					this.logger.error('FFmpeg error:', err)
	// 					reject(err)
	// 				})
	// 				.on('end', () => {
	// 					this.logger.log('FFmpeg processing finished')
	// 					resolve()
	// 				})
	// 				.save(outputPath)
	// 		})

	// 		// 4. Read the merged file
	// 		this.logger.log(`Reading merged file at ${outputPath}`)
	// 		const mergedBuffer = await fs.readFile(outputPath)

	// 		return {
	// 			data: mergedBuffer,
	// 			previewPath: outputPath,
	// 		}
	// 	} catch (error) {
	// 		this.logger.error('Error merging audio files:', error)
	// 		throw new BadRequestException(error instanceof Error ? error.message : 'Error merging audio files')
	// 	}
	// }
}
