import { GraphQLError, GraphQLScalarType, type GraphQLScalarTypeConfig, Kind } from 'graphql'

// NOTE: Arbor only supports a subset of these
const specifiedByURL = 'https://docs.pinata.cloud/sdk/gateways/get#returns'

const validate = (value: unknown) => {
	if (value !== null && typeof value !== 'string') throw new TypeError(`Value is not string: ${value as string}`)

	// Even though Pinata supports more than these content types, Arbor only supports a subset for NFT metadata and WAV audio files
	const validContentTypes = [
		'application/json',
		'audio/wav',
		'audio/x-wav',
		'audio/wave',
		'image/jpeg',
		'image/png',
		'image/gif',
		'image/svg+xml',
	]

	if (typeof value === 'string' && !validContentTypes.includes(value)) {
		throw new TypeError(`Value is not a valid Arbor content type: ${value}`)
	}
	return value
}

export const GraphQLPinataContentTypeConfig = {
	name: 'PinataContentType',
	description: `A valid content type supported by both Pinata and Arbor, usually NFT metadata and WAV audio files: ${specifiedByURL}.`,
	serialize: validate,
	parseValue: validate,
	parseLiteral(ast) {
		if (ast.kind !== Kind.STRING) {
			throw new GraphQLError(`Can only validate strings as but got a: ${ast.kind}`)
		}
		return validate(ast.value)
	},
	specifiedByURL,
	extensions: {
		codegenScalarType: 'string',
	},
} as GraphQLScalarTypeConfig<string, string>

export const GraphQLPinataContentType: GraphQLScalarType = new GraphQLScalarType(GraphQLPinataContentTypeConfig)

export { GraphQLPinataContentType as PinataContentType }
