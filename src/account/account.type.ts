import { Field, ObjectType } from '@nestjs/graphql'
import { EthereumAddress } from 'src/common/scalars/EthereumAddress'
import { BaseType, Paginated } from 'src/common/types'
import { Address, Hex } from 'viem'

import { EthereumSignature } from '@/common/scalars/EthereumSignature'
import { ProjectType } from '@/project/project.type'
import { SemaphoreIdentityType } from '@/semaphore-identity/semaphore-identity.type'
import { StemType } from '@/stem/stem.type'

@ObjectType('Account')
export class AccountType extends BaseType {
	@Field(() => EthereumAddress)
	address: Address

	@Field(() => EthereumSignature)
	onboardingSignature: Hex

	@Field(() => String, { nullable: true })
	displayName: string

	@Field(() => String)
	avatarUri: string

	@Field(() => [ProjectType], { defaultValue: [] })
	createdProjects: ProjectType[]

	@Field(() => [ProjectType], { defaultValue: [] })
	collaboratedProjects: ProjectType[]

	@Field(() => [StemType], { defaultValue: [] })
	uploadedStems: StemType[]

	// @Field(() => [SongType])
	// createdSongs: SongEntity[]

	// @Field(() => [SongType])
	// collectedSongs: SongType[]

	@Field(() => [SemaphoreIdentityType])
	voterIdentities: SemaphoreIdentityType[]
}

@ObjectType('PaginatedAccounts')
export class PaginatedAccountsType extends Paginated(AccountType) {}
