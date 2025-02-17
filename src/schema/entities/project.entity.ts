import { Column, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToOne, Unique } from 'typeorm'

import type { IPaginatedType } from '@/common/types'

import { AccountEntity } from './account.entity'
import { BaseEntity } from './base.entity'
import { ProjectQueueEntity } from './project-queue.entity'
import { StemEntity } from './stem.entity'
import { VotingGroupEntity } from './voting-group.entity'

@Entity('projects')
@Unique('UniqueProjectName', ['name'])
export class ProjectEntity extends BaseEntity<ProjectEntity> {
	@Column({ length: 50 })
	@Index({ unique: true })
	name: string

	@Column({ length: 300 })
	description: string

	@Column('simple-array', { default: [] })
	tags: string[]

	@Column()
	bpm: number

	@Column()
	trackLimit: number

	@ManyToOne(() => AccountEntity, account => account.createdProjects)
	@JoinColumn()
	createdBy: AccountEntity

	@ManyToMany(() => AccountEntity, account => account.collaboratedProjects)
	@JoinTable({ name: 'project_collaborators' })
	collaborators: AccountEntity[]

	@ManyToMany(() => StemEntity, stem => stem.projectsAddedTo)
	@JoinTable({ name: 'project_stems' })
	stems: StemEntity[]

	@OneToOne(() => ProjectQueueEntity, { cascade: true })
	@JoinColumn()
	queue: ProjectQueueEntity

	@OneToOne(() => VotingGroupEntity, { cascade: true })
	@JoinColumn()
	votingGroup: VotingGroupEntity

	// @Column({ type: 'simple-array', default: [] })
	// @OneToMany(() => SongEntity, song => song.project)
	// songsMinted: SongEntity[]
}

export type PaginatedProjects = IPaginatedType<ProjectEntity>
