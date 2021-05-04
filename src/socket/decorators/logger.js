import { decoratePrototype } from '../../utils/object'
import { executionAsyncResource } from 'async_hooks'
import { ctxKey, logWithContext } from '../../lib/context'

export function Logger(Clazz) {
  decoratePrototype((fn, key) => async function (...args) {
    const ctx = executionAsyncResource()[ctxKey]

    logWithContext.info(ctx, `[event: ${key}]`)

    const result = await fn.apply(this, args)

    const ms = Date.now() - ctx.date

    let logger = logWithContext.info
    let errorMessage = ''

    if (result instanceof Error) {
      logger = logWithContext.error

      errorMessage = `${result.name}: ${result.message}`
    }

    logger(ctx, errorMessage, `${ms} ms`)

    return result
  }, Clazz)
}