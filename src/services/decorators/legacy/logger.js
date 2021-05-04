import { executionAsyncResource } from 'async_hooks'
import { ctxKey, logWithContext } from '../../../lib/context'

export default fn => async function (...args) {
  const ctx = executionAsyncResource()[ctxKey]

  logWithContext.info(ctx, `${ctx.method} ${ctx.url}`)

  const result = await fn.apply(this, args)

  const ms = Date.now() - ctx.date

  let logger = console.log
  let errorMessage = ''

  if (result instanceof Error) {
    logger = console.error

    errorMessage = ` ${result.name}: ${result.message}`
  }

  logWithContext(logger)(ctx, `[${this.response.statusCode}]${errorMessage} ${ms} ms`)

  return result
}