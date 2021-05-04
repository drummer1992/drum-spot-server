import callbackProvider from '../decorators/callback-provider'
import e from '../event'

export default (eventHandler, client) => {
  return callbackProvider(async (message, callback) => {
      const response = await eventHandler(message)

      if (response instanceof Error) {
        return client.emit(e.CHAT_ERROR, response)
      }

      return callback(response)
    },
  )
}