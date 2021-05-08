import { array, string, number, boolean, oneOf, createValidator } from 'schema-validator'
import { InvalidArgumentsError } from '../../../../errors'
import { flow } from '../../../../lib/context'
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

export default flow((user, _id, parsedFormData) => {
  console.log(parsedFormData.fields.body)

  const body = JSON.parse(parsedFormData.fields.body)

  try {
    assertAdvertisementIsValid(body)
  } catch (e) {
    throw new InvalidArgumentsError(e.message)
  }

  return Advertisement.create({
    _id,
    user,
    images: parsedFormData.files.map(toStaticURL),
    ...body,
  })
})