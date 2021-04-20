import keyBy from 'lodash/keyBy'

const enrichWithUsers = async advertisements => {
  const usersIds = advertisements.map(ad => ad.user)

  const users = await User.find({ _id: { $in: usersIds } }, ['_id', 'imageURL'])
    .then(users => keyBy(users, '_id'))

  advertisements.forEach(ad => {
    ad.user = users[ad.user]
  })
}

export default async () => {
  const advertisements = await Advertisement.find()

  if (advertisements.length) {
    await enrichWithUsers(advertisements)
  }

  return advertisements
}