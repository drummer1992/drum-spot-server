import { verify } from '../../utils/jwt'

export function Auth({ fetchUser = true } = {}) {
  return function(instance, serviceName, descriptor) {
    const method = descriptor.value

    descriptor.value = async function(...args) {
      const { _id } = verify(this.request.headers.authorization)

      let user = new User({ _id: _id })

      if (fetchUser) {
        user = await user.fetch()
      }

      this.setCurrentUser(user)

      return method.apply(this, args)
    }

    return descriptor
  }
}