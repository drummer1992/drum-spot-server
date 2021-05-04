import { notFoundAssert, argumentsAssert } from '../../errors'
import { isEqualObjectIds, isObjectId } from '../../utils/predicates'
import { flow } from '../../lib/context'

export default flow(async (userId, participantId) => {
  argumentsAssert(isObjectId(participantId), 'Participant identifier is not valid')
  argumentsAssert(!isEqualObjectIds(userId, participantId), 'Same ids')

  const participant = await User.findById(participantId)

  notFoundAssert(participant, 'Participant not found')

  argumentsAssert(!await Chat.exists({
    $and: [
      { participants: userId },
      { participants: participantId },
    ],
  }), 'Such chat already exists')

  const created = await Chat.create({ participants: [userId, participantId] })

  return created.objectId
})