import type { Type } from '@nestjs/common'
import { AccountFactory } from 'test/factories'
import type { SelectQueryBuilder } from 'typeorm'

import type { AccountEntity } from '@/schema/entities/account.entity'

import { type GetPaginatedItemsOptions, PaginationService } from './pagination.service'

describe('PaginationService', () => {
	let accounts: AccountEntity[]
	let options: GetPaginatedItemsOptions<AccountEntity>

	beforeEach(() => {
		// Create fresh mock data
		;(accounts = AccountFactory.buildList(20)),
			(options = {
				classRef: { name: 'AccountEntity' } as Type<AccountEntity>,
				qb: {} as SelectQueryBuilder<AccountEntity>,
			})
		options.qb.getMany = jest.fn().mockResolvedValue(accounts)
		options.qb.getCount = jest.fn().mockResolvedValue(accounts.length)
		options.qb.skip = jest.fn().mockReturnThis()
		options.qb.take = jest.fn().mockReturnThis()
	})

	describe('getPaginatedItems', () => {
		it('should return paginated items with metadata with default values', async () => {
			const result = await PaginationService.getPaginatedItems<AccountEntity>(options)
			const expectedMeta = {
				currentPage: 1,
				totalPages: 2,
				itemsPerPage: 10,
				itemCount: 20,
				totalItems: 20,
				itemType: 'AccountEntity',
			}
			expect(result).toEqual({
				items: accounts,
				meta: expectedMeta,
			})
		})

		it('should return paginated items with metadata with custom limit', async () => {
			options = { ...options, limit: 3 }
			const result = await PaginationService.getPaginatedItems<AccountEntity>(options)
			const expectedMeta = {
				currentPage: 1,
				totalPages: 7,
				itemsPerPage: 3,
				itemCount: 20,
				totalItems: 20,
				itemType: 'AccountEntity',
			}
			expect(result).toEqual({
				items: accounts,
				meta: expectedMeta,
			})
		})

		it('should return paginated items with metadata with custom page', async () => {
			options = { ...options, page: 2 }
			const result = await PaginationService.getPaginatedItems<AccountEntity>(options)
			const expectedMeta = {
				currentPage: 2,
				totalPages: 2,
				itemsPerPage: 10,
				itemCount: 20,
				totalItems: 20,
				itemType: 'AccountEntity',
			}
			expect(result).toEqual({
				items: accounts,
				meta: expectedMeta,
			})
		})

		it('should return nothing if no items are found for the given page', async () => {
			options = { ...options, page: 3 }
			options.qb.getMany = jest.fn().mockResolvedValue([])
			options.qb.getCount = jest.fn().mockResolvedValue(0)
			const result = await PaginationService.getPaginatedItems<AccountEntity>(options)
			const expectedMeta = {
				currentPage: 3,
				totalPages: 0,
				itemsPerPage: 10,
				itemCount: 0,
				totalItems: 0,
				itemType: 'AccountEntity',
			}
			expect(result).toEqual({
				items: [],
				meta: expectedMeta,
			})
		})
	})
})
