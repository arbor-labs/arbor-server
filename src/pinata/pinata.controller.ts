import {
	Body,
	Controller,
	HttpStatus,
	Inject,
	ParseFilePipeBuilder,
	Post,
	UploadedFile,
	UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { Express } from 'express'

import { MAX_UPLOAD_FILE_SIZE } from '@/common/constants'

import { UploadFileDto } from './dto/upload-file.dto'
import { PinataService } from './pinata.service'

@Controller('pinata')
export class PinataController {
	constructor(@Inject() private readonly pinataService: PinataService) {}

	@Post('upload')
	@UseInterceptors(FileInterceptor('file'))
	uploadFile(
		@Body() body: UploadFileDto,
		@UploadedFile(
			new ParseFilePipeBuilder()
				.addFileTypeValidator({
					fileType: 'audio/wav',
				})
				.addMaxSizeValidator({
					maxSize: MAX_UPLOAD_FILE_SIZE,
				})
				.build({
					errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
				}),
		)
		file: Express.Multer.File,
	) {
		try {
			return this.pinataService.uploadFile(body, file)
		} catch (error) {
			return {
				statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
				message: 'Error converting payload to a native NodeJS File type',
				error,
			}
		}
	}

	// TODO: https://docs.nestjs.com/techniques/file-upload#array-of-files
	// @Post('upload-multi')
	// @UseInterceptors(FilesInterceptor('files'))
	// uploadMultipleFiles(
	//   @Body() body: UploadFilesDto,
	//   @UploadedFiles(
	//     new ParseFilePipeBuilder()
	//       .addFileTypeValidator({
	//         fileType: 'audio/wav',
	//       })
	//       .addMaxSizeValidator({
	//         maxSize: MAX_UPLOAD_FILE_SIZE,
	//       })
	//       .build({
	//         errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
	//       }),
	//   )
	//   files: Express.Multer.File[],
	// ) {
	//   console.log({ body, files });
	// }
}
