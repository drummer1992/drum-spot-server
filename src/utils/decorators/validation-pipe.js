import { createValidator } from 'schema-validator'
import { InvalidArgumentsError } from '../../errors'

export function ValidationPipe(schema, { context, optional } = {}) {
  const dataName = context || 'payload'

  const validate = createValidator(schema, dataName)

  return function (target, key, descriptor) {
    const method = descriptor.value

    descriptor.value = function (data = {}) {
      try {
        const dto = context ? data[context] : data

        if (!optional || dto) {
          validate(dto)
        }
      } catch (e) {
        throw new InvalidArgumentsError(e.message)
      }

      return method.call(this, data)
    }

    return descriptor
  }
}