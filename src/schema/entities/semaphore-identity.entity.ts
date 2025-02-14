import { Column, Entity, ManyToOne } from 'typeorm'

import { AccountEntity } from './'
import { BaseEntity } from './base.entity'
import { VotingGroupEntity } from './voting-group.entity'

@Entity('semaphore_identities')
export class SemaphoreIdentityEntity extends BaseEntity<SemaphoreIdentityEntity> {
	@Column({ type: 'simple-array', default: [] })
	@ManyToOne(() => AccountEntity, account => account.voterIdentities)
	account: AccountEntity

	@Column({ type: 'simple-array', default: [] })
	@ManyToOne(() => VotingGroupEntity, group => group.members)
	group: VotingGroupEntity

	@Column()
	commitment: string

	@Column()
	nullifier: string

	@Column()
	trapdoor: string
}
