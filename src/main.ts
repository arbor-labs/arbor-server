import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { Logger } from 'nestjs-pino'

import { AppModule } from './app.module'

async function bootstrap() {
	// App setup
	const app = await NestFactory.create(AppModule)
	const configService = app.get(ConfigService)
	const PORT: number = configService.get('PORT') ?? 5280

	// DTO Validation
	app.useGlobalPipes(new ValidationPipe({ whitelist: true }))

	// Pino Logger
	app.useLogger(app.get(Logger))

	// Listen for HTTP request
	await app.listen(PORT)
	app.get(Logger).log(`Server listening on http://localhost:${PORT}...`)
}
bootstrap()
