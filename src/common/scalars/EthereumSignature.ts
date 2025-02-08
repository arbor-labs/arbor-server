import { GraphQLError, GraphQLScalarType, type GraphQLScalarTypeConfig, Kind } from 'graphql'

const ETHEREUM_SIGNATURE_REGEX = /^0x[a-fA-F0-9]{130}$/

const validate = (value: unknown) => {
	if (typeof value !== 'string') {
		throw new TypeError(`Value is not string: ${value as string}`)
	}

	if (!ETHEREUM_SIGNATURE_REGEX.test(value)) {
		throw new TypeError(`Value is not a valid Ethereum signature: ${value}`)
	}

	return value
}

const specifiedByURL = 'http://gavwood.com/paper.pdf'

export const GraphQLEthereumSignatureConfig = /*#__PURE__*/ {
	name: 'EthereumSignature',

	description: `A string whose value conforms to the standard Ethereum signature format as specified in EIP-150 Revision (212): ${specifiedByURL}`,

	serialize: validate,

	parseValue: validate,

	parseLiteral(ast) {
		if (ast.kind !== Kind.STRING) {
			throw new GraphQLError(`Can only validate strings as Ethereum signatures but got a: ${ast.kind}`)
		}

		return validate(ast.value)
	},

	specifiedByURL,
	extensions: {
		codegenScalarType: 'string',
		jsonSchema: {
			title: 'EthereumSignature',
			type: 'string',
			pattern: ETHEREUM_SIGNATURE_REGEX.source,
		},
	},
} as GraphQLScalarTypeConfig<string, string>

export const GraphQLEthereumSignature: GraphQLScalarType = /*#__PURE__*/ new GraphQLScalarType(
	GraphQLEthereumSignatureConfig,
)

export { GraphQLEthereumSignature as EthereumSignature }
