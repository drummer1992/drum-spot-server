import { array, string, number, boolean, oneOf, createValidator } from 'schema-validator'
import { InvalidArgumentsError } from '../../../../errors'
import { flow, logWithContext } from '../../../../lib/context'
import { toStaticURL } from '../../../../utils/static'

const assertAdvertisementIsValid = createValidator({
  price           : number,
  title           : string,
  city            : string,
  details         : string,
  rating          : oneOf([1, 2, 3, 4, 5]),
  images          : array.nonempty,
  isRent          : boolean,
  isNewStuff      : boolean,
  priceNegotiating: boolean,
}, 'advertisement payload')

export default flow((user, data) => {
  logWithContext.info(data)

  try {
    assertAdvertisementIsValid(data)
  } catch (e) {
    throw new InvalidArgumentsError(e.message)
  }

  return Advertisement.create({
    ...data,
    user,
    images: data.images.map(toStaticURL),
  })
})