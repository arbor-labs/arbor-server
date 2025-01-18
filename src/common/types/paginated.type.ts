import type { Type } from '@nestjs/common'
import { Field, Int, ObjectType } from '@nestjs/graphql'

// Interfaces
export interface IPaginatedMeta {
	totalItems: number
	itemCount: number
	itemsPerPage: number
	totalPages: number
	currentPage: number
	itemType: string
}

export interface IPaginatedType<T> {
	items: T[]
	meta: IPaginatedMeta
}

// The GraphQL Type
@ObjectType('PaginatedMeta')
export abstract class PaginatedMeta implements IPaginatedMeta {
	@Field(() => Int)
	currentPage: number

	@Field(() => Int)
	totalPages: number

	@Field(() => Int)
	itemsPerPage: number

	@Field(() => Int)
	itemCount: number

	@Field(() => Int)
	totalItems: number

	@Field(() => String)
	itemType: string
}

// Utility function to create a generic paginated type
export function Paginated<T>(classRef: Type<T>): Type<IPaginatedType<T>> {
	@ObjectType({ isAbstract: true })
	abstract class PaginatedType implements IPaginatedType<T> {
		@Field(() => [classRef], { nullable: true })
		items: T[]

		@Field(() => PaginatedMeta)
		meta: PaginatedMeta
	}

	return PaginatedType as Type<IPaginatedType<T>>
}
