import { IsDefined, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator'

import { UploadFileDto } from './upload-file.dto'

export class UploadRevisionFileDto extends UploadFileDto {
	@IsDefined()
	@IsNumber()
	@IsNotEmpty()
	@Min(1)
	version: number

	/**
	 * @dev These should be an array of CIDs that point to the JSON metadata files for each stem that makes up part the revision.
	 */
	@IsDefined()
	@IsString({ each: true })
	@IsNotEmpty()
	stemCIDs: string[]
}
