import {
	IsDefined,
	IsEnum,
	IsEthereumAddress,
	IsInt,
	IsMimeType,
	IsNotEmpty,
	IsString,
	IsUUID,
	Max,
	Min,
} from 'class-validator'
import { Address } from 'viem'

import { EFileType } from '@/schema/enums/file-type.enum'
import { EStemType } from '@/schema/enums/stem-type.enum'

export class CreateStemDto {
	@IsDefined()
	@IsString()
	@IsNotEmpty()
	name: string

	@IsDefined()
	@IsEnum(EStemType)
	type: EStemType

	@IsDefined()
	@IsString()
	@IsNotEmpty()
	metadataCID: string

	@IsDefined()
	@IsString()
	@IsNotEmpty()
	audioCID: string

	@IsDefined()
	@IsString()
	@IsNotEmpty()
	filename: string

	@IsDefined()
	@IsMimeType()
	@IsEnum(EFileType)
	filetype: string

	@IsDefined()
	@IsInt()
	@Min(0)
	@Max(20000000) // 20MB
	filesize: number

	@IsDefined()
	@IsUUID()
	projectId: string

	@IsDefined()
	@IsEthereumAddress()
	@IsNotEmpty()
	createdBy: Address
}
