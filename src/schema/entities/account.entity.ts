import { Column, Entity, Index, JoinTable, ManyToMany, OneToMany, Unique } from 'typeorm'
import { Address, Hex } from 'viem'

import { ProjectEntity } from '@/schema/entities/project.entity'

import { BaseEntity } from './base.entity'
import { SemaphoreIdentityEntity } from './semaphore-identity.entity'
import { SongEntity } from './song.entity'
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

	@Column({ type: 'simple-array', default: [] })
	createdProjects: ProjectEntity[]

	@Column({ type: 'simple-array', default: [] })
	@JoinTable({ name: 'projects_collaborators' })
	@ManyToMany(() => ProjectEntity, entity => entity.collaborators)
	collaboratedProjects: ProjectEntity[]

	@Column({ type: 'simple-array', default: [] })
	@OneToMany(() => StemEntity, entity => entity.createdBy)
	stems: StemEntity[]

	@Column({ type: 'simple-array', default: [] })
	@OneToMany(() => SongEntity, entity => entity.createdBy)
	createdSongs: SongEntity[]

	@Column({ type: 'simple-array', default: [] })
	@OneToMany(() => SongEntity, entity => entity.owner)
	collectedSongs: SongEntity[]

	@Column({ type: 'simple-array', default: [] })
	@OneToMany(() => SemaphoreIdentityEntity, entity => entity.account)
	voterIdentities: SemaphoreIdentityEntity[]
}
