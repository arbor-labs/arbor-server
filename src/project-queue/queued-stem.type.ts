import { Field, Int, ObjectType } from '@nestjs/graphql'

import { BaseType } from '@/common/types'
import { StemType } from '@/stem/stem.type'

import { ProjectQueueType } from './project-queue.type'

@ObjectType('QueuedStem')
export class QueuedStemType extends BaseType {
	@Field(() => ProjectQueueType)
	queue: ProjectQueueType

	@Field(() => StemType)
	stem: StemType

	@Field(() => Int)
	votes: number
}
