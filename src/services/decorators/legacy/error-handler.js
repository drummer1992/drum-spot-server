import { APIError, InternalServerError } from '../../errors'

const errorHandlerDecorator = fn => async function(...args) {
  try {
    return await fn.apply(this, args)
  } catch (error) {
    if (!(error instanceof APIError)) {
      error = new InternalServerError(`[UNHANDLED ERROR]: ${error.message}`)
    }

    if (error instanceof InternalServerError) {
      console.error(error.stack)

      error.message = 'Internal Server Error'
    }

    return error
  }
}

export default errorHandlerDecorator