import AppService from './app-service'
import { Service, Post, Get, Patch, Delete } from 'decorated-routing/decorators'
import signIn from '../workflows/api/user/sign-in'
import createAdvertisement from '../workflows/api/user/advertisements/create'
import deleteAdvertisement from '../workflows/api/user/advertisements/delete'
import updateAdvertisement, { UpdateAdvertisementSchema } from '../workflows/api/user/advertisements/update'
import deleteAdvertisementImage from '../workflows/api/user/advertisements/delete-image'
import addAdvertisementImage from '../workflows/api/user/advertisements/add-image'
import getAdvertisements from '../workflows/api/user/advertisements/get-many'
import addToFavorites from '../workflows/api/user/favorites/add'
import deleteFromFavorites from '../workflows/api/user/favorites/delete'
import getFavorites from '../workflows/api/user/favorites/get'
import { Auth } from './decorators/auth'
import { HttpCode as c } from 'decorated-routing'
import { StatusCode } from 'decorated-routing/decorators'
import { parseFormData } from '../lib/http/parse-formdata'
import { generateId } from '../utils/id'
import { BodyValidationPipe } from './decorators/validation-pipe'

@Service('/user')
class User extends AppService {
  @Post('/signIn')
  signIn() {
    return signIn(this.request.body)
  }

  @Get()
  @Auth({ fetch: true })
  getProfile() {
    return this.getCurrentUser()
  }

  @Post({ path: '/advertisements', parseBody: false })
  @Auth()
  @StatusCode(c.CREATED)
  async createAdvertisement() {
    const _id = generateId()
    const parsed = await parseFormData(this.req, `${process.env.PATH_TO_STATIC}/${_id}`)

    return createAdvertisement(this.getCurrentUser(), _id, parsed)
  }

  @Post('/favorites/{id}')
  @Auth()
  addToFavorites() {
    return addToFavorites(this.getCurrentUser(), this.request.pathParams.id)
  }

  @Delete('/favorites/{id}')
  @Auth()
  deleteFromFavorites() {
    return deleteFromFavorites(this.getCurrentUser(), this.request.pathParams.id)
  }

  @Get('/favorites')
  @Auth()
  getFavorites() {
    return getFavorites(this.getCurrentUser())
  }

  @Patch('/advertisements/{id}')
  @BodyValidationPipe(UpdateAdvertisementSchema)
  @Auth()
  updateAdvertisement() {
    return updateAdvertisement(
      this.request.pathParams.id,
      this.request.body,
      this.getCurrentUser(),
    )
  }

  @Delete('/advertisements/{id}')
  @Auth()
  deleteAdvertisement() {
    return deleteAdvertisement(this.request.pathParams.id, this.getCurrentUser())
  }

  @Delete('/advertisements/{id}/images')
  @Auth()
  deleteAdvertisementImage() {
    return deleteAdvertisementImage(
      this.request.pathParams.id,
      this.request.body.path,
      this.getCurrentUser(),
    )
  }

  @Patch({ path: '/advertisements/{id}/images', parseBody: false })
  @Auth()
  addAdvertisementImage() {
    return addAdvertisementImage(
      this.request.pathParams.id,
      adId => parseFormData(this.req, `${process.env.PATH_TO_STATIC}/${adId}`),
      this.getCurrentUser(),
    )
  }

  @Get('/advertisements')
  getAdvertisements() {
    return getAdvertisements()
  }
}

export default User