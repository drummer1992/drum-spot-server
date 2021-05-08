import fs from 'fs/promises'
import { argumentsAssert } from '../../../../errors'
import { isObjectId } from '../../../../utils/predicates'
import { flow } from '../../../../lib/context'
import { toStaticPath } from '../../../../utils/static'

export default flow(async (advertisementId, path, user) => {
  argumentsAssert(path, 'path is not provided')
  argumentsAssert(isObjectId(advertisementId), 'invalid objectId provided')

  const ad = await Advertisement.findOne({ _id: advertisementId, user })

  argumentsAssert(ad, 'advertisement not found')

  const imageURL = ad.images.find(img => img === path)

  argumentsAssert(imageURL, 'image not found')

  await fs.rm(toStaticPath(imageURL), { force: true })

  ad.images = ad.images.filter(img => img !== path)

  await ad.save()
})