import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

import { SortInput } from '@/common/dtos/sort.input'
import type { PaginatedProjects, ProjectEntity } from '@/schema/entities'

import { CreateProjectInput } from './dto/create-project.input'
import { ProjectService } from './project.service'
import { PaginatedProjectsType, ProjectType } from './project.type'

@Resolver()
export class ProjectResolver {
	constructor(private readonly projectService: ProjectService) {}

	@Mutation(() => ProjectType)
	async createProject(@Args('createProjectInput') createProjectInput: CreateProjectInput) {
		return await this.projectService.create(createProjectInput)
	}

	@Query(() => PaginatedProjectsType)
	projects(
		@Args('sort', { type: () => SortInput, nullable: true }) sort?: SortInput | undefined,
	): Promise<PaginatedProjects> {
		return this.projectService.findAll(sort)
	}

	@Query(() => ProjectType)
	project(@Args('id') id: string): Promise<ProjectEntity> {
		return this.projectService.findProjectById(id)
	}
}
