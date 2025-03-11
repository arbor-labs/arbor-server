import {
	Body,
	Controller,
	HttpStatus,
	Param,
	ParseFilePipeBuilder,
	Post,
	UploadedFile,
	UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'

import { MAX_UPLOAD_FILE_SIZE } from '@/common/constants'
import { UploadFileDto } from '@/pinata/dto/upload-file.dto'

import { ProjectService } from './project.service'

@Controller('project')
export class ProjectController {
	constructor(private readonly projectService: ProjectService) {}

	@Post(':projectId/preview')
	@UseInterceptors(FileInterceptor('file'))
	previewNewAudio(
		@Param('projectId') projectId: string,
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
			return this.projectService.previewNewAudio(projectId, file)
		} catch (error) {
			return {
				statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
				message: 'Error uploading file to Pinata',
				error,
			}
		}
	}

	// TODO: Store revision files in Redis cache when previewing and pull from it when adding a stem
	// This should optimize having to download files from Pinata and merging them again
	// Ideally, each stem is only fetched once and then cached for future use, same with merged revision files
	@Post(':projectId/add-stem')
	@UseInterceptors(FileInterceptor('stemFile'))
	// @UseInterceptors(FileInterceptor('revisionFile'))
	async addStem(
		@Param('projectId') projectId: string,
		@Body() dto: UploadFileDto,
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
		stemFile: Express.Multer.File,
	) {
		const project = await this.projectService.addStem(projectId, dto, stemFile)
		return project
	}
}
