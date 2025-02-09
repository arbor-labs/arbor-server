import { ValidationPipe } from '@nestjs/common'
import type { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface'
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

	// CORs
	const corsOptions: CorsOptions = {
		// Only allow from whitelisted domains
		origin: (origin, callback) => {
			const allowedOrigins = [
				// Development
				undefined,
				'http://localhost:3000',
				'http://localhost:5280',
				// Production
				'https://arbor-ui.vercel.app',
				'https://arbor.audio',
				'https://api.arbor.audio',
			]
			// Vercel Webapp builds
			// TODO: update in Vercel
			const vercelWebappRegex = /^https:\/\/arbor-*-dco\.vercel\.app$/

			if (allowedOrigins.includes(origin) || vercelWebappRegex.test(origin)) {
				callback(null, true)
			} else {
				callback(new Error(`Request from unauthorized origin: ${origin}`))
			}
		},
	}
	app.enableCors(corsOptions)

	// Listen for HTTP request
	await app.listen(PORT)
	app.get(Logger).log(`Server listening on port ${PORT}...`)
}
bootstrap()
