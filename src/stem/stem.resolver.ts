import { Args, Query, Resolver } from '@nestjs/graphql'

import { SortInput } from '@/common/dtos/sort.input'
import type { PaginatedStems, StemEntity } from '@/schema/entities'

import { StemService } from './stem.service'
import { PaginatedStemsType } from './stem.type'
import { StemType } from './stem.type'

@Resolver()
export class StemResolver {
	constructor(private readonly stemService: StemService) {}

	@Query(() => PaginatedStemsType)
	stems(
		@Args('sort', { type: () => SortInput, nullable: true }) sort?: SortInput | undefined,
	): Promise<PaginatedStems> {
		return this.stemService.findAll(sort)
	}

	@Query(() => StemType)
	async stem(@Args('id') id: string): Promise<StemEntity> {
		return this.stemService.findStemById(id)
	}
}
