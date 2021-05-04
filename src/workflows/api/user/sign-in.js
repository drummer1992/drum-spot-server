import Request from 'backendless-request'
import * as jwt from '../../../utils/jwt'
import createUser from '../../user/create'
import { argumentsAssert, UnauthorizedError } from '../../../errors'
import { flow } from '../../../lib/context'

export default flow(async ({ accessToken }) => {
  argumentsAssert(accessToken, 'accessToken is required')

  try {
    const response = await Request.get('https://graph.facebook.com/me')
      .query({
        fields      : 'email, name, picture.type(large)',
        access_token: accessToken,
      })

    let user = await User.findOne({ facebookId: response.id }, ['_id'])

    if (!user) {
      user = await createUser({
        facebookId: response.id,
        email     : response.email,
        name      : response.name,
        imageURL  : response.picture?.data?.url,
      })
    }

    return jwt.sign({ _id: user._id })
  } catch (e) {
    throw new UnauthorizedError('Authorization failed')
  }
})