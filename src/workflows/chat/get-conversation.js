import { argumentsAssert, notFoundAssert } from '../../errors'
import { isEqualObjectIds } from '../../utils/predicates'
import { flow } from '../../lib/context'

export default flow(async (userId, chatId) => {
  argumentsAssert(chatId, 'Chat identifier is required')

  const chat = await Chat.findById({ participants: userId, _id: chatId }, ['participants'])
    .populate(['messages'])

  notFoundAssert(chat, 'Chat not found')

  const participantId = chat.participants.find(objectId => !isEqualObjectIds(objectId, userId))

  const user = await User.findById(participantId)

  notFoundAssert(user, 'User not found')

  return {
    _id        : chatId,
    participant: user,
    messages   : chat.messages,
  }
})