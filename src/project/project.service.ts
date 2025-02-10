import { Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import _omit from 'lodash/omit'
import { Repository } from 'typeorm'

import { AccountService } from '@/account/account.service'
import type { SortInput } from '@/common/dtos/sort.input'
import { PaginationService } from '@/common/pagination.service'
import { SortingService } from '@/common/sorting.service'
import type { AccountEntity, PaginatedProjects } from '@/schema/entities'
import { ProjectEntity, ProjectQueueEntity, VotingGroupEntity } from '@/schema/entities'

import type { CreateProjectInput } from './dto/create-project.input'

@Injectable()
export class ProjectService {
	constructor(
		@Inject(AccountService) private accountService: AccountService,
		@InjectRepository(ProjectEntity)
		private projectRepository: Repository<ProjectEntity>,
		// @InjectRepository(VotingGroupEntity)
		// private votingGroupRepository: Repository<VotingGroupEntity>,
		// @InjectRepository(ProjectQueueEntity)
		// private projectQueueRepository: Repository<ProjectQueueEntity>,
	) {}

	async create(createProjectInput: CreateProjectInput): Promise<ProjectEntity> {
		// Create a new project queue for the project
		const projectQueue = new ProjectQueueEntity()
		projectQueue.stems = []

		// Create a new voting group for the project
		const votingGroup = new VotingGroupEntity()
		votingGroup.members = []

		// Get the account record
		const account: AccountEntity = await this.accountService.findAccountByAddress(createProjectInput.createdBy)

		// Create the project entity and assign relationships
		const project = this.projectRepository.create({ ...createProjectInput, createdBy: account })
		project.queue = projectQueue
		project.votingGroup = votingGroup

		// 4. Return the project entity - cascades for createdBy, queue, and votingGroup
		return await this.projectRepository.save(project)
	}

	async findAll(sort?: SortInput | undefined): Promise<PaginatedProjects> {
		const qb = this.projectRepository
			.createQueryBuilder('project')
			.leftJoinAndSelect('project.createdBy', 'createdBy')
			.leftJoinAndSelect('project.collaborators', 'collaborators')
			.leftJoinAndSelect('project.stems', 'stems')
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
}
