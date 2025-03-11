import { Column, Entity, Index, ManyToOne, Unique } from 'typeorm'

import { BaseEntity } from './base.entity'
import { ProjectEntity } from './project.entity'

@Entity('project_revisions')
@Unique(['project', 'version']) // add audioCID?
export class ProjectRevisionEntity extends BaseEntity<ProjectRevisionEntity> {
	@ManyToOne(() => ProjectEntity, project => project.revisions)
	project: ProjectEntity

	@Column('int')
	version: number

	/**
	 * @dev These should be an array of CIDs that point to the JSON metadata files for each stem that makes up part the revision.
	 */
	@Column({ name: 'stem_cids', type: 'simple-array' })
	stemCIDs: string[]

	@Column({ name: 'audio_cid' })
	@Index()
	audioCID: string

	@Column({ name: 'metadata_cid' })
	metadataCID: string
}
