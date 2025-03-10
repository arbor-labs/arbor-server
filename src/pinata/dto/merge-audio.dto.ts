import { ArrayMinSize, IsArray, IsNotEmpty, IsString } from 'class-validator'

export class MergeAudioDto {
	@IsArray()
	@IsString({ each: true })
	@ArrayMinSize(1)
	cids: string[]

	@IsString()
	@IsNotEmpty()
	projectName: string
}
