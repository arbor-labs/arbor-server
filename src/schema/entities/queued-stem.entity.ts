import { Column, Entity, ManyToOne } from 'typeorm'

import { BaseEntity } from './base.entity'
import { ProjectQueueEntity } from './project-queue.entity'
import { StemEntity } from './stem.entity'

@Entity('queued_stems')
export class QueuedStemEntity extends BaseEntity<QueuedStemEntity> {
	@ManyToOne(() => ProjectQueueEntity, entity => entity.stems)
	queue: ProjectQueueEntity

	@ManyToOne(() => StemEntity)
	stem: StemEntity

	@Column()
	votes: number
}
