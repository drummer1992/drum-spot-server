import { getContext, logWithContext } from '../../../lib/context'

export default fn => async function (...args) {
  const ctx = getContext()

  logWithContext.info(`${ctx.method} ${ctx.url}`)

  const result = await fn.apply(this, args)

  const ms = Date.now() - ctx.date

  let logger = console.log
  let errorMessage = ''

  if (result instanceof Error) {
    logger = console.error

    errorMessage = ` ${result.name}: ${result.message}`
  }

  logWithContext(logger)(`[${this.response.statusCode}]${errorMessage} ${ms} ms`)

  return result
}