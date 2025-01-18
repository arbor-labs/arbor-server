import { applyDecorators } from '@nestjs/common'
import { NotEquals, ValidateIf } from 'class-validator'

export function IsOptionalNonNull() {
	return applyDecorators(
		ValidateIf((_object, value) => value !== undefined),
		NotEquals(null),
	)
}
