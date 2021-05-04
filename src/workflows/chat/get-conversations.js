import { isEqualObjectIds } from '../../utils/predicates'
import { flow } from '../../lib/context'

const getChatByUserMap = (chats, userId) => {
  const pickParticipantId = ({ participants }) => (
    participants.find(objectId => !isEqualObjectIds(userId, objectId))
  )

  return chats.reduce(
    (result, cur) => ({
      ...result, [pickParticipantId(cur)]: {
        _id     : cur._id,
        messages: cur.messages,
      },
    }),
    {},
  )
}

export default flow(async userId => {
  const chats = await Chat.find({ participants: userId }, ['participants'])
    .populate(['messages'])

  if (chats.length) {
    const chatIdByUserId = getChatByUserMap(chats, userId)

    const users = await User.find({ _id: { $in: Object.keys(chatIdByUserId) } })

    return users.map(user => ({
      _id        : chatIdByUserId[user._id]._id,
      messages   : chatIdByUserId[user._id].messages,
      participant: user,
    }))
  }

  return []
})