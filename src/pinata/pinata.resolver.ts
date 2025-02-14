import { Args, Query, Resolver } from '@nestjs/graphql'
import { PinataService } from './pinata.service'
import { GetCIDResponse } from 'pinata-web3'
import { PinataCIDResponseType } from './pinata.type'

@Resolver()
export class PinataResolver {
	constructor(private readonly pinataService: PinataService) {}

	@Query(() => PinataCIDResponseType)
	async getFile(@Args('cid') cid: string): Promise<GetCIDResponse> {
		return await this.pinataService.getFile(cid)
	}
}
