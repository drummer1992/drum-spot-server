import { string, number, boolean, oneOf, createValidator } from 'schema-validator'
import { InvalidArgumentsError } from '../../../../errors'
import { flow } from '../../../../lib/context'
import { toStaticURL } from '../../../../utils/static'
import fs from 'fs/promises'

const assertAdvertisementIsValid = createValidator({
  price           : number,
  title           : string,
  city            : string,
  details         : string,
  rating          : oneOf([1, 2, 3, 4, 5]),
  isRent          : boolean,
  isNewStuff      : boolean,
  priceNegotiating: boolean,
}, 'advertisement payload')

export default flow(async (user, _id, parsedFormData) => {
  const body = JSON.parse(parsedFormData.fields.body)

  try {
    assertAdvertisementIsValid(body)
  } catch (e) {
    const destination = `${process.env.PATH_TO_STATIC}/${_id}`

    await fs.rm(destination, { recursive: true, force: true })

    throw new InvalidArgumentsError(e.message)
  }

  return Advertisement.create({
    _id,
    user,
    images: parsedFormData.files.map(toStaticURL),
    ...body,
  })
})