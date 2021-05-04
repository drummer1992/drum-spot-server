import { getSocketUser } from '../context'

export default class Gateway {
  /**
   * @param {Socket} client
   * @param {Server} socket
   */
  constructor(client, socket) {
    this.client = client
    this.socket = socket
    this.user = getSocketUser()
  }
}