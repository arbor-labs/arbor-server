import { Module } from '@nestjs/common'

import { PinataDataScalar } from '@/common/scalars/PinataData.scalar'
import { StemModule } from '@/stem/stem.module'

import { PinataController } from './pinata.controller'
import { PinataResolver } from './pinata.resolver'
import { PinataService } from './pinata.service'

@Module({
	imports: [StemModule],
	providers: [PinataResolver, PinataService, PinataDataScalar],
	controllers: [PinataController],
})
export class PinataModule {}
