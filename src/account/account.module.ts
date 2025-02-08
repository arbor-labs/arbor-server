import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { AccountEntity } from '@/schema/entities'

import { AccountResolver } from './account.resolver'
import { AccountService } from './account.service'

@Module({
	imports: [TypeOrmModule.forFeature([AccountEntity])],
	providers: [AccountResolver, AccountService],
	exports: [AccountService],
})
export class AccountModule {}
