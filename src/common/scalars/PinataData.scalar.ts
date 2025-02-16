import type { CustomScalar } from '@nestjs/graphql';
import { Scalar } from '@nestjs/graphql'
import type { ValueNode } from 'graphql';
import { Kind } from 'graphql'

@Scalar('PinataData')
export class PinataDataScalar implements CustomScalar<any, any> {
	description = 'Custom scalar type for Pinata data that can JSON or a base64 encoded string of a Blob.'

	parseValue(value: any) {
		return value
	}

	serialize(value: any) {
		return value
	}

	parseLiteral(ast: ValueNode) {
		if (ast.kind === Kind.STRING) {
			return ast.value
		}
		if (ast.kind === Kind.OBJECT) {
			return ast
		}
		return null
	}
}
