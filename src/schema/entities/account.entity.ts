import { Column, Entity, Unique } from 'typeorm'
import { Address } from 'viem'

import { BaseEntity } from './base.entity'

@Unique('UniqueAccountAddress', ['address'])
@Entity('accounts')
export class AccountEntity extends BaseEntity<AccountEntity> {
	@Column()
	address: Address
}
