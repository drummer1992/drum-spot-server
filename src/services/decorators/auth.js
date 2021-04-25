import { verify } from '../../utils/jwt'

export function Auth({ fetch = false } = {}) {
  return function (instance, serviceName, descriptor) {
    const method = descriptor.value

    descriptor.value = async function (...args) {
      const { _id } = verify(this.request.headers.authorization)

      let user = new User({ _id: _id })

      if (fetch) {
        user = await user.fetch()
      }

      this.setCurrentUser(user)

      return method.apply(this, args)
    }

    return descriptor
  }
}