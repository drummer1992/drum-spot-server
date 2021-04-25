import { InvalidArgumentsError, notFoundAssert } from '../../../../errors'

export const addToFavorites = async (user, advertisementId) => {
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
}

export const deleteFromFavorites = (user, advertisementId) => Favorite.deleteOne({
  id    : advertisementId,
  userId: user._id,
})

export const getFavorites = async user => {
  const favorites = await Favorite.find({ userId: user._id }, ['id'])

  const advertisements = []

  if (favorites.length) {
    const ads = await Advertisement.find({
      _id: favorites.map(f => f.id),
    }).populate('user')

    advertisements.push(...ads)
  }

  return advertisements
}