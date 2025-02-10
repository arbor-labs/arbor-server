import type { SelectQueryBuilder } from 'typeorm'

import type { AccountEntity } from '@/schema/entities/account.entity'

import { SortingService } from './sorting.service'

describe('SortingService', () => {
	let qb: SelectQueryBuilder<AccountEntity>

	beforeEach(() => {
		qb = {} as SelectQueryBuilder<AccountEntity>
		qb.orderBy = jest.fn().mockReturnThis()
	})

	describe('applySorting', () => {
		it('should apply ascending sorting to the query builder', () => {
			qb.getQuery = jest.fn().mockReturnValue('SELECT * FROM accounts ORDER BY name ASC')

			const sortInput = { key: 'name', asc: true }

			SortingService.applySorting(sortInput, qb)

			expect(qb.getQuery()).toContain('ORDER BY')
			expect(qb.getQuery()).toContain('name ASC')
		})

		it('should apply descending sorting to the query builder', () => {
			qb.getQuery = jest.fn().mockReturnValue('SELECT * FROM accounts ORDER BY createdAt DESC')

			const sortInput = { key: 'createdAt', asc: false }

			SortingService.applySorting(sortInput, qb)

			expect(qb.getQuery()).toContain('ORDER BY')
			expect(qb.getQuery()).toContain('createdAt DESC')
		})
	})
})
