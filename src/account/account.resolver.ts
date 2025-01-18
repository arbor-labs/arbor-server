import { Args, Query, Resolver } from '@nestjs/graphql'
import { SortInput } from 'src/common/dtos/sort.input'

import { AccountService } from './account.service'
import { PaginatedAccountsType } from './account.type'

@Resolver()
export class AccountResolver {
	constructor(private readonly accountService: AccountService) {}

	@Query(() => PaginatedAccountsType)
	accounts(@Args('sort', { nullable: true }) sort?: SortInput): Promise<PaginatedAccountsType> {
		return this.accountService.getAccounts(sort)
	}
}
