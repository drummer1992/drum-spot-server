export default fn => async function (...args) {
  const start = Date.now()

  const result = await fn.apply(this, args)

  const ms = Date.now() - start

  let logger = console.log
  let errorMessage = ''

  if (result instanceof Error) {
    logger = console.error

    errorMessage = ` ${result.name}: ${result.message}`
  }

  const time = new Date().toLocaleTimeString()

  const body = Object.keys(this.request.body || {}).length
    ? `\n${JSON.stringify(this.request.body, null, 2)}`
    : ''

  const endpoint = `[${this.response.statusCode}] '${this.request.method} ${this.request.url}'`

  logger(`[${time}] ${endpoint}${errorMessage} ${ms} ms${body}`)

  return result
}