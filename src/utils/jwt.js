import * as jwt from 'jsonwebtoken'
import { UnauthorizedError } from '../errors'

export const sign = payload => ({
  token: jwt.sign(payload, process.env.JWT_AUTH_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  }),
})

export const verify = token => {
  try {
    return jwt.verify(token, process.env.JWT_AUTH_SECRET)
  } catch (e) {
    throw new UnauthorizedError()
  }
}
