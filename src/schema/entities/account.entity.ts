import { Column, Entity, Index, ManyToMany, OneToMany, Unique } from 'typeorm'
import { Address, Hex } from 'viem'

import type { IPaginatedType } from '@/common/types'
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
	avatarUri: string

	@OneToMany(() => ProjectEntity, project => project.createdBy)
	createdProjects: ProjectEntity[]

	@ManyToMany(() => ProjectEntity, project => project.collaborators)
	collaboratedProjects: ProjectEntity[]

	@OneToMany(() => StemEntity, stem => stem.createdBy)
	uploadedStems: StemEntity[]

	// @Column({ type: 'simple-array', default: [] })
	@OneToMany(() => SemaphoreIdentityEntity, identity => identity.account)
	voterIdentities: SemaphoreIdentityEntity[]

	// @Column({ type: 'simple-array', default: [] })
	// @OneToMany(() => SongEntity, song => song.createdBy)
	// createdSongs: SongEntity[]

	// @Column({ type: 'simple-array', default: [] })
	// @OneToMany(() => SongEntity, song => songsIncludedIn.owner)
	// collectedSongs: SongEntity[]
}

export type PaginatedAccounts = IPaginatedType<AccountEntity>
