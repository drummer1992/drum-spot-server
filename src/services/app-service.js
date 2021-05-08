import { BaseService } from 'decorated-routing'
import { ErrorHandler } from './decorators/error-handler'
import { Logger } from './decorators/logger'
import { logWithContext } from '../lib/context'
import { ApiPrefix } from 'decorated-routing/decorators'

@ApiPrefix('/drumspot')
export default class AppService extends BaseService {
  static async parseBody(req) {
    const body = await super.parseBody(req)

    if (body) {
      logWithContext.info(`body: ${JSON.stringify(body)}`)
    }

    return body
  }

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