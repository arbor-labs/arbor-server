import { GraphQLError, GraphQLScalarType, type GraphQLScalarTypeConfig, Kind } from 'graphql'

const ETHEREUM_ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/
const specifiedByURL = 'http://gavwood.com/paper.pdf'

const validate = (value: unknown) => {
	if (typeof value !== 'string') throw new TypeError(`Value is not string: ${value as string}`)

	if (!ETHEREUM_ADDRESS_REGEX.test(value)) throw new TypeError(`Value is not a valid Ethereum address: ${value}`)
	return value
}

export const GraphQLEthereumAddressConfig = {
	name: 'EthereumAddress',
	description: `A string whose value conforms to the standard Ethereum address format as specified in EIP-150 Revision (212): ${specifiedByURL}.`,
	serialize: validate,
	parseValue: validate,
	parseLiteral(ast) {
		if (ast.kind !== Kind.STRING) {
			throw new GraphQLError(`Can only validate strings as Ethereum addresses but got a: ${ast.kind}`)
		}
		return validate(ast.value)
	},
	specifiedByURL,
	extensions: {
		codegenScalarType: 'string',
		jsonSchema: {
			title: 'EthereumAddress',
			type: 'string',
			pattern: ETHEREUM_ADDRESS_REGEX.source,
		},
	},
} as GraphQLScalarTypeConfig<string, string>

export const GraphQLEthereumAddress: GraphQLScalarType = new GraphQLScalarType(GraphQLEthereumAddressConfig)

export { GraphQLEthereumAddress as EthereumAddress }
