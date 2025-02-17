import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { EntityNotFoundError, Repository } from 'typeorm'
import { type Address, getAddress } from 'viem'

import type { SortInput } from '@/common/dtos/sort.input'
import { PaginationService } from '@/common/pagination.service'
import { SortingService } from '@/common/sorting.service'
import type { PaginatedAccounts } from '@/schema/entities'
import { AccountEntity } from '@/schema/entities'
import { generateAvatarURI } from '@/utils/generateAvatarURI'

import type { CreateAccountInput } from './dto/create-account.input'

@Injectable()
export class AccountService {
	constructor(
		@InjectRepository(AccountEntity)
		private accountRepository: Repository<AccountEntity>,
	) {}

	async save(account: AccountEntity): Promise<AccountEntity> {
		return await this.accountRepository.save(account)
	}

	async findAll(sort?: SortInput | undefined): Promise<PaginatedAccounts> {
		const qb = this.accountRepository.createQueryBuilder('account')

		// Apply sorting
		if (sort) SortingService.applySorting(sort, qb)

		// Apply pagination
		const paginatedItems = await PaginationService.getPaginatedItems<AccountEntity>({
			classRef: AccountEntity,
			qb,
		})

		return paginatedItems
	}

	async findAccountByAddress(address: Address): Promise<AccountEntity> {
		const checksumAddress = getAddress(address)
		const account = await this.accountRepository.findOne({
			where: { address: checksumAddress },
			relations: {
				createdProjects: true,
				collaboratedProjects: true,
				uploadedStems: true,
				voterIdentities: true,
			},
		})
		if (!account) throw new EntityNotFoundError(AccountEntity, { address })
		return account
	}

	async createAccount(createAccountInput: CreateAccountInput): Promise<AccountEntity> {
		const checksumAddress = getAddress(createAccountInput.address)
		const account = this.accountRepository.create({
			onboardingSignature: createAccountInput.signature,
			address: checksumAddress,
			avatarUri: await generateAvatarURI(),
			createdProjects: [],
			collaboratedProjects: [],
			uploadedStems: [],
			voterIdentities: [],
		})
		return await this.save(account)
	}

	async updateAvatarUri(account: AccountEntity): Promise<AccountEntity> {
		const existingAccount = await this.accountRepository.findOneBy({ id: account.id })
		if (!existingAccount) throw new EntityNotFoundError(AccountEntity, { id: account.id })
		existingAccount.avatarUri = await generateAvatarURI()
		return await this.save(existingAccount)
	}

	// async findOrCreateAccount(createAccountInput: CreateAccountInput): Promise<AccountEntity> {
	// 	const checksumAddress = getAddress(createAccountInput.address)
	// 	const account = await this.accountRepository.findOneBy({ address: checksumAddress })
	// 	if (account) return account
	// 	const newAccount = await this.createAccount(createAccountInput)
	// 	return newAccount
	// }
}
