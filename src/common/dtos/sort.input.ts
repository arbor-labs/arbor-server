import { Field, InputType } from '@nestjs/graphql'
import { IsBoolean, IsDefined, IsString } from 'class-validator'

@InputType()
export class SortInput {
	@IsDefined()
	@IsString()
	// TODO: @IsFieldOfEntity<T>()
	@Field()
	key: string

	@IsDefined()
	@IsBoolean()
	@Field()
	asc: boolean
}
