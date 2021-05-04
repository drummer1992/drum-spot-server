import ChatGateway from './chat-gateway'
import handleEvent from './handle-event'
import { withWsContext } from '../../lib/context'

export default socket => client => {
  const gateway = new ChatGateway(client, socket)

  const methods = Object.getOwnPropertyNames(ChatGateway.prototype)

  const registerEventHandler = method => {
    if (method !== 'constructor') {
      client.on(
        method,
        handleEvent(withWsContext(gateway[method].bind(gateway)), client),
      )
    }
  }

  methods.forEach(registerEventHandler)
}