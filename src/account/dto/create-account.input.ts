import { Field, InputType } from '@nestjs/graphql'
import { Contains, IsEthereumAddress, IsString, Length } from 'class-validator'
import { EthereumAddress } from 'src/common/scalars/EthereumAddress'
import { Address, Hex } from 'viem'

import { EthereumSignature } from '@/common/scalars/EthereumSignature'

@InputType()
export class CreateAccountInput {
	@IsEthereumAddress()
	@Field(() => EthereumAddress)
	address: Address

	@IsString()
	@Contains('0x')
	@Length(132, 132)
	@Field(() => EthereumSignature)
	signature: Hex
}
