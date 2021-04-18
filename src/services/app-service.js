import { BaseService } from 'decorated-routing'
import { ErrorHandler } from './decorators/error-handler'
import { Logger } from './decorators/logger'

export default class AppService extends BaseService {
  setCurrentUser(user) {
    this.user = new User(user)
  }

  /**
   * @returns {User}
   */
  getCurrentUser() {
    return this.user
  }

  @Logger
  @ErrorHandler
  execute() {
    return super.execute()
  }
}