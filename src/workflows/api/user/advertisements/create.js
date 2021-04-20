import { array, string, number, boolean, oneOf, createValidator } from 'schema-validator'
import { InvalidArgumentsError } from '../../../../errors'

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

export default (user, data) => {
  try {
    assertAdvertisementIsValid(data)
  } catch (e) {
    throw new InvalidArgumentsError(e.message)
  }

  return Advertisement.create({
    user,
    ...data,
  })
}