import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { SortInput } from 'src/common/dtos/sort.input'
import { Address } from 'viem'

import { EthereumAddress } from '@/common/scalars/EthereumAddress'

import { AccountService } from './account.service'
import { AccountType, PaginatedAccountsType } from './account.type'
import { CreateAccountInput } from './dto/create-account.input'

@Resolver()
export class AccountResolver {
	constructor(private readonly accountService: AccountService) {}

	@Mutation(() => AccountType)
	createAccount(@Args('createAccountInput') createAccountInput: CreateAccountInput): Promise<AccountType> {
		return this.accountService.createAccount(createAccountInput)
	}

	@Mutation(() => AccountType)
	findOrCreateAccount(@Args('createAccountInput') createAccountInput: CreateAccountInput): Promise<AccountType> {
		return this.accountService.findOrCreateAccount(createAccountInput)
	}

	@Query(() => PaginatedAccountsType)
	accounts(
		@Args('sort', { type: () => SortInput, nullable: true }) sort?: SortInput | undefined,
	): Promise<PaginatedAccountsType> {
		return this.accountService.findAll(sort)
	}

	@Query(() => AccountType, { nullable: true })
	account(@Args('address', { type: () => EthereumAddress }) address: Address) {
		return this.accountService.findAccountByAddress(address)
	}
}
