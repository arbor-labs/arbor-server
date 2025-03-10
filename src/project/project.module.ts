import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { AccountModule } from '@/account/account.module'
import { AudioModule } from '@/audio/audio.module'
import { PinataModule } from '@/pinata/pinata.module'
import { ProjectEntity, ProjectRevisionEntity } from '@/schema/entities'
import { StemModule } from '@/stem/stem.module'

import { ProjectController } from './project.controller'
import { ProjectResolver } from './project.resolver'
import { ProjectService } from './project.service'
import { ProjectRevisionService } from './project-revision.service'
@Module({
	imports: [
		TypeOrmModule.forFeature([ProjectEntity, ProjectRevisionEntity]),
		AccountModule,
		StemModule,
		PinataModule,
		AudioModule,
	],
	providers: [ProjectResolver, ProjectService, ProjectRevisionService],
	exports: [ProjectService],
	controllers: [ProjectController],
})
export class ProjectModule {}
