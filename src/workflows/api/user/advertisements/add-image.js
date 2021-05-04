import { argumentsAssert } from '../../../../errors'
import { isObjectId } from '../../../../utils/predicates'
import { flow } from '../../../../lib/context'

export default flow(async (advertisementId, saveImage, user) => {
  argumentsAssert(isObjectId(advertisementId), 'advertisement id is not valid')

  const advertisement = await Advertisement.findOne({
    _id: advertisementId,
    user,
  })

  argumentsAssert(advertisementId, 'advertisement not found')

  const { files } = await saveImage(advertisementId)

  const img = files[0]

  advertisement.images.push(img)

  await advertisement.save()

  return img
})