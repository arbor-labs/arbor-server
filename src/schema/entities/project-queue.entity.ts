import { Entity, JoinColumn, OneToMany } from 'typeorm'

import { BaseEntity } from './base.entity'
import { QueuedStemEntity } from './queued-stem.entity'

@Entity('project_queues')
export class ProjectQueueEntity extends BaseEntity<ProjectQueueEntity> {
	@OneToMany(() => QueuedStemEntity, stem => stem.queue)
	@JoinColumn()
	stems: QueuedStemEntity[]
}
