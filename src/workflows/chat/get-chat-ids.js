import { flow } from '../../lib/context'

export default flow(async userId => {
  const chats = await Chat.find({ participants: userId }, ['_id'])

  return chats.map(c => c.objectId)
})