import { flow } from '../../../../lib/context'
import { InvalidArgumentsError, notFoundAssert } from '../../../../errors'

export default flow(async (user, advertisementId) => {
  const advertisement = await Advertisement.findOne({ _id: advertisementId })
    .populate('user')

  notFoundAssert(advertisement, 'advertisement not found')

  await Favorite.create({ id: advertisementId, userId: user._id })
    .catch(e => {
      if (e.code === 11000) {
        throw new InvalidArgumentsError(`entity ${advertisementId} has already marked as favorites`)
      }

      throw e
    })

  return advertisement
})