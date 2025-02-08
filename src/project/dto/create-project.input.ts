import { Field, InputType, Int } from '@nestjs/graphql'
import { IsArray, IsDefined, IsEthereumAddress, IsNumber, IsString, Max, MaxLength, Min } from 'class-validator'
import { Address } from 'viem'

import { EthereumAddress } from '@/common/scalars/EthereumAddress'

@InputType()
export class CreateProjectInput {
	@Field(() => EthereumAddress)
	@IsDefined()
	@IsEthereumAddress()
	createdBy: Address

	@Field()
	@IsDefined()
	@IsString()
	@MaxLength(50)
	name: string

	@Field()
	@IsString()
	@MaxLength(300)
	description: string

	@Field(() => [String], { nullable: true, defaultValue: [] })
	@IsArray()
	tags: string[]

	@Field(() => Int)
	@IsDefined()
	@IsNumber()
	@Min(1)
	@Max(300)
	bpm: number

	@Field(() => Int)
	@IsDefined()
	@IsNumber()
	@Min(1)
	@Max(20)
	trackLimit: number
}
