import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'
import type { SortInput } from 'src/common/dtos/sort.input'

import { AccountResolver } from './account.resolver'
import { AccountService } from './account.service'
import type { PaginatedAccountsType } from './account.type'

describe('AccountResolver', () => {
	let resolver: AccountResolver
	let accountService: AccountService

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AccountResolver,
				{
					provide: AccountService,
					useValue: {
						getAccounts: jest.fn(),
					},
				},
			],
		}).compile()

		resolver = module.get<AccountResolver>(AccountResolver)
		accountService = module.get<AccountService>(AccountService)
	})

	it('should be defined', () => {
		expect(resolver).toBeDefined()
	})

	describe('accounts', () => {
		it('should call accountService.getAccounts with correct parameters', async () => {
			const sortInput: SortInput = { key: 'address', asc: true }
			const result: PaginatedAccountsType = {
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

			jest.spyOn(accountService, 'getAccounts').mockResolvedValue(result)

			expect(await resolver.accounts(sortInput)).toBe(result)
			expect(accountService.getAccounts).toHaveBeenCalledWith(sortInput)
		})

		it('should call accountService.getAccounts with no parameters', async () => {
			const result: PaginatedAccountsType = {
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

			jest.spyOn(accountService, 'getAccounts').mockResolvedValue(result)

			expect(await resolver.accounts()).toBe(result)
			expect(accountService.getAccounts).toHaveBeenCalledWith(undefined)
		})
	})
})
