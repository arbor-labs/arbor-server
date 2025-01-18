import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { SortInput } from 'src/common/dtos/sort.input'

import { AccountService } from './account.service'
import { AccountType, PaginatedAccountsType } from './account.type'
import { CreateAccountInput } from './dtos/create-account.input'

@Resolver()
export class AccountResolver {
	constructor(private readonly accountService: AccountService) {}

	@Mutation(() => AccountType)
	createAccount(@Args('createAccountInput') createAccountInput: CreateAccountInput): Promise<AccountType> {
		return this.accountService.createAccount(createAccountInput)
	}

	@Query(() => PaginatedAccountsType)
	accounts(@Args('sort', { nullable: true }) sort?: SortInput): Promise<PaginatedAccountsType> {
		return this.accountService.getAccounts(sort)
	}

}
