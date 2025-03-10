import { Module } from '@nestjs/common'

import { PinataDataScalar } from '@/common/scalars/PinataData.scalar'

import { PinataController } from './pinata.controller'
import { PinataResolver } from './pinata.resolver'
import { PinataService } from './pinata.service'

@Module({
	providers: [PinataResolver, PinataService, PinataDataScalar],
	controllers: [PinataController],
	exports: [PinataService],
})
export class PinataModule {}
