import c from 'decorated-routing/codes'

export class APIError extends Error {
  constructor(message, statusCode) {
    super()

    this.statusCode = statusCode
    this.message = message
    this.name = APIError.name
  }
}

export class InternalServerError extends APIError {
  constructor(message = 'Internal Server Error') {
    super()

    this.message = message
    this.statusCode = c.INTERNAL_SERVER_ERROR
    this.name = InternalServerError.name
  }
}

export class InvalidArgumentsError extends APIError {
  constructor(message) {
    super()

    this.message = message
    this.statusCode = c.BAD_REQUEST
    this.name = InvalidArgumentsError.name
  }
}

export class NotFoundError extends APIError {
  constructor(message = 'Entity Not Found') {
    super()

    this.message = message
    this.statusCode = c.NOT_FOUND
    this.name = NotFoundError.name
  }
}

export class UnauthorizedError extends APIError {
  constructor(message = 'Unauthorized') {
    super()

    this.message = message
    this.statusCode = c.UNAUTHORIZED
    this.name = UnauthorizedError.name
  }
}

export const argumentsAssert = (condition, message) => {
  if (!condition) {
    throw new InvalidArgumentsError(message)
  }
}

export const notFoundAssert = (condition, message) => {
  if (!condition) {
    throw new NotFoundError(message)
  }
}
