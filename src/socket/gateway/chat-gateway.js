import { ErrorHandler } from '../decorators/error-handler'
import { Logger } from '../decorators/logger'
import { ValidationPipe } from '../../lib/decorators/validation-pipe'
import messageEventHandler, { MessageValidationSchema } from '../../workflows/chat/message'
import setActive from '../../workflows/chat/set-active'
import createConversation from '../../workflows/chat/create-conversation'
import getConversations from '../../workflows/chat/get-conversations'
import getConversation from '../../workflows/chat/get-conversation'
import getChatIds from '../../workflows/chat/get-chat-ids'
import setViewed from '../../workflows/chat/set-viewed'
import Gateway from './generic-gateway'
import e from '../event'

@ErrorHandler
@Logger
class ChatGateway extends Gateway {
  async #setActive(isActive, chatIds) {
    const changes = { isActive, lastSeen: Date.now() }

    await setActive(this.user.objectId, changes)

    chatIds.forEach(chatId => {
      this.client.broadcast.to(chatId).emit(e.USER_ACTIVE, { chatId, ...changes })
    })
  }

  async setViewed(chatId) {
    await setViewed(this.user.objectId, chatId)

    this.socket.to(chatId).emit(e.CHAT_VIEWED, {
      userId: this.user.objectId,
      chatId,
    })
  }

  @ValidationPipe(MessageValidationSchema)
  async message(payload) {
    const message = await messageEventHandler(this.user.objectId, payload)

    this.socket.to(payload.chatId).emit(e.NEW_MESSAGE, message)
  }

  async createConversation(participantId) {
    const conversationId = await createConversation(this.user._id, participantId)

    this.socket.to([this.user.objectId, participantId])
      .emit(e.CREATED_CONVERSATION, conversationId)
  }

  getConversations() {
    return getConversations(this.user._id)
  }

  async joinTheCreatedConversation(chatId) {
    const conversation = await getConversation(this.user._id, chatId)

    this.client.join(chatId)

    return conversation
  }

  async connected() {
    const chatIds = await getChatIds(this.user.objectId)

    const rooms = [this.user.objectId, ...chatIds]

    await this.#setActive(true, rooms)

    this.client.join(rooms)
  }

  async disconnect() {
    const chatIds = await getChatIds(this.user.objectId)

    const rooms = [this.user.objectId, ...chatIds]

    await this.#setActive(false, rooms)

    rooms.forEach(room => this.client.leave(room))
  }
}

export default ChatGateway