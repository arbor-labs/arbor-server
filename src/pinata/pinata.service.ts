import { BadRequestException, Injectable, Logger } from '@nestjs/common'
import type { GetCIDResponse, PinResponse } from 'pinata-web3'
import { PinataSDK } from 'pinata-web3'

import type { UploadFileDto } from './dto/upload-file.dto'
import type { UploadRevisionFileDto } from './dto/upload-revision-file.dto'
import { RedisCacheService } from '@/cache/redis-cache.service'

@Injectable()
export class PinataService {
	private readonly logger = new Logger(PinataService.name)
	private pinata: PinataSDK
	// private gatewayUrl = 'https://amber-pleased-sloth-337.mypinata.cloud/ipfs/'
	private groupId = process.env.PINATA_GROUP_ID
	private imageCID = 'bafybeigi3rmjs2cyz7fc6ovojyahg3svpn3hgdeucamhdrhyrilgmit4we'

	constructor(private readonly cacheService: RedisCacheService) {
		this.pinata = new PinataSDK({
			pinataJwt: process.env.PINATA_JWT,
			pinataGateway: process.env.PINATA_GATEWAY_URL,
		})
	}

	async getFile(cid: string): Promise<{ contentType: GetCIDResponse['contentType']; data: string; cid: string }> {
		try {
			// Try to get from cache first
			const cacheKey = `pinata:file:${cid}`

			return await this.cacheService.getOrSet(cacheKey, async () => {
				this.logger.log(`Downloading file with CID: ${cid}`)
				const response = await this.pinata.gateways.get(cid)
				let data = response.data

				// Convert Blob to raw binary before returning
				if (data instanceof Blob) {
					const buffer = await data.arrayBuffer()
					const rawAudioBinary = Buffer.from(buffer).toString('binary')
					data = rawAudioBinary
				}
				// Always ensure a string of binary data is returned
				if (typeof data !== 'string') {
					data = Buffer.from(JSON.stringify(data)).toString('binary')
				}

				this.logger.log(`File downloaded with CID: ${cid}`)

				return {
					data: String(data),
					contentType: response.contentType,
					cid,
				}
			})
		} catch (error) {
			this.logger.error(error)
			throw new BadRequestException('Error fetching file from Pinata, CID may not exist')
		}
	}

	async uploadFile(
		uploadFileDto: UploadFileDto,
		file: Express.Multer.File,
	): Promise<{ audioPinata: PinResponse; metadataPinata: PinResponse } | undefined> {
		try {
			this.logger.log(`Uploading audio file to Pinata: ${uploadFileDto.name}`)
			// 1. Upload audio file to Pinata
			const nativeFile = new File([file.buffer], file.originalname, { type: file.mimetype })
			const audioPinata = await this.pinata.upload.file(nativeFile, {
				groupId: this.groupId,
			})

			// 2. Create and upload NFT metadata file to Pinata
			if (audioPinata.IpfsHash) {
				this.logger.log(`Audio file uploaded to Pinata with CID: ${audioPinata.IpfsHash}`)
				this.logger.log(`Uploading metadata file to Pinata: ${uploadFileDto.name}-metadata.json`)
				const metadata = {
					name: uploadFileDto.name,
					// TODO: support description field input for both entity and metadata
					// description: `${uploadFileDto.name} - ${uploadFileDto.type} stem`,
					description: 'An audio file uploaded through the Arbor Audio platform',
					image: `ipfs://${this.imageCID}`,
					external_url: 'https://arbor.audio/stems', // TODO: add stem ID to external URL
					attributes: [
						{
							trait_type: 'Stem Type',
							// capitalize first letter
							value: uploadFileDto.type.charAt(0).toUpperCase() + uploadFileDto.type.slice(1).toLowerCase(),
						},
						{
							trait_type: 'File Type',
							value: file.mimetype,
						},
						{
							trait_type: 'File Size',
							value: file.size,
							display_type: 'number',
						},
						{
							trait_type: 'Original Creator',
							value: uploadFileDto.createdBy,
						},
						{
							trait_type: 'Created On',
							// Unix timestamp in seconds
							value: Math.round(new Date().getTime() / 1000),
							display_type: 'date',
						},
					],
					// TODO: Follow schema.org - https://schema.org/MusicRecording
					properties: {
						audio: [
							{
								uri: `ipfs://${audioPinata.IpfsHash}`,
								type: file.mimetype,
							},
						],
					},
				}
				const metadataFile = new File([JSON.stringify(metadata, null, 2)], `${uploadFileDto.name}-metadata.json`, {
					type: 'application/json',
				})
				const metadataPinata = await this.pinata.upload.file(metadataFile, {
					groupId: this.groupId,
				})

				if (metadataPinata.IpfsHash) {
					this.logger.log(`Metadata file uploaded to Pinata with CID: ${metadataPinata.IpfsHash}`)
					return { audioPinata, metadataPinata }
				} else {
					this.logger.error(`Failed to upload metadata file to Pinata`)
					throw new BadRequestException('Failed to upload metadata file to Pinata')
				}
			}
		} catch (error: unknown) {
			if (error instanceof Error) {
				throw new BadRequestException(error.message)
			}
			throw new BadRequestException(
				'An error occurred while uploading audio and metadata files to Pinata or creating a stem entity',
			)
		}
	}

