import { array, string, number, boolean, oneOf } from 'schema-validator'

export const CreateAdvertisementValidationSchema = {
  price           : number,
  title           : string,
  city            : string,
  details         : string,
  rating          : oneOf([1, 2, 3, 4, 5]),
  images          : array.nonempty,
  isRent          : boolean,
  isNewStuff      : boolean,
  priceNegotiating: boolean,
}

export default (user, data) => Advertisement.create({
  user,
  ...data,
})