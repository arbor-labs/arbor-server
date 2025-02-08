import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { AccountModule } from '@/account/account.module'
import { ProjectEntity } from '@/schema/entities'

import { ProjectResolver } from './project.resolver'
import { ProjectService } from './project.service'

@Module({
	imports: [TypeOrmModule.forFeature([ProjectEntity]), AccountModule],
	providers: [ProjectResolver, ProjectService],
})
export class ProjectModule {}
