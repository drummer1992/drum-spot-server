import { array, string, number, boolean, oneOf, optional } from 'schema-validator'
import { argumentsAssert, notFoundAssert } from '../../../../errors'
import { isObjectId } from '../../../../utils/predicates'
import { flow } from '../../../../lib/context'

export const UpdateAdvertisementSchema = {
  price           : optional(number),
  title           : optional(string),
  city            : optional(string),
  details         : optional(string),
  rating          : optional(oneOf([1, 2, 3, 4, 5])),
  images          : optional(array.nonempty),
  isRent          : optional(boolean),
  isNewStuff      : optional(boolean),
  priceNegotiating: optional(boolean),
}

export default flow(async (advertisementId, data, user) => {
  argumentsAssert(isObjectId(advertisementId), 'invalid objectId provided')

  const { nModified } = await Advertisement.updateOne({ _id: advertisementId, user }, data)

  notFoundAssert(nModified, 'advertisement not found')
})