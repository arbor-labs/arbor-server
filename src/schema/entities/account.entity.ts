import { Column, Entity } from 'typeorm'
import { Address } from 'viem'

import { BaseEntity } from './base.entity'

@Entity('accounts')
export class AccountEntity extends BaseEntity<AccountEntity> {
	@Column()
	address: Address
}
