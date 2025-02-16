import { Field, ID, ObjectType } from '@nestjs/graphql'
import { GraphQLDateTimeISO } from 'graphql-scalars'

@ObjectType('BaseType')
export class BaseType {
	@Field(() => ID)
	id: string

	@Field(() => GraphQLDateTimeISO)
	createdAt: Date

	@Field(() => GraphQLDateTimeISO)
	updatedAt: Date
}
