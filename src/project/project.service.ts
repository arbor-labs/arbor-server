import { existsSync } from 'node:fs'
import { mkdir, readFile, rename, unlink, writeFile } from 'node:fs/promises'
import path from 'node:path'

import { BadRequestException, Inject, Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import _omit from 'lodash/omit'
import { join } from 'path'
import { Repository } from 'typeorm'
import type { Address } from 'viem'

import { AccountService } from '@/account/account.service'
import type { FileToMerge } from '@/audio/audio.service'
import { AudioService } from '@/audio/audio.service'
import type { SortInput } from '@/common/dtos/sort.input'
import { PaginationService } from '@/common/pagination.service'
import { SortingService } from '@/common/sorting.service'
import type { UploadFileDto } from '@/pinata/dto/upload-file.dto'
import type { UploadRevisionFileDto } from '@/pinata/dto/upload-revision-file.dto'
import { PinataService } from '@/pinata/pinata.service'
import type { PaginatedProjects } from '@/schema/entities'
import { ProjectEntity, ProjectQueueEntity, ProjectRevisionEntity, VotingGroupEntity } from '@/schema/entities'
import { EStemType } from '@/schema/enums/stem-type.enum'
import type { CreateStemDto } from '@/stem/dto/create-stem.dto'
import { StemService } from '@/stem/stem.service'
import { sanitizeFilename } from '@/utils/sanitizeFilename'

import type { CreateProjectInput } from './dto/create-project.input'
import { ProjectRevisionService } from './project-revision.service'

@Injectable()
export class ProjectService {
	private readonly logger = new Logger(ProjectService.name)

	constructor(
		@InjectRepository(ProjectEntity)
		private projectRepository: Repository<ProjectEntity>,
		@Inject(AccountService) private accountService: AccountService,
		@Inject(AudioService) private audioService: AudioService,
		@Inject(ProjectRevisionService) private revisionService: ProjectRevisionService,
		@Inject(StemService) private stemService: StemService,
		@Inject(PinataService) private pinataService: PinataService,
	) {}

	async save(project: ProjectEntity): Promise<ProjectEntity> {
		return await this.projectRepository.save(project)
	}

	async findAll(sort?: SortInput | undefined): Promise<PaginatedProjects> {
		const qb = this.projectRepository
			.createQueryBuilder('project')
			.leftJoinAndSelect('project.createdBy', 'createdBy')
			.leftJoinAndSelect('project.collaborators', 'collaborators')
			.leftJoinAndSelect('project.queue', 'queue')
			.leftJoinAndSelect('project.revisions', 'revisions')
			.leftJoinAndSelect('project.stems', 'stems')
			.leftJoinAndSelect('stems.createdBy', 'stemCreator')
			.leftJoinAndSelect('queue.stems', 'queueStems')

		// Apply sorting
		if (sort) SortingService.applySorting(sort, qb)

		// Apply pagination
		const paginatedItems = await PaginationService.getPaginatedItems({
			classRef: ProjectEntity,
			qb,
		})

		return paginatedItems
	}

	async findProjectById(id: string): Promise<ProjectEntity> {
		return this.projectRepository
			.createQueryBuilder('project')
			.where('project.id = :id', { id })
			.leftJoinAndSelect('project.createdBy', 'createdBy')
			.leftJoinAndSelect('project.collaborators', 'collaborators')
			.leftJoinAndSelect('project.queue', 'queue')
			.leftJoinAndSelect('project.revisions', 'revisions')
			.leftJoinAndSelect('project.stems', 'stems')
			.leftJoinAndSelect('stems.createdBy', 'stemCreator')
			.getOneOrFail()
	}

	async create(createProjectInput: CreateProjectInput): Promise<ProjectEntity> {
		// Create a new project queue for the project
		const projectQueue = new ProjectQueueEntity()
		projectQueue.stems = []

		// Create a new voting group for the project
		const votingGroup = new VotingGroupEntity()
		votingGroup.members = []

		// Get the account record
		const account = await this.accountService.findAccountByAddress(createProjectInput.createdBy)

		// Create the project entity and assign relationships
		const project = this.projectRepository.create({
			...createProjectInput,
			createdBy: account,
			collaborators: [],
			queue: projectQueue,
			revisions: [],
			stems: [],
			votingGroup: votingGroup,
		})

		// Update account record
		account.createdProjects = [...account.createdProjects, project]
		await this.accountService.save(account)

		// 4. Return the project entity - cascades for queue and voting group
		return await this.save(project)
	}

	// TODO: Handle creating a fork of a project with a subset of stems from the project. It should prompt for a unique name and description, add in the new createdBy. Add in the project collaborators to be comprised of the createdBy of each of the stems used to create the new project variation.
	// async forkProject(projectId: string, stemIds: string[]): Promise<ProjectEntity> {
	// 	const project = await this.findProjectById(projectId)
	// 	const stems =  await Promise.all(stemIds.map(async (id) => {
	// 		const stem = await this.stemService.findStemById(id)
	// 		return stem
	// 	}))
	// 	const newProject = this.projectRepository.create({
	// 		...project,
	// 		name: `${project.name} - Fork`,
	// 		createdBy: project.createdBy,
	// 		collaborators: stems.map(stem => stem.createdBy),
	// 		stems,
	// 		forked: true,
	// 		forkedFrom: project,
	// 	})

	// 	return await this.save(newProject)
	// }

	private checkStemLimit(project: ProjectEntity): void {
		// Check if stem limit is reached
		if (project.stems.length >= project.trackLimit) {
			throw new BadRequestException(`Project track limit of ${project.trackLimit} has been reached`)
		}
	}

	// Naive - getting the latest is just the most recent. All previews build on top of the last one.
	// TODO: Future - implement where a preview is that of a variety of existing stems/CIDs plus an optional new audio file. This allows for previewing a combination of existing ones in any order as well as adding a new one to the mix. i.e. A user can choose which stems to create a preview of - useful for forking projects.
	// TODO: This could have issues with race conditions on concurrent users. Hardcoding filenames is not good, maybe include address in temp filenames
	// TODO: Instead of writing to the local disk with temp files, store them in Redis for caching and later reuse. This way it can optimize for not having to query Pinata for each merge or each new audio file request.
	// TODO: On any given request, check Redis for the file. If it's not there, download it from Pinata and save it to Redis. Then return the file from Redis.
	async previewNewAudio(
		projectId: string,
		file: Express.Multer.File,
	): Promise<{ outputData: Buffer; outputPath: string }> {
		let previewAudio: { outputData: Buffer; outputPath: string }
		const outputDir = join(process.cwd(), '/previews/', projectId)

		try {
			// Create directories if they don't exist
			if (!existsSync(outputDir)) await mkdir(outputDir, { recursive: true })

			// Check for revision
			const latestRevision = await this.revisionService.getLatestRevision(projectId)
			if (!latestRevision) {
				const project = await this.findProjectById(projectId)

				if (project.stems.length === 0) {
					// Most likely first stem for project
					this.logger.log(`No previous stems found for project ${project.id}, creating initial preview`)

					// TODO: Do we need the CID for anything in the future at this point?
					// How can we store a temp file with the name as it's CID?

					// Delete the output file if it exists
					const outputPath = join(outputDir, 'preview-1.wav')
					if (existsSync(outputPath)) await unlink(outputPath)

					// Write buffer into file
					const data = AudioService.toBuffer(await AudioService.toBinaryFromFile(file))
					await writeFile(outputPath, data)

					// No merging
					previewAudio = { outputData: data, outputPath }
				} else {
					// Backwards compatible to retrofit the project revisions with the initial being a combination of all the stems
					this.logger.log(`Retrofitting project ${project.id} with initial revision`)

					// Order the CIDs alphabetically and construct the files
					const existingFiles: FileToMerge[] = await Promise.all(
						project.stems
							.map(stem => stem.audioCID)
							.sort((a, b) => a.localeCompare(b)) // sort alphabetically
							.map(async cid => {
								const resp = await this.pinataService.getFile(cid)
								return {
									buffer: AudioService.toBuffer(resp.data),
									filename: resp.cid,
								}
							}),
					)
					const newFile: FileToMerge = {
						buffer: AudioService.toBuffer(await AudioService.toBinaryFromFile(file)),
						filename: sanitizeFilename(file.originalname),
					}

					// Merge the files
					previewAudio = await this.audioService.mergeFiles([...existingFiles, newFile], {
						outputDir,
						outputFilename: 'preview-1.wav',
					})
				}
			} else {
				// Revisions found, adding a new one
				this.logger.log(`Adding on to existing revision ${latestRevision.id}`)

				// Get the binaries latest revision audio and new audio
				const revisionPinataFile = await this.pinataService.getFile(latestRevision.audioCID)
				const existingFile: FileToMerge = {
					buffer: AudioService.toBuffer(revisionPinataFile.data),
					filename: revisionPinataFile.cid,
				}
				const newFile: FileToMerge = {
					buffer: AudioService.toBuffer(await AudioService.toBinaryFromFile(file)),
					filename: sanitizeFilename(file.originalname),
				}

				// Merge the files
				previewAudio = await this.audioService.mergeFiles([existingFile, newFile], {
					outputDir,
					outputFilename: `preview-${latestRevision.version + 1}.wav`,
				})
			}

			// Preview the new audio with the previous revision
			this.logger.log(`Preview audio: ${previewAudio.outputPath}`)
			return previewAudio
		} catch (error) {
			this.logger.error('Error previewing new stem', error)
			throw new BadRequestException('Error previewing new stem')
		}
	}

	/**
	 * Add a new revision to the project by taking the previous revision and adding the new stem to it to create a new composite audio file. The new stem will get merged with the previous revision and saved as a new revision. The revision number is saved as a series of CIDs. [stemCID1-stemCID2, stemCID1-stemCID2-stemCID3, stemCID1-stemCID4, etc] each representing a revision with a subset of stems that make up that composite audio file.
	 * @dev Intended to be called when a new stem is added to the project. This can be used to preview the revisions by selecting certain stems to be included in the revision.
	 * @param id - The id of the project
	 * @param newStem - The new stem that has been added to the project
	 * @returns The updated project
	 */
	// TODO: Instead of writing to the local disk with temp files, store them in Redis for caching and later reuse. This way it can optimize for not having to query Pinata for each merge or each new audio file request.
	// TODO: On any given request, check Redis for the file. If it's not there, download it from Pinata and save it to Redis. Then return the file from Redis.
	async addRevisionToProject(project: ProjectEntity, createdBy: Address) {
		const newRevisionNumber = project.revisions.length + 1
		const previewDir = path.join(process.cwd(), '/previews/', project.id)
		const previewPath = path.join(previewDir, `preview-${newRevisionNumber}.wav`)
		const revisionName = `${project.name} - Revision ${newRevisionNumber}`
		const revisionFilename = `revision-${newRevisionNumber}.wav`
		const revisionPath = path.join(previewDir, revisionFilename)

		try {
			this.logger.log(`Adding revision to project: ${project.id}`)
			this.checkStemLimit(project)

			// TODO: Move the following into the revision service
			// TODO: Have a more foolproof way to increment revision numbers

			// Get the preview file, convert it to a "revision"
			this.logger.log(`Checking for preview file at: ${previewPath}`)
			if (!existsSync(previewPath)) {
				this.logger.error('No preview file found for project')
				throw new BadRequestException('No preview file found for project')
			}

			// Rename it to revision-[n].wav
			this.logger.log(`Preview file found. Renaming it to ${revisionPath}`)
			await rename(previewPath, revisionPath)

			// 2. Upload file to Pinata
			const uploadDto: UploadRevisionFileDto = {
				createdBy,
				name: revisionName,
				version: newRevisionNumber,
				type: EStemType.OTHER,
				projectId: project.id,
				stemCIDs: project.stems.map(stem => stem.metadataCID),
			}
			const revisionFileBinary = await readFile(revisionPath, 'binary')
			const resp = await this.pinataService.uploadRevisionFile(uploadDto, revisionFileBinary)
			if (!resp) throw new BadRequestException('An error occurred while uploading revision file to Pinata')

			// 3. Create new revision entity
			const revision = new ProjectRevisionEntity({
				version: newRevisionNumber,
				stemCIDs: project.stems.map(stem => stem.metadataCID),
				audioCID: resp.audioPinata.IpfsHash,
				metadataCID: resp.metadataPinata.IpfsHash,
			})
			const savedRevision = await this.revisionService.save(revision)
			this.logger.log(`Revision created: ${savedRevision.id}`)

			// 4. Add new revision record to project
			project.revisions = [...project.revisions, savedRevision]
			const savedProject = await this.projectRepository.save(project)
			this.logger.log(`Revision added to project: ${savedProject.id}`)

			return savedProject
		} catch (error) {
			throw new BadRequestException(error instanceof Error ? error.message : 'Error adding revision to project')
		} finally {
			// Clean up the revision file
			if (existsSync(revisionPath)) await unlink(revisionPath)
		}
	}

	async addStem(projectId: string, dto: UploadFileDto, file: Express.Multer.File): Promise<ProjectEntity> {
		try {
			this.logger.log(`Adding stem to project: ${projectId}`)

			// 1. Validate
			const account = await this.accountService.findAccountByAddress(dto.createdBy)
			const project = await this.findProjectById(dto.projectId)
			this.checkStemLimit(project)

			// 2. Upload file to Pinata
			const uploadFileDto: UploadFileDto = {
				name: `${project.name} - ${dto.name}`,
				type: dto.type,
				projectId: dto.projectId,
				createdBy: dto.createdBy,
			}
			const resp = await this.pinataService.uploadFile(uploadFileDto, file)
			if (!resp) {
				throw new BadRequestException('Failed to upload file to Pinata')
			}
			const { audioPinata, metadataPinata } = resp

			// Validation - ensure the audio can only be used once per project
			const existingStem = project.stems.find(stem => stem.audioCID === audioPinata.IpfsHash)
			if (audioPinata.isDuplicate && existingStem) {
				throw new BadRequestException('Audio already exists in project')
			}

			// 3. Create stem entity
			this.logger.log(`Creating stem entity: ${dto.name}`)
			const stemDto: CreateStemDto = {
				name: dto.name,
				type: dto.type,
				metadataCID: metadataPinata.IpfsHash,
				audioCID: audioPinata.IpfsHash,
				filename: file.originalname,
				filesize: file.size,
				filetype: file.mimetype,
				projectId: dto.projectId,
				createdBy: dto.createdBy,
			}
			const stem = await this.stemService.create(stemDto)

			// 4. Update entity relationships

			// Update stem to add the project
			// stem.projectsAddedTo = [...stem.projectsAddedTo, project]
			const savedStem = await this.stemService.save(stem)
			this.logger.log(`Stem entity created: ${savedStem.id}`)

			// Update account record
			account.uploadedStems = [...account.uploadedStems, savedStem]
			const savedAccount = await this.accountService.save(account)
			this.logger.log(`Account entity updated: ${savedAccount.id}`)

			// Update project record
			project.stems = [...project.stems, savedStem]
			project.collaborators = [...project.collaborators, savedAccount]
			const savedProject = await this.save(project)
			this.logger.log(`Project entity updated: ${savedProject.id}`)

			// 5. Add revision to project
			await this.addRevisionToProject(project, savedStem.createdBy.address)

			// Return the saved project
			return savedProject
		} catch (error) {
			this.logger.error(`Error adding stem to project: ${projectId}`, error)
			this.logger.log(error)
			throw new BadRequestException(error)
		}
	}
}
