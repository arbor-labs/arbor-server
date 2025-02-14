import { Module } from '@nestjs/common'

import { PinataResolver } from './pinata.resolver'
import { PinataService } from './pinata.service'
import { PinataController } from './pinata.controller'
import { PinataDataScalar } from '@/common/scalars/PinataDataType.scalar'
import { StemModule } from '@/stem/stem.module'

@Module({
	imports: [StemModule],
	providers: [PinataResolver, PinataService, PinataDataScalar],
	controllers: [PinataController],
})
export class PinataModule {}
