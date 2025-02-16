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
			projectsAddedTo: [project], // Initial project that it's being added to, since this is only called when first uploading a stem to a project
		})

		// Save the stem entity with its relationships
		const savedStem = await this.stemRepository.save(stem)

		// Add stem to project
		await this.projectService.addStemToProject(project.id, savedStem)

		return savedStem
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
}
