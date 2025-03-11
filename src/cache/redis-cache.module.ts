import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import redisConfig from '@/config/redis.config'
import { RedisCacheService } from './redis-cache.service'

@Module({
	imports: [ConfigModule.forFeature(redisConfig)],
	providers: [RedisCacheService],
	exports: [RedisCacheService],
})
export class RedisCacheModule {}
