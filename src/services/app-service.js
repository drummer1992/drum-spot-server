import { BaseService } from 'decorated-routing'
import { ErrorHandler } from './decorators/error-handler'
import { Logger } from './decorators/logger'
import { executionAsyncResource } from 'async_hooks'
import { ctxKey, logWithContext } from '../lib/context'

export default class AppService extends BaseService {
  static async parseBody(req) {
    const body = await super.parseBody(req)

    if (body) {
      const ctx = executionAsyncResource()[ctxKey]

      logWithContext.info(ctx, `body: ${JSON.stringify(body)}`)
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