import { EStemType } from '@/schema/enums/stem-type.enum'
import { CreateStemDto } from '@/stem/dto/create-stem.dto'
import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import type { GetCIDResponse, PinResponse } from 'pinata-web3'
import { PinataSDK } from 'pinata-web3'
import { zeroAddress } from 'viem'
import { UploadFileDto } from './dto/upload-file.dto'
import { AccountService } from '@/account/account.service'
import { StemService } from '@/stem/stem.service'

@Injectable()
export class PinataService {
	private pinata: PinataSDK
	// private baseUrl = 'https://amber-pleased-sloth-337.mypinata.cloud/ipfs/'
	private groupId = '07cc4fed-2485-4d27-a93e-c0694f6e9c75'

	constructor(@Inject(StemService) private stemService: StemService) {
		this.pinata = new PinataSDK({
			pinataJwt: process.env.PINATA_JWT,
			pinataGateway: process.env.PINATA_GATEWAY_URL,
		})
	}

	async uploadFile(uploadFileDto: UploadFileDto, file: Express.Multer.File): Promise<PinResponse> {
		try {
			// TODO: Upload to a folder

			// 1. Upload file to Pinata
			const nativeFile = new File([file.buffer], file.originalname, { type: file.mimetype })
			// TODO: Upload JSON metadata for NFT
			const pinataFile = await this.pinata.upload.file(nativeFile, {
				groupId: this.groupId,
			})

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
			const res = await this.stemService.create(stemDto)
			console.log('new stem entity', { res })

			// Return the Pinata data
			return pinataFile
		} catch (error) {
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
