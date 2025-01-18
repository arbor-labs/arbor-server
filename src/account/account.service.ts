import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import type { SortInput } from 'src/common/dtos/sort.input'
import { PaginationService } from 'src/common/pagination.service'
import { SortingService } from 'src/common/sorting.service'
import { AccountEntity } from 'src/schema/entities'
import { Repository } from 'typeorm'

import type { PaginatedAccountsType } from './account.type'
import type { CreateAccountInput } from './dtos/create-account.input'

@Injectable()
export class AccountService {
	constructor(
		@InjectRepository(AccountEntity)
		private accountRepository: Repository<AccountEntity>,
	) {}

	async createAccount(input: CreateAccountInput): Promise<AccountEntity> {
		const account = this.accountRepository.create(input)
		return await this.accountRepository.save(account)
	}

	async getAccounts(sort?: SortInput): Promise<PaginatedAccountsType> {
		const qb = this.accountRepository.createQueryBuilder('account')

		// Apply sorting
		if (sort) SortingService.applySorting(sort, qb)

		// Apply pagination
		const paginatedItems: PaginatedAccountsType = await PaginationService.getPaginatedItems({
			classRef: AccountEntity,
			qb,
		})

		return paginatedItems
	}
}
