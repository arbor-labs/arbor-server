import type { Type } from '@nestjs/common'
import { type SelectQueryBuilder } from 'typeorm'

import { PAGINATION_DEFAULTS } from './constants'
import type { IPaginatedType, IPaginationMeta } from './types/paginated.type'

export interface GetPaginatedItemsOptions<T> {
	classRef: Type<T>
	page?: number | undefined
	limit?: number | undefined
	// @ts-expect-error This is valid...
	qb: SelectQueryBuilder<T>
}

/**
 * Utility class to add pagination support. Fetches and paginates data using TypeORM's SelectQueryBuilder.
 */
export class PaginationService {
	/**
	 * Fetches the paginated data and constructs a PaginatedType of type T, the Entity.
	 * It defaults to getting all entities with the pagination of page 1 and 10 items per page.
	 * @param options - The options to create the paginated meta
	 * @returns A paginated response object with both the paginated subset of items and the pagination metadata
	 */
	static async getPaginatedItems<T>(options: GetPaginatedItemsOptions<T>): Promise<IPaginatedType<T>> {
		const page = options.page ?? PAGINATION_DEFAULTS.PAGE
		const limit = options.limit ?? PAGINATION_DEFAULTS.ITEMS_PER_PAGE
		const totalItems = await options.qb.getCount()
		const items = await options.qb
			.skip((page - 1) * limit)
			.take(limit)
			.getMany()
		const meta: IPaginationMeta = {
			currentPage: page,
			totalPages: Math.ceil(totalItems / limit),
			itemsPerPage: limit,
			itemCount: items.length,
			totalItems,
			itemType: options.classRef.name,
		}
		const paginatedItems: IPaginatedType<T> = { items, meta }
		return paginatedItems
	}
}
