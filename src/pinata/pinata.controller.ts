import {
	Body,
	Controller,
	Get,
	HttpStatus,
	Inject,
	Param,
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
	constructor(@Inject(PinataService) private readonly pinataService: PinataService) {}

	@Get('file/:cid')
	async getFile(@Param('cid') cid: string) {
		return this.pinataService.getFile(cid)
	}

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
			// 1. Preview what the file looks like layered with the previous stems revision
			// 2. If confirmed, upload file to Pinata
			// 3. Create a new stem for the project
			// 4. Create a new revision using the layered audio
			// 5. Return the stem and revision
			return this.pinataService.uploadFile(body, file)
		} catch (error) {
			return {
				statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
				message: 'Error uploading file to Pinata',
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
