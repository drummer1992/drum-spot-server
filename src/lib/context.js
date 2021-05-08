import { executionAsyncResource, createHook } from 'async_hooks'
import { nanoid } from 'nanoid'

export const ctxKey = Symbol('ctx')

createHook({
  init(asyncId, type, triggerAsyncId, resource) {
    const cr = executionAsyncResource()

    if (cr) {
      resource[ctxKey] = cr[ctxKey]
    }
  },
}).enable()

export const getContext = () => executionAsyncResource()[ctxKey]

export const setContext = ctx => {
  executionAsyncResource()[ctxKey] = ctx
}

export const logWithContext = logger => (...args) => {
  const ctx = getContext()

  logger(`[${new Date().toLocaleTimeString()}] [${ctx.protocol}] [${ctx.id}]`, ...args)
}

logWithContext.info = logWithContext(console.log)
logWithContext.error = logWithContext(console.error)

const ROOT_FOLDER = process.env.NODE_ENV === 'production' ? '/lib' : '/src'

const WORKFLOW_MARKER = `${ROOT_FOLDER}/workflows/`

const getWorkflowPath = () => {
  const obj = {}

  Error.captureStackTrace(obj)

  const callerPath = obj.stack.split('\n')[3]

  if (callerPath.includes(WORKFLOW_MARKER)) {
    return callerPath.substring(
      callerPath.indexOf(WORKFLOW_MARKER) + WORKFLOW_MARKER.length,
      callerPath.lastIndexOf('.js'),
    )
  }

  throw new Error('Illegal invocation flow. Must be invoked from [workflows] folder')
}

export function flow(fn) {
  const path = getWorkflowPath()

  return (...args) => {
    const ctx = getContext()

    ctx.flow = {
      path,
      parent: ctx.flow || undefined,
    }

    setContext(ctx)

    logWithContext.info(`[${path}]`)

    return fn(...args)
  }
}

export const withWsContext = eventHandler => message => {
  setContext({
    id      : nanoid(5),
    protocol: 'WS',
    date    : Date.now(),
    event   : eventHandler.name,
  })

  return eventHandler(message)
}

export const withHttpContext = listener => (req, res) => {
  setContext({
    id      : nanoid(5),
    protocol: 'HTTP',
    url     : req.url,
    method  : req.method,
    date    : Date.now(),
  })

  return listener(req, res)
}
