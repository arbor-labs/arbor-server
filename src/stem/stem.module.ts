import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { AccountModule } from '@/account/account.module'
import { ProjectModule } from '@/project/project.module'
import { StemEntity } from '@/schema/entities'

import { StemResolver } from './stem.resolver'
import { StemService } from './stem.service'

@Module({
	imports: [TypeOrmModule.forFeature([StemEntity]), AccountModule, ProjectModule],
	providers: [StemService, StemResolver],
	exports: [StemService],
})
export class StemModule {}
