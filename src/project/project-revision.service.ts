import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { ProjectRevisionEntity } from '@/schema/entities/project-revision.entity'

@Injectable()
export class ProjectRevisionService {
	private readonly logger = new Logger(ProjectRevisionService.name)

	constructor(
		@InjectRepository(ProjectRevisionEntity)
		private revisionRepository: Repository<ProjectRevisionEntity>,
	) {}

	async save(revision: ProjectRevisionEntity): Promise<ProjectRevisionEntity> {
		return this.revisionRepository.save(revision)
	}

	async getProjectRevisions(projectId: string): Promise<ProjectRevisionEntity[] | null> {
		return this.revisionRepository.find({
			where: { project: { id: projectId } },
			order: { createdAt: 'DESC' },
		})
	}

	/**
	 * Get the latest revision for a project
	 * @param projectId - The ID of the project
	 * @returns The latest revision for the project
	 */
	async getLatestRevision(projectId: string): Promise<ProjectRevisionEntity | null> {
		const revisions = await this.getProjectRevisions(projectId)
		// Check that the version number matches the number of revisions
		const latestRevision = revisions?.[0] ?? null
		this.logger.log({ latestRevision, revisions, numRevisions: revisions?.length })
		if (latestRevision && latestRevision.version !== revisions?.length) {
			return null
		}
		return latestRevision
	}

	// async createRevision(project: ProjectEntity, newStem: StemEntity): Promise<ProjectRevisionEntity> {
	// 	const revisions = await this.getProjectRevisions(project.id)
	// 	const revisionCount = revisions?.length || 0
	// 	const revisionName = `${project.name}-rev${revisionCount + 1}`

	// // Merge audio files
	// const mergedAudio = await this.audioService.mergeFiles(
	//   project.stems.map(s => s.audioCID),
	//   project.name
	// );

	// Upload to Pinata
	// const pinataResponse = await this.pinataService.uploadFile(
	// 	{
	// 		name: revisionName,
	// 		type: EStemType.OTHER,
	// 		projectId: project.id,
	// 		createdBy: project.createdBy.address,
	// 	},
	// )

	// 	const pinataResponse = {
	// 		audioPinata: {
	// 			IpfsHash: 'test',
	// 		},
	// 		metadataPinata: {
	// 			IpfsHash: 'test',
	// 		},
	// 	}
	// 	// Create revision entity
	// 	const revision = new ProjectRevisionEntity({
	// 		name: revisionName,
	// 		audioCID: pinataResponse.audioPinata.IpfsHash,
	// 		metadataCID: pinataResponse.metadataPinata.IpfsHash,
	// 		project,
	// 	})

	// 	return this.revisionRepository.save(revision)
	// }
}
