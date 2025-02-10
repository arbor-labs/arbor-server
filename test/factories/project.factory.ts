import type { PoolParamsEntity } from '@alkimiya/schema'
import { EPoolIndexName } from '@alkimiya/schema'
import { faker } from '@faker-js/faker'
import * as Factory from 'factory.ts'

import { MOCK_HASH } from './constants.js'
import { generateEthereumAddress, generatePoolCap, generatePoolFloor, getPoolHash } from './utils.js'

const BasePoolFactory = Factory.makeFactory<PoolParamsEntity>({
	id: Factory.each(i => `pool-id-${i}`),
	floor: generatePoolFloor(),
	cap: generatePoolCap(),
	index: generateEthereumAddress(),
	indexName: EPoolIndexName.BTC_TX_FEE,
	payoutToken: generateEthereumAddress(),
	createdAt: new Date(),
	updatedAt: new Date(),
	// override these
	targetStartTimestamp: faker.date.recent({ days: 1 }),
	targetEndTimestamp: faker.date.soon({ days: 1 }),
	poolHash: MOCK_HASH,
}).withDerivation('poolHash', getPoolHash)

export const ExpiredPoolFactory = BasePoolFactory.extend({
	targetEndTimestamp: faker.date.recent({ days: 15 }),
	targetStartTimestamp: faker.date.recent({ days: 30 }),
}).withDerivation('poolHash', getPoolHash)

export const OngoingPoolFactory = BasePoolFactory.extend({
	targetStartTimestamp: faker.date.recent({ days: 5 }),
	targetEndTimestamp: faker.date.soon({ days: 10 }),
}).withDerivation('poolHash', getPoolHash)

export const UpcomingPoolFactory = BasePoolFactory.extend({
	targetStartTimestamp: faker.date.soon({ days: 15 }),
	targetEndTimestamp: faker.date.soon({ days: 30 }),
}).withDerivation('poolHash', getPoolHash)
