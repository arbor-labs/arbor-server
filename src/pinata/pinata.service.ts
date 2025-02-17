import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import type { GetCIDResponse, PinResponse } from 'pinata-web3'
import { PinataSDK } from 'pinata-web3'

import type { StemEntity } from '@/schema/entities'
import type { CreateStemDto } from '@/stem/dto/create-stem.dto'
import { StemService } from '@/stem/stem.service'

import type { UploadFileDto } from './dto/upload-file.dto'

@Injectable()
export class PinataService {
	private pinata: PinataSDK
	private gatewayUrl = 'https://amber-pleased-sloth-337.mypinata.cloud/ipfs/'
	private groupId = '07cc4fed-2485-4d27-a93e-c0694f6e9c75'
	private imageCID = 'bafybeigi3rmjs2cyz7fc6ovojyahg3svpn3hgdeucamhdrhyrilgmit4we'

	constructor(@Inject(StemService) private stemService: StemService) {
		this.pinata = new PinataSDK({
			pinataJwt: process.env.PINATA_JWT,
			pinataGateway: process.env.PINATA_GATEWAY_URL,
		})
	}

	async getFile(cid: string): Promise<GetCIDResponse> {
		try {
			const response = await this.pinata.gateways.get(cid)
			let data = response.data

			// Convert Blob to raw binary before returning
			if (data instanceof Blob) {
				const buffer = await data.arrayBuffer()
				const rawAudioBinary = Buffer.from(buffer).toString('binary')
				data = rawAudioBinary
			}

			return {
				...response,
				data,
			}
		} catch (error) {
			throw new BadRequestException('Error fetching file from Pinata, CID may not exist')
		}
	}

	async uploadFile(
		uploadFileDto: UploadFileDto,
		file: Express.Multer.File,
	): Promise<{ audioPinata: PinResponse; metadataPinata: PinResponse; stem: StemEntity }> {
		try {
			// 1. Upload audio file to Pinata
			const nativeFile = new File([file.buffer], file.originalname, { type: file.mimetype })
			const audioPinata = await this.pinata.upload.file(nativeFile, {
				groupId: this.groupId,
			})

			// 2. Create and upload NFT metadata file to Pinata
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

			// 3. Create stem entity
			const stemDto: CreateStemDto = {
				name: uploadFileDto.name,
				type: uploadFileDto.type,
				metadataCID: metadataPinata.IpfsHash,
				audioCID: audioPinata.IpfsHash,
				filename: file.originalname,
				filesize: file.size,
				filetype: file.mimetype,
				projectId: uploadFileDto.projectId,
				createdBy: uploadFileDto.createdBy,
			}
			const stem = await this.stemService.create(stemDto)

			return { audioPinata, metadataPinata, stem }
		} catch (error: unknown) {
			if (error instanceof Error) {
				throw new BadRequestException(error.message)
			}
			throw new BadRequestException(
				'An error occurred while uploading audio and metadata files to Pinata or creating a stem entity',
			)
		}
	}
}
