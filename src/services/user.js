import AppService from './app-service'
import { Service, Post, Get } from 'decorated-routing/decorators'
import signIn from '../workflows/api/user/sign-in'
import createAdvertisement from '../workflows/api/user/advertisements/create'
import getAdvertisements from '../workflows/api/user/advertisements/get-many'
import { Auth } from './decorators/auth'
import { HttpCode as c } from 'decorated-routing'
import { StatusCode } from 'decorated-routing/decorators'
import { parseFormData } from '../utils/http/parse-formdata'

@Service('/user')
class User extends AppService {
  @Post('/signIn')
  signIn() {
    return signIn(this.request.body)
  }

  @Get()
  @Auth()
  getProfile() {
    return this.getCurrentUser()
  }

  @Post({ path: '/advertisement', parseBody: false })
  @Auth()
  @StatusCode(c.CREATED)
  async createAdvertisement() {
    const { files, fields: { body } } = await parseFormData(this.req, process.env.PATH_TO_STATIC)

    return createAdvertisement(this.getCurrentUser(), {
      ...body,
      images: files,
    })
  }

  @Get('/advertisements')
  getAdvertisements() {
    return getAdvertisements()
  }
}

export default User