import { Field, ObjectType } from '@nestjs/graphql'
import { EthereumAddress } from 'src/common/scalars/EthereumAddress'
import { BaseType, Paginated } from 'src/common/types'
import { Address } from 'viem'

@ObjectType('Account')
export class AccountType extends BaseType {
	@Field(() => EthereumAddress)
	address: Address
}

@ObjectType('PaginatedAccounts')
export class PaginatedAccountsType extends Paginated(AccountType) {}
