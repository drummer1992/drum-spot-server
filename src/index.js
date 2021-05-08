import http from 'http'
import path from 'path'
import { Routing } from 'decorated-routing'
import AppService from './services/app-service'
import bootstrap from './bootstrap'
import initSocket from './socket'
import * as context from './lib/context'

const pathToServices = path.resolve(__filename, '../services')

async function init() {
  await bootstrap()

  const PORT = process.env.PORT || 3000

  const routing = new Routing({ Service: AppService, corsEnabled: true })

  const onRequest = await routing.init(pathToServices)

  const server = http.createServer(context.withHttpContext(onRequest))

  initSocket(server)

  server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
  })
}

init().catch(e => {
  console.error(e.stack)

  process.exit(-1)
})