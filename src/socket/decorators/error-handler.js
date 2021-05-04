import { decoratePrototype } from '../../utils/object'
import errorHandlerDecorator from '../../lib/decorators/error-handler'

export function ErrorHandler(Clazz) {
  decoratePrototype(errorHandlerDecorator, Clazz)
}