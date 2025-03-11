import { Inject, Injectable, Logger } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import Redis from 'ioredis'
import redisConfig from '@/config/redis.config'

@Injectable()
export class RedisCacheService {
	private readonly redis: Redis
	private readonly logger = new Logger(RedisCacheService.name)
	private readonly defaultTTL: number

	constructor(
		@Inject(redisConfig.KEY)
		private config: ConfigType<typeof redisConfig>,
	) {
		this.redis = new Redis({
			host: this.config.host,
			port: this.config.port,
			password: this.config.password,
		})
		this.defaultTTL = this.config.ttl
	}

	/**
	 * Generic method to get or fetch data with caching
	 * @param key Cache key
	 * @param fetchFn Function to fetch data if not in cache
	 * @param ttl Time to live in seconds
	 */
	async getOrSet<T>(key: string, fetchFn: () => Promise<T>, ttl: number = this.defaultTTL): Promise<T> {
		try {
			// Try to get from cache first
			const cached = await this.redis.get(key)
			if (cached) {
				this.logger.debug(`Cache hit for key: ${key}`)
				return JSON.parse(cached)
			}

			// If not in cache, fetch and store
			this.logger.debug(`Cache miss for key: ${key}`)
			const data = await fetchFn()
			await this.redis.set(key, JSON.stringify(data), 'EX', ttl)
			return data
		} catch (error) {
			this.logger.error(`Error in Redis operation: ${error.message}`)
			// If Redis fails, fallback to direct fetch
			return await fetchFn()
		}
	}

	/**
	 * Store binary data in Redis
	 */
	async setBinary(key: string, data: Buffer, ttl: number = this.defaultTTL): Promise<void> {
		await this.redis.set(key, data.toString('binary'), 'EX', ttl)
	}

	/**
	 * Get binary data from Redis
	 */
	async getBinary(key: string): Promise<Buffer | null> {
		const data = await this.redis.get(key)
		return data ? Buffer.from(data, 'binary') : null
	}

	/**
	 * Generate a cache key for project audio files
	 */
	generateProjectAudioKey(projectId: string, version?: number): string {
		return `project:${projectId}:audio${version ? `:${version}` : ''}`
	}

	/**
	 * Generate a cache key for stem audio files
	 */
	generateStemAudioKey(stemId: string): string {
		return `stem:${stemId}:audio`
	}

	/**
	 * Clear cache for a specific key
	 */
	async invalidate(key: string): Promise<void> {
		await this.redis.del(key)
	}
}
