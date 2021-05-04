import { flow } from '../../../../lib/context'

export default flow(async user => {
  const favorites = await Favorite.find({ userId: user._id }, ['id'])

  const advertisements = []

  if (favorites.length) {
    const ads = await Advertisement.find({
      _id: favorites.map(f => f.id),
    }).populate('user')

    advertisements.push(...ads)
  }

  return advertisements
})