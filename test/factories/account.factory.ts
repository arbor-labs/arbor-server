import * as Factory from 'factory.ts'

import type { AccountEntity } from '@/schema/entities/account.entity'

import { anvilAccounts, MOCK_SIGNATURE } from './constants'

export const AccountFactory = Factory.Sync.makeFactory<AccountEntity>({
	id: Factory.each(i => `account-id-${i}`),
	createdAt: new Date(),
	updatedAt: new Date(),
	address: Factory.Sync.each(
		// Cycle through the 10 anvil accounts then reuse the first account for each thereafter
		i => anvilAccounts[i]?.address ?? anvilAccounts[0].address,
	),
	onboardingSignature: MOCK_SIGNATURE,
	displayName: Factory.each(i => `Test Account ${i}`),
	avatarUrl: 'https://example.com/avatar.png',
	collaboratedProjects: [],
	stems: [],
	voterIdentities: [],
})
