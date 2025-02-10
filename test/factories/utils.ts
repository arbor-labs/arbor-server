// A list of utils to generate faker data that adheres to viem types
import { faker } from '@faker-js/faker'
import { type Address, getAddress } from 'viem'

/////////////
// Common
/////////////

export const noop = () => null

export const generateEthereumAddress = (): Address => getAddress(faker.finance.ethereumAddress())

/////////////
// Accounts
/////////////

// ...

/////////////
// Projects
/////////////

// ...
