import { Field, Int, ObjectType } from '@nestjs/graphql'
import { BaseType, Paginated } from 'src/common/types'

import { AccountType } from '@/account/account.type'
import { ProjectType } from '@/project/project.type'
import { EFileType } from '@/schema/enums/file-type.enum'
import { EStemType } from '@/schema/enums/stem-type.enum'

@ObjectType('Stem')
export class StemType extends BaseType {
	@Field()
	name: string

	@Field()
	description: string

	@Field(() => [String])
	tags: string[]

	@Field(() => Int)
	bpm: number

	@Field()
	type: EStemType

	@Field()
	metadataUrl: string

	@Field()
	audioUrl: string

	@Field()
	audioHref: string

	@Field()
	filename: string

	@Field()
	filetype: EFileType

	@Field(() => Int)
	filesize: number

	@Field(() => AccountType)
	createdBy: AccountType

	@Field(() => [ProjectType])
	projectsAddedTo: ProjectType[]

	// @Field(() => [SongType])
	// songsIncludedIn: SongType[]
}

@ObjectType('PaginatedProjects')
export class PaginatedProjectsType extends Paginated(ProjectType) {}
