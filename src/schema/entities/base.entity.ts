import crypto from 'crypto'
import { BeforeInsert, CreateDateColumn, PrimaryColumn, Unique, UpdateDateColumn } from 'typeorm'

@Unique(['id'])
export abstract class BaseEntity<T> {
	// Allow creating of partial to use defaults
	constructor(props?: Partial<T>) {
		Object.assign(this, props)
	}

	@PrimaryColumn()
	id: string

	@CreateDateColumn({ name: 'created_at' })
	createdAt: Date

	@UpdateDateColumn({ name: 'updated_at' })
	updatedAt: Date

	@BeforeInsert()
	protected setId() {
		if (!this.id) this.id = crypto.randomUUID().toString()
	}
}
