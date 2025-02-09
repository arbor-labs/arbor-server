import { Column, Entity, Index, JoinColumn, ManyToMany, OneToMany, Unique } from 'typeorm'
import { Address, Hex } from 'viem'

import { ProjectEntity } from '@/schema/entities/project.entity'

import { BaseEntity } from './base.entity'
import { SemaphoreIdentityEntity } from './semaphore-identity.entity'
import { StemEntity } from './stem.entity'

@Entity('accounts')
@Unique('UniqueAccountAddress', ['address'])
export class AccountEntity extends BaseEntity<AccountEntity> {
	@Column()
	@Index({ unique: true })
	address: Address

	@Column()
	@Index({ unique: true })
	onboardingSignature: Hex

	@Column({ nullable: true })
	displayName: string

	@Column({ nullable: true })
	avatarUrl: string // base64 encoded image

	// @Column({ type: 'simple-array', default: [] })
	@ManyToMany(() => ProjectEntity, entity => entity.collaborators)
	collaboratedProjects: ProjectEntity[]

	@JoinColumn()
	@OneToMany(() => StemEntity, entity => entity.createdBy)
	stems: StemEntity[]

	// @Column({ type: 'simple-array', default: [] })
	@OneToMany(() => SemaphoreIdentityEntity, entity => entity.account)
	voterIdentities: SemaphoreIdentityEntity[]

	// @Column({ type: 'simple-array', default: [] })
	// @OneToMany(() => SongEntity, entity => entity.createdBy)
	// createdSongs: SongEntity[]

	// @Column({ type: 'simple-array', default: [] })
	// @OneToMany(() => SongEntity, entity => entity.owner)
	// collectedSongs: SongEntity[]
}
