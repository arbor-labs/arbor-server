import { Field, ObjectType } from '@nestjs/graphql'
import { EthereumAddress } from 'src/common/scalars/EthereumAddress'
import { Paginated } from 'src/common/types'
import { Address } from 'viem'

@ObjectType('Account')
export class AccountType {
	@Field(() => EthereumAddress)
	address: Address
}

@ObjectType('PaginatedAccounts')
export class PaginatedAccountsType extends Paginated(AccountType) {}
