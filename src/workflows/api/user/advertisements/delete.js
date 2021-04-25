import fs from 'fs/promises'
import { argumentsAssert } from '../../../../errors'
import { isObjectId } from '../../../../utils/predicates'

export default async (advertisementId, user) => {
  argumentsAssert(isObjectId(advertisementId), 'invalid objectId provided')

  const { deletedCount } = await Advertisement.deleteOne({
    _id: advertisementId,
    user,
  })

  argumentsAssert(deletedCount, 'advertisement not found')

  const destination = `${process.env.PATH_TO_STATIC}/${advertisementId}`

 await fs.rm(destination, { recursive: true, force: true })
}