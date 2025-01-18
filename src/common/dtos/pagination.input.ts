import { Field, InputType, Int } from '@nestjs/graphql'
import { IsOptional, IsPositive, Max, Min } from 'class-validator'

import { PAGINATION_DEFAULTS } from '../constants'

// Defaults to page 1, count 10
// Page 1 is page 1 and will skip 0 to take the first 'count' amount
@InputType()
export class PaginationInput {
	@IsOptional()
	@IsPositive()
	@Min(1)
	@Max(999)
	@Field(() => Int, { nullable: true, defaultValue: PAGINATION_DEFAULTS.PAGE })
	page?: number

	@IsOptional()
	@IsPositive()
	@Min(1)
	@Max(100)
	@Field(() => Int, {
		nullable: true,
		defaultValue: PAGINATION_DEFAULTS.ITEMS_PER_PAGE,
	})
	limit?: number
}
