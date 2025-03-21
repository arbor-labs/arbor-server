import type { ApolloDriverConfig } from '@nestjs/apollo'
import { ApolloDriver } from '@nestjs/apollo'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { GraphQLModule } from '@nestjs/graphql'
import { MulterModule } from '@nestjs/platform-express'
import { TypeOrmModule } from '@nestjs/typeorm'
import * as Joi from 'joi'
import { join } from 'path'
import { SnakeNamingStrategy } from 'typeorm-naming-strategies'

import { AccountModule } from './account/account.module'
import { LoggerModule } from './logger/logger.module'
import { ProjectModule } from './project/project.module'
import * as entities from './schema/entities'
import { StemModule } from './stem/stem.module'

@Module({
	imports: [
		// Config
		LoggerModule,
		ConfigModule.forRoot({
			isGlobal: true,
			validationSchema: Joi.object({
				DB_URL: Joi.string().required(),
				PORT: Joi.number().required(),
			}),
		}),
		// GraphQL
		GraphQLModule.forRoot<ApolloDriverConfig>({
			driver: ApolloDriver,
			autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
			sortSchema: true,
			playground: true,
			introspection: true,
		}),
		// File Upload - https://github.com/expressjs/multer#multeropts
		MulterModule.register({
			dest: './upload',
		}),
		// Database
		TypeOrmModule.forRootAsync({
			useFactory: (configService: ConfigService) => ({
				type: 'postgres',
				namingStrategy: new SnakeNamingStrategy(),
				url: configService.get('DB_URL') ?? 'MISSING_DB_URL',
				entities: Object.values(entities),
				migrations: [join(process.cwd(), 'db/migrations/*.js')],
				synchronize: process.env.NODE_ENV !== 'production',
				logging: true,
			}),
			inject: [ConfigService],
		}),
		// Other
		AccountModule,
		ProjectModule,
		StemModule,
	],
})
export class AppModule {}
