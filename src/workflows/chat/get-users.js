import { flow } from '../../lib/context'

export default flow(async userId => {
  const chats = await Chat.find({ participants: userId }, ['participants'])

  const userIds = chats.map(chat => chat.participants.find(id => id.toString() !== userId))

  return User.find({ _id: { $nin: userIds } })
})