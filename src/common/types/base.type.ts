import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType('BaseType')
export class BaseType {
	@Field(() => ID)
	id: string

	@Field()
	createdAt: Date

	@Field()
	updatedAt: Date
}
