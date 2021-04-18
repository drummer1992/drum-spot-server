import AppService from './app-service'
import { Service, Post, Get } from 'decorated-routing/decorators'
import signIn from '../workflows/api/user/sign-in'
import createAdvertisement from '../workflows/api/user/create-advertisement'
import { Auth } from './decorators/auth'
import { BodyValidationPipe } from './decorators/validation-pipe'
import { CreateAdvertisementValidationSchema } from '../workflows/api/user/create-advertisement'
import { HttpCode as c } from 'decorated-routing'
import { StatusCode } from 'decorated-routing/decorators'

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

  @Post('/advertisement')
  @BodyValidationPipe(CreateAdvertisementValidationSchema)
  @Auth()
  @StatusCode(c.CREATED)
  createAdvertisement() {
    return createAdvertisement(this.getCurrentUser(), this.request.body)
  }
}

export default User