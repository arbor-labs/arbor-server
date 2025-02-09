// import { Entity, JoinColumn, Unique } from 'typeorm'
// import { Column, JoinTable, ManyToMany, ManyToOne } from 'typeorm'

// import { AccountEntity } from './account.entity'
// import { BaseEntity } from './base.entity'
// import { ProjectEntity } from './project.entity'
// import { StemEntity } from './stem.entity'

// interface Token {
// 	id: number
// 	tokenURI: string
// 	data: string
// }

// @Entity('songs')
// @Unique('UniqueMetadataUrl', ['metadataUrl'])
// export class SongEntity extends BaseEntity<SongEntity> {
// 	@Column()
// 	name: string

// 	@ManyToOne(() => AccountEntity, entity => entity.createdSongs)
// 	createdBy: string

// 	@ManyToOne(() => AccountEntity, entity => entity.collectedSongs)
// 	owner: AccountEntity

// 	@Column()
// 	isListed: boolean

// 	@Column()
// 	listPrice: string // In gwei

// 	@Column('json')
// 	token: Token

// 	@Column()
// 	metadataUrl: string

// 	@Column()
// 	audioHref: string

// 	@JoinColumn()
// 	@ManyToOne(() => ProjectEntity, project => project.songsMinted)
// 	project: ProjectEntity

// 	@JoinTable()
// 	@ManyToMany(() => AccountEntity, entity => entity.collaboratedProjects)
// 	collaborators: AccountEntity[]

// 	@JoinTable()
// 	@ManyToMany(() => StemEntity, entity => entity.songsIncludedIn)
// 	stems: StemEntity[]
// }
