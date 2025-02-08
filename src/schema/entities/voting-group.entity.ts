import { Entity, JoinColumn, OneToMany } from 'typeorm'

import { BaseEntity } from './base.entity'
import { SemaphoreIdentityEntity } from './semaphore-identity.entity'

@Entity('voting_groups')
export class VotingGroupEntity extends BaseEntity<VotingGroupEntity> {
	@JoinColumn()
	@OneToMany(() => SemaphoreIdentityEntity, entity => entity.group)
	members: SemaphoreIdentityEntity[]
}
