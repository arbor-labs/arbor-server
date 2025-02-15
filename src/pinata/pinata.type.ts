import { PinataContentType } from '@/common/scalars/PinataContentType.scalar'
import { PinataDataScalar } from '@/common/scalars/PinataData.scalar'
import { Field, ObjectType } from '@nestjs/graphql'
import { type ContentType } from 'pinata-web3'

// This is what is returned from a successful POST to /pinata/upload
// @ObjectType('PinataFile')
// export class PinataFileType {
// 	@Field()
// 	IpfsHash: string

// 	@Field(() => Int)
// 	PinSize: number

// 	@Field()
// 	Timestamp: Date
// }

@ObjectType('PinataCIDResponse')
export class PinataCIDResponseType {
	@Field(() => PinataDataScalar, { nullable: true })
	data?: JSON | string | Blob | null

	@Field(() => PinataContentType, { nullable: true })
	contentType: ContentType
}
