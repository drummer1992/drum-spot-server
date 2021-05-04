export const decoratePrototype = (decorator, object) => {
  const methods = Object.getOwnPropertyNames(object.prototype)

  methods.forEach(method => {
    if (method !== 'constructor') {
      object.prototype[method] = decorator(object.prototype[method], method)
    }
  })
}