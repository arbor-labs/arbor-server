import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import type { SortInput } from 'src/common/dtos/sort.input'
import { PaginationService } from 'src/common/pagination.service'
import { SortingService } from 'src/common/sorting.service'
import { AccountEntity } from 'src/schema/entities'
import { Repository } from 'typeorm'

import { AccountService } from './account.service'
import type { PaginatedAccountsType } from './account.type'

describe('AccountService', () => {
	let service: AccountService
	let repository: Repository<AccountEntity>

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AccountService,
				{
					provide: getRepositoryToken(AccountEntity),
					useClass: Repository,
				},
				{
					provide: PaginationService,
					useValue: {
						getPaginatedItems: jest.fn(),
					},
				},
				{
					provide: SortingService,
					useValue: {
						applySorting: jest.fn(),
					},
				},
			],
		}).compile()

		service = module.get<AccountService>(AccountService)
		repository = module.get<Repository<AccountEntity>>(getRepositoryToken(AccountEntity))
		repository.createQueryBuilder = jest.fn().mockReturnValue({
			orderBy: jest.fn(),
		})
	})

	it('should be defined', () => {
		expect(service).toBeDefined()
	})

	describe('getAccounts', () => {
		it('should return paginated accounts', async () => {
			const paginatedAccounts: PaginatedAccountsType = {
				items: [],
				meta: {
					itemCount: 0,
					totalItems: 0,
					itemsPerPage: 0,
					totalPages: 0,
					currentPage: 0,
					itemType: 'AccountEntity',
				},
			}
			jest.spyOn(PaginationService, 'getPaginatedItems').mockResolvedValue(paginatedAccounts)

			const result = await service.getAccounts()

			expect(result).toEqual(paginatedAccounts)
			expect(PaginationService.getPaginatedItems).toHaveBeenCalled()
		})

		it('should apply sorting if sort input is provided', async () => {
			const sortInput: SortInput = { key: 'address', asc: true }
			const paginatedAccounts: PaginatedAccountsType = {
				items: [],
				meta: {
					itemCount: 0,
					totalItems: 0,
					itemsPerPage: 0,
					totalPages: 0,
					currentPage: 0,
					itemType: 'AccountEntity',
				},
			}
			jest.spyOn(SortingService, 'applySorting').mockImplementation()
			jest.spyOn(PaginationService, 'getPaginatedItems').mockResolvedValue(paginatedAccounts)

			const result = await service.getAccounts(sortInput)

			expect(result).toEqual(paginatedAccounts)
			expect(SortingService.applySorting).toHaveBeenCalledWith(sortInput, repository.createQueryBuilder())
			expect(PaginationService.getPaginatedItems).toHaveBeenCalled()
		})
	})
})
