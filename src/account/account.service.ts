import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import type { SortInput } from 'src/common/dtos/sort.input'
import { PaginationService } from 'src/common/pagination.service'
import { SortingService } from 'src/common/sorting.service'
import { AccountEntity } from 'src/schema/entities'
import { EntityNotFoundError, Repository } from 'typeorm'
import { type Address, getAddress } from 'viem'

import type { PaginatedAccountsType } from './account.type'
import type { CreateAccountInput } from './dto/create-account.input'

@Injectable()
export class AccountService {
	constructor(
		@InjectRepository(AccountEntity)
		private accountRepository: Repository<AccountEntity>,
	) {}

	async createAccount(createAccountInput: CreateAccountInput): Promise<AccountEntity> {
		// throw new BadRequestException('Creating account: Not implemented')
		const checksumAddress = getAddress(createAccountInput.address)
		const account = this.accountRepository.create({
			onboardingSignature: createAccountInput.signature,
			address: checksumAddress,
		})
		return await this.accountRepository.save(account)
	}

	async findAll(sort?: SortInput | undefined): Promise<PaginatedAccountsType> {
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

	async findAccountByAddress(address: Address): Promise<AccountEntity> {
		// throw new BadRequestException('Finding account: Not implemented')
		const checksumAddress = getAddress(address)
		const account = await this.accountRepository.findOneBy({ address: checksumAddress })
		if (!account) throw new EntityNotFoundError(AccountEntity, { address })
		return account
	}

	async findOrCreateAccount(createAccountInput: CreateAccountInput): Promise<AccountEntity> {
		const checksumAddress = getAddress(createAccountInput.address)
		const account = await this.accountRepository.findOneBy({ address: checksumAddress })
		if (account) return account
		const newAccount = await this.createAccount(createAccountInput)
		return newAccount
	}
}
