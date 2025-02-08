import { Field, ObjectType } from '@nestjs/graphql'

import { BaseType } from '@/common/types'

import { QueuedStemType } from './queued-stem.type'

@ObjectType('ProjectQueue')
export class ProjectQueueType extends BaseType {
	@Field(() => [QueuedStemType])
	stems: QueuedStemType[]
}
