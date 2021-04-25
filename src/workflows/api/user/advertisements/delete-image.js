import fs from 'fs/promises'
import { argumentsAssert } from '../../../../errors'
import { isObjectId } from '../../../../utils/predicates'

export default async (advertisementId, path, user) => {
  argumentsAssert(path, 'path is not provided')
  argumentsAssert(isObjectId(advertisementId), 'invalid objectId provided')

  const ad = await Advertisement.findOne({ _id: advertisementId, user })

  argumentsAssert(ad, 'advertisement not found')

  const imagePath = ad.images.find(img => img === path)

  argumentsAssert(imagePath, 'image not found')

  await fs.rm(imagePath, { force: true })

  ad.images = ad.images.filter(img => img !== path)

  await ad.save()
}