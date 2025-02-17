import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import _omit from 'lodash/omit'
import { Repository } from 'typeorm'

import { AccountService } from '@/account/account.service'
import type { SortInput } from '@/common/dtos/sort.input'
import { PaginationService } from '@/common/pagination.service'
import { SortingService } from '@/common/sorting.service'
import type { AccountEntity, PaginatedProjects, StemEntity } from '@/schema/entities'
import { ProjectEntity, ProjectQueueEntity, VotingGroupEntity } from '@/schema/entities'

import type { CreateProjectInput } from './dto/create-project.input'

@Injectable()
export class ProjectService {
	constructor(
		@Inject(AccountService) private accountService: AccountService,
		@InjectRepository(ProjectEntity)
		private projectRepository: Repository<ProjectEntity>,
	) {}

	async save(project: ProjectEntity): Promise<ProjectEntity> {
		return await this.projectRepository.save(project)
	}


	async findAll(sort?: SortInput | undefined): Promise<PaginatedProjects> {
		const qb = this.projectRepository
			.createQueryBuilder('project')
			.leftJoinAndSelect('project.createdBy', 'createdBy')
			.leftJoinAndSelect('project.collaborators', 'collaborators')
			.leftJoinAndSelect('project.stems', 'stems')
			.leftJoinAndSelect('stems.createdBy', 'stemCreator')
			.leftJoinAndSelect('project.queue', 'queue')
		// .leftJoinAndSelect("project.queue.stems", "queue.stems")

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
			.leftJoinAndSelect('project.stems', 'stems')
			.leftJoinAndSelect('stems.createdBy', 'stemCreator')
			.leftJoinAndSelect('project.queue', 'queue')
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
			stems: [],
			queue: projectQueue,
			votingGroup: votingGroup,
		})

		// Update account record
		account.createdProjects = [...account.createdProjects, project]
		await this.accountService.save(account)

		// 4. Return the project entity - cascades for queue and voting group
		return await this.save(project)
	}

	// async addStemToProject(id: string, stem: StemEntity) {
	// 	// Find the project with stems and collaborators
	// 	const project = await this.projectRepository.findOne({
	// 		where: { id },
	// 		relations: ['stems', 'collaborators'],
	// 	})

	// 	if (!project) {
	// 		throw new NotFoundException(`Project with id ${id} not found`)
	// 	}

	// 	// Check if stem limit is reached
	// 	if (project.stems.length >= project.trackLimit) {
	// 		throw new BadRequestException(`Project track limit of ${project.trackLimit} has been reached`)
	// 	}

	// 	// Add stem to project's stems array
	// 	project.stems = [...project.stems, stem]

	// 	// Add stem creator to collaborators if not already present
	// 	const isCollaborator = project.collaborators.some(c => c.address === stem.createdBy.address)
	// 	if (!isCollaborator) {
	// 		project.collaborators = [...project.collaborators, stem.createdBy]
	// 	}

	// 	// Save and return updated project
	// 	return await this.projectRepository.save(project)
	// }
}
