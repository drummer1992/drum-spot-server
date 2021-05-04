import { flow } from '../../../../lib/context'

export default flow((user, advertisementId) => Favorite.deleteOne({
  id    : advertisementId,
  userId: user._id,
}))