	async uploadRevisionFile(
		dto: UploadRevisionFileDto,
		audioBinary: string,
	): Promise<{ audioPinata: PinResponse; metadataPinata: PinResponse } | undefined> {
		try {
			this.logger.log(`Uploading revision audio file to Pinata: ${dto.name}`)
			// 1. Upload audio file to Pinata
			const nativeFile = new File([Buffer.from(audioBinary, 'binary')], dto.name, { type: 'audio/wav' })
			const audioPinata = await this.pinata.upload.file(nativeFile, {
				groupId: this.groupId,
			})

			// 2. Create and upload NFT metadata file to Pinata
			if (audioPinata.IpfsHash) {
				this.logger.log(`Revision audio file uploaded to Pinata with CID: ${audioPinata.IpfsHash}`)
				this.logger.log(`Uploading revision metadata file to Pinata: ${dto.name}-metadata.json`)
				const metadata = {
					name: dto.name,
					// TODO: support description field input for both entity and metadata
					// description: `${uploadFileDto.name} - ${uploadFileDto.type} stem`,
					description:
						'An Arbor Audio Project Revision file uploaded through the Arbor platform. This ia a composition of multiple stems also uploaded through Arbor.',
					image: `ipfs://${this.imageCID}`,
					external_url: 'https://arbor.audio/stems', // TODO: add stem ID to external URL
					attributes: [
						{
							trait_type: 'Revision Name',
							value: dto.name,
						},
						{
							trait_type: 'Revision Version',
							value: dto.version,
							display_type: 'number',
						},
						{
							trait_type: 'File Type',
							value: 'audio/wav',
						},
						{
							trait_type: 'File Size',
							value: audioBinary.length,
							display_type: 'number',
						},
						{
							trait_type: 'Original Creator',
							value: dto.createdBy,
						},
						{
							trait_type: 'Created On',
							// Unix timestamp in seconds
							value: Math.round(new Date().getTime() / 1000),
							display_type: 'date',
						},
					],
					properties: {
						audio: [
							{
								uri: `ipfs://${audioPinata.IpfsHash}`,
								type: 'audio/wav',
							},
						],
						// NOTE: This points to metadata. Should it point to the audio files instead?
						stems: dto.stemCIDs.map(cid => ({ uri: `ipfs://${cid}`, type: 'JSON' })),
					},
				}
				const metadataFile = new File([JSON.stringify(metadata, null, 2)], `${dto.name}-metadata.json`, {
					type: 'application/json',
				})
				const metadataPinata = await this.pinata.upload.file(metadataFile, {
					groupId: this.groupId,
				})

				if (metadataPinata.IpfsHash) {
					this.logger.log(`Revision metadata file uploaded to Pinata with CID: ${metadataPinata.IpfsHash}`)
					return { audioPinata, metadataPinata }
				} else {
					this.logger.error(`Failed to upload revision metadata file to Pinata`)
					throw new BadRequestException('Failed to upload revision metadata file to Pinata')
				}
			}
		} catch (error: unknown) {
			if (error instanceof Error) {
				throw new BadRequestException(error.message)
			}
			throw new BadRequestException('An error occurred while uploading revision audio and metadata files to Pinata')
		}
	}
}
