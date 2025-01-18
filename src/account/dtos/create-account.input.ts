import { Field, InputType } from '@nestjs/graphql';
import { IsEthereumAddress } from 'class-validator';
import { EthereumAddress } from 'src/common/scalars/EthereumAddress';
import { Address } from 'viem';

@InputType()
export class CreateAccountInput {
	@IsEthereumAddress()
	@Field(() => EthereumAddress)
	address: Address
}
