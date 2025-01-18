import { type SelectQueryBuilder } from 'typeorm'

import type { SortInput } from './dtos/sort.input.js'

/**
 * Utility class to add sorting support. Works with TypeORM's SelectQueryBuilder.
 */
export class SortingService {
	/**
	 * Applies an 'ORDER BY' SQL clause to the query builder
	 */
	static applySorting<T>(
		sortInput: SortInput,
		// @ts-expect-error This is valid...
		queryBuilder: SelectQueryBuilder<T>,
	) {
		const { key, asc } = sortInput
		queryBuilder.orderBy(`${queryBuilder.alias}.${key}`, asc ? 'ASC' : 'DESC')
	}
}
