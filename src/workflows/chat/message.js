import { notFoundAssert } from '../../errors'
import { generateId } from '../../utils/id'
import { minLength, string, and } from 'schema-validator'
import { objectId } from '../../errors/validators'
import { flow } from '../../lib/context'

export const MessageValidationSchema = {
  text  : and([string, minLength(1)]),
  chatId: objectId,
}

export default flow(async (userId, payload) => {
  const { text, chatId } = payload

  const chat = await Chat.findById(chatId)

  notFoundAssert(chat, 'Conversation is not found')

  const message = await ChatMessage.create({
    _id     : generateId(),
    chatId  : chat._id,
    senderId: userId,
    text,
  })

  chat.messages.push(message)

  await chat.save()

  return message
})