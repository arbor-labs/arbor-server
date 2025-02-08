import { Field, Int, ObjectType } from '@nestjs/graphql'
import { BaseType, Paginated } from 'src/common/types'

import { AccountType } from '@/account/account.type'
import { ProjectQueueType } from '@/project-queue/project-queue.type'
import { StemType } from '@/stem/stem.type'
import { VotingGroupType } from '@/voting-group/voting-group.type'

@ObjectType('Project')
export class ProjectType extends BaseType {
	@Field()
	name: string

	@Field()
	description: string

	@Field(() => [String])
	tags: string[]

	@Field(() => Int)
	bpm: number

	@Field(() => Int)
	trackLimit: number

	@Field(() => AccountType)
	createdBy: AccountType

	@Field(() => [AccountType])
	collaborators: AccountType[]

	@Field(() => [StemType])
	stems: StemType[]

	@Field(() => ProjectQueueType)
	queue: ProjectQueueType

	// @Field(() => [String])
	// songsMinted: string[]

	@Field(() => VotingGroupType)
	votingGroup: VotingGroupType
}

@ObjectType('PaginatedProjects')
export class PaginatedProjectsType extends Paginated(ProjectType) {}
