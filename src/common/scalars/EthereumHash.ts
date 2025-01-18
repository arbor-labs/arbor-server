import { GraphQLError, GraphQLScalarType, type GraphQLScalarTypeConfig, Kind } from 'graphql'

const ETHEREUM_HASH_REGEX = /^0x[a-fA-F0-9]{64}$/
const specifiedByURL = 'http://gavwood.com/paper.pdf'

const validate = (value: unknown) => {
	if (typeof value !== 'string') throw new TypeError(`Value is not string: ${value as string}`)
	if (!ETHEREUM_HASH_REGEX.test(value)) throw new TypeError(`Value is not a valid Ethereum hash: ${value}`)
	return value
}

export const GraphQLEthereumHashConfig = {
	name: 'EthereumHash',
	description: `A string whose value conforms to the standard Ethereum hash format as specified in EIP-150 Revision (212): ${specifiedByURL}`,
	serialize: validate,
	parseValue: validate,
	parseLiteral(ast) {
		if (ast.kind !== Kind.STRING) {
			throw new GraphQLError(`Can only validate strings as Ethereum hashes but got a: ${ast.kind}`)
		}
		return validate(ast.value)
	},
	specifiedByURL,
	extensions: {
		codegenScalarType: 'string',
		jsonSchema: {
			title: 'EthereumHash',
			type: 'string',
			pattern: ETHEREUM_HASH_REGEX.source,
		},
	},
} as GraphQLScalarTypeConfig<string, string>

export const GraphQLEthereumHash: GraphQLScalarType = new GraphQLScalarType(GraphQLEthereumHashConfig)

export { GraphQLEthereumHash as EthereumHash }
