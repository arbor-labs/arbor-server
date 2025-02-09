import { Column, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToOne, Unique } from 'typeorm'

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

	@ManyToOne(() => AccountEntity)
	createdBy: AccountEntity

	@JoinTable({ name: 'project_collaborators' })
	@ManyToMany(() => AccountEntity, entity => entity.collaboratedProjects, { cascade: true })
	collaborators: AccountEntity[]

	@JoinTable({ name: 'project_stems' })
	@ManyToMany(() => StemEntity, entity => entity.projectsAddedTo, { cascade: true })
	stems: StemEntity[]

	@JoinColumn()
	@OneToOne(() => ProjectQueueEntity, { cascade: true })
	queue: ProjectQueueEntity

	@JoinColumn()
	@OneToOne(() => VotingGroupEntity, { cascade: true })
	votingGroup: VotingGroupEntity

	// @Column({ type: 'simple-array', default: [] })
	// @OneToMany(() => SongEntity, entity => entity.project, { cascade: true })
	// songsMinted: SongEntity[]
}
