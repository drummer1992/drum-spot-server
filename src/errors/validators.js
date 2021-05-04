import assert from 'assert'
import isNil from 'lodash/isNil'

export const objectId = (value, key) => {
  assert(!isNil(value), `${key} should be valid objectId`)
}