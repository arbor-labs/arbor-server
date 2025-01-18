import { BeforeInsert, CreateDateColumn, PrimaryColumn, Unique, UpdateDateColumn } from 'typeorm'

@Unique(['id'])
export abstract class BaseEntity<T> {
	// Allow creating of partial to use defaults
	constructor(props?: Partial<T>) {
		Object.assign(this, props)
	}

	@PrimaryColumn()
	id: string

	@CreateDateColumn()
	createdAt: Date

	@UpdateDateColumn()
	updatedAt: Date

	@BeforeInsert()
	protected setId() {
		if (!this.id) this.id = crypto.randomUUID().toString()
	}
}
