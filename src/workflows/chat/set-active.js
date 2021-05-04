import { notFoundAssert } from '../../errors'
import { flow } from '../../lib/context'

export default flow(async (userId, changes) => {
  const { nModified: updatedCount } = await User.updateOne({ _id: userId }, changes)

  notFoundAssert(updatedCount, 'User not found')
})