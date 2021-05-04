import identity from 'lodash/identity'

const callbackProvider = eventHandler => (...args) => {
  let message = args[0]
  let callback = identity
  const lastArg = args[args.length - 1]

  if (typeof lastArg === 'function') {
    callback = lastArg

    message = args[0] !== lastArg ? args[0] : undefined
  }

  return eventHandler(message, callback)
}

export default callbackProvider