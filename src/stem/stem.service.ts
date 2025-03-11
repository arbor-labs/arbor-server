import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { AccountService } from '@/account/account.service'
import type { SortInput } from '@/common/dtos/sort.input'
import { PaginationService } from '@/common/pagination.service'
import { SortingService } from '@/common/sorting.service'
import type { PaginatedStems, ProjectEntity } from '@/schema/entities'
import { StemEntity } from '@/schema/entities'

import type { CreateStemDto } from './dto/create-stem.dto'

@Injectable()
export class StemService {
	constructor(
		@InjectRepository(StemEntity) private stemRepository: Repository<StemEntity>,
		@Inject(AccountService) private accountService: AccountService,
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
		if (!stem) throw new NotFoundException(`Stem with id ${id} not found`)
		return stem
	}

	async findStemByAudioCID(audioCID: string): Promise<StemEntity | null> {
		return await this.stemRepository.findOne({ where: { audioCID } })
	}

	async findStemByMetadataCID(metadataCID: string): Promise<StemEntity | null> {
		return await this.stemRepository.findOne({ where: { metadataCID } })
	}

	// TODO: Create a stem without adding it to a project
	// Always post-saving it to IPFS

	async create(dto: CreateStemDto, project?: ProjectEntity): Promise<StemEntity> {
		// 1. Validate
		const account = await this.accountService.findAccountByAddress(dto.createdBy)
		// 2. Create
		const stem = this.stemRepository.create({
			...dto,
			createdBy: account,
			projectsAddedTo: project ? [project] : [],
		})
		// 3. Save
		const savedStem = await this.save(stem)
		return savedStem
	}
}
