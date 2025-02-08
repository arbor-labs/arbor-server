import { Field, ObjectType } from '@nestjs/graphql'

import { AccountType } from '@/account/account.type'
import { BaseType } from '@/common/types'
import { VotingGroupType } from '@/voting-group/voting-group.type'

@ObjectType('SemaphoreIdentity')
export class SemaphoreIdentityType extends BaseType {
	@Field(() => AccountType)
	account: AccountType

	@Field(() => VotingGroupType)
	group: VotingGroupType

	@Field()
	commitment: string

	@Field()
	nullifier: string

	@Field()
	trapdoor: string
}
