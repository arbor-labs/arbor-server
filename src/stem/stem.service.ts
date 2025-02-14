import { ProjectEntity, StemEntity, type AccountEntity } from '@/schema/entities'
import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateStemDto } from './dto/create-stem.dto'
import { AccountService } from '@/account/account.service'
import { ProjectService } from '@/project/project.service'

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
}
