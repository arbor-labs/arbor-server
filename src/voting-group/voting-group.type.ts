import { Field, ObjectType } from '@nestjs/graphql'

import { BaseType } from '@/common/types'
import { SemaphoreIdentityType } from '@/semaphore-identity/semaphore-identity.type'

@ObjectType('VotingGroup')
export class VotingGroupType extends BaseType {
	@Field(() => [SemaphoreIdentityType])
	members: SemaphoreIdentityType[]
}
