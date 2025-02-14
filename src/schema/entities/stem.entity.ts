import { Column, Entity, Index, ManyToMany, ManyToOne, Unique } from 'typeorm'

import { ProjectEntity } from '@/schema/entities/project.entity'

import { EFileType } from '../enums/file-type.enum'
import { EStemType } from '../enums/stem-type.enum'
import { AccountEntity } from './account.entity'
import { BaseEntity } from './base.entity'

@Entity('stems')
@Unique('UniqueStemName', ['name'])
export class StemEntity extends BaseEntity<StemEntity> {
	@Column({ length: 50 })
	@Index({ unique: true })
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
	audioCID: string

	// @Column()
	// metadataUrl: string

	// @Column()
	// audioUrl: string

	@Column()
	filename: string

	@Column()
	filetype: string

	@Column('int')
	filesize: number

	@ManyToOne(() => AccountEntity, account => account.uploadedStems)
	createdBy: AccountEntity

	@ManyToMany(() => ProjectEntity, project => project.stems)
	projectsAddedTo: ProjectEntity[]

	// @ManyToMany(() => SongEntity, song => song.stems)
	// songsIncludedIn: SongEntity[]
}
