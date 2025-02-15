import { CreateStemDto } from '@/stem/dto/create-stem.dto'
import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import type { GetCIDResponse, PinResponse } from 'pinata-web3'
import { PinataSDK } from 'pinata-web3'
import { UploadFileDto } from './dto/upload-file.dto'
import { StemService } from '@/stem/stem.service'
import { StemEntity } from '@/schema/entities'

@Injectable()
export class PinataService {
	private pinata: PinataSDK
	private baseUrl = 'https://amber-pleased-sloth-337.mypinata.cloud/ipfs/'
	private groupId = '07cc4fed-2485-4d27-a93e-c0694f6e9c75'

	constructor(@Inject(StemService) private stemService: StemService) {
		this.pinata = new PinataSDK({
			pinataJwt: process.env.PINATA_JWT,
			pinataGateway: process.env.PINATA_GATEWAY_URL,
		})
	}

	async uploadFile(
		uploadFileDto: UploadFileDto,
		file: Express.Multer.File,
	): Promise<{ pinataData: PinResponse; stem: StemEntity }> {
		try {
			// TODO: Upload to a folder
			// TODO: Upload JSON metadata for NFT

			// 1. Upload file to Pinata
			const nativeFile = new File([file.buffer], file.originalname, { type: file.mimetype })
			const pinataFile = await this.pinata.upload.file(nativeFile, {
				groupId: this.groupId,
			})

			console.log({ pinataFile })

			// 2. Create a new Stem entity in DB
			const stemDto: CreateStemDto = {
				name: uploadFileDto.name,
				type: uploadFileDto.type,
				metadataCID: '',
				audioCID: pinataFile.IpfsHash,
				filename: file.originalname,
				filesize: file.size,
				filetype: file.mimetype,
				projectId: uploadFileDto.projectId,
				createdBy: uploadFileDto.createdBy,
			}
			const stem = await this.stemService.create(stemDto)
			console.log({ stem })

			// Return the Pinata data alongside the new Stem data
			return { pinataData: pinataFile, stem }
		} catch (error) {
			console.error(error)
			throw new BadRequestException('Error uploading file to Pinata')
		}
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
}
