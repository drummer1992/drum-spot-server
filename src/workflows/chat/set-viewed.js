import { argumentsAssert } from '../../errors'
import { flow } from '../../lib/context'

export default flow(async (userId, chatId) => {
  argumentsAssert(chatId, 'chatId is required')

  await ChatMessage.updateMany({ chatId, viewed: false, senderId: { $ne: userId } }, {
    $set: { viewed: true },
  })
})