import { Module } from '@nestjs/common'
import { StemService } from './stem.service'
import { StemResolver } from './stem.resolver'

import { StemEntity } from '@/schema/entities'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AccountModule } from '@/account/account.module'
import { ProjectModule } from '@/project/project.module'

@Module({
	imports: [TypeOrmModule.forFeature([StemEntity]), AccountModule, ProjectModule],
	providers: [StemService, StemResolver],
	exports: [StemService],
})
export class StemModule {}
