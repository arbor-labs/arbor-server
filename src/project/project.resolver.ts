import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

import { SortInput } from '@/common/dtos/sort.input'

import { CreateProjectInput } from './dto/create-project.input'
import { ProjectService } from './project.service'
import { PaginatedProjectsType, ProjectType } from './project.type'

@Resolver()
export class ProjectResolver {
	constructor(private readonly projectService: ProjectService) {}

	@Mutation(() => ProjectType)
	async createProject(@Args('createProjectInput') createProjectInput: CreateProjectInput) {
		const projectRes = await this.projectService.create(createProjectInput)
		console.log({ projectRes })
		return projectRes
	}

	@Query(() => PaginatedProjectsType)
	projects(
		@Args('sort', { type: () => SortInput, nullable: true }) sort?: SortInput | undefined,
	): Promise<PaginatedProjectsType> {
		return this.projectService.findAll(sort)
	}
}
