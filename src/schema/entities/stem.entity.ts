import { Column, Entity, Index, JoinColumn, ManyToMany, ManyToOne, Unique } from 'typeorm'

import type { IPaginatedType } from '@/common/types'
import { ProjectEntity } from '@/schema/entities/project.entity'

import { EStemType } from '../enums/stem-type.enum'
import { AccountEntity } from './account.entity'
import { BaseEntity } from './base.entity'

@Entity('stems')
@Unique('UniqueStem', ['name', 'filename', 'filesize', 'audioCID'])
export class StemEntity extends BaseEntity<StemEntity> {
	@Column({ length: 50 })
	@Index()
	name: string

	// @Column({ length: 200 })
	// description: string

	// @Column('simple-array', { default: [] })
	// tags: string[]

	// @Column()
	// bpm: number

	@Column()
	type: EStemType

	@Column()
	metadataCID: string

	@Column()
	@Index()
	audioCID: string

	@Column()
	filename: string

	@Column()
	filetype: string

	@Column('int')
	filesize: number

	@ManyToOne(() => AccountEntity, account => account.uploadedStems)
	@JoinColumn()
	createdBy: AccountEntity

	@ManyToMany(() => ProjectEntity, project => project.stems)
	projectsAddedTo: ProjectEntity[]

	// @ManyToMany(() => SongEntity, song => song.stems)
	// songsIncludedIn: SongEntity[]
}

export type PaginatedStems = IPaginatedType<StemEntity>
