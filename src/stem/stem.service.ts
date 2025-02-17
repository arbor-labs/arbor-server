import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { AccountService } from '@/account/account.service'
import type { SortInput } from '@/common/dtos/sort.input'
import { PaginationService } from '@/common/pagination.service'
import { SortingService } from '@/common/sorting.service'
import { ProjectService } from '@/project/project.service'
import type { PaginatedStems } from '@/schema/entities'
import { StemEntity } from '@/schema/entities'

import type { CreateStemDto } from './dto/create-stem.dto'

@Injectable()
export class StemService {
	constructor(
		@InjectRepository(StemEntity) private stemRepository: Repository<StemEntity>,
		@Inject(AccountService) private accountService: AccountService,
		@Inject(ProjectService) private projectService: ProjectService,
	) {}

	async save(stem: StemEntity): Promise<StemEntity> {
		return await this.stemRepository.save(stem)
	}

	async findAll(sort?: SortInput | undefined): Promise<PaginatedStems> {
		const qb = this.stemRepository
			.createQueryBuilder('stem')
			.leftJoinAndSelect('stem.createdBy', 'createdBy')
			.leftJoinAndSelect('stem.projectsAddedTo', 'projectsAddedTo')

		// Apply sorting
		if (sort) SortingService.applySorting(sort, qb)

		// Apply pagination
		const paginatedItems = await PaginationService.getPaginatedItems({ classRef: StemEntity, qb })

		return paginatedItems
	}

	async findStemById(id: string): Promise<StemEntity> {
		const stem = await this.stemRepository.findOne({
			where: { id },
			relations: ['createdBy', 'projectsAddedTo'],
		})

		if (!stem) {
			throw new NotFoundException(`Stem with id ${id} not found`)
		}

		return stem
	}

	async create(dto: CreateStemDto): Promise<StemEntity> {
		// Get the account record
		const account = await this.accountService.findAccountByAddress(dto.createdBy)
		if (!account) {
			throw new NotFoundException(`Account with address ${dto.createdBy} not found`)
		}

		// Get the project record
		const project = await this.projectService.findProjectById(dto.projectId)
		if (!project) {
			throw new NotFoundException(`Project with id ${dto.projectId} not found`)
		}

		// Create the stem entity with relationships
		const stem = this.stemRepository.create({
			...dto,
			createdBy: account,
			projectsAddedTo: [project],
		})

		// Save the stem first to get the ID, createdAt, updatedAt fields
		const savedStem = await this.save(stem)

		// Update account record
		account.uploadedStems = [...account.uploadedStems, savedStem]
		const savedAccount = await this.accountService.save(account)

		// Update project record
		project.stems = [...project.stems, savedStem]
		project.collaborators = [...project.collaborators, savedAccount]
		await this.projectService.save(project)

		// Return the new stem entity
		return savedStem
	}
}
