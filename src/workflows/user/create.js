import assert from 'assert'

export default payload => {
  assert(payload, 'payload is required')
  assert(payload.facebookId, 'payload should have facebookId')

  return User.create(payload)
}