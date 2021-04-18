import http from 'http'
import path from 'path'
import { Routing } from 'decorated-routing'
import AppService from './services/app-service'
import bootstrap from './bootstrap'

const pathToServices = path.resolve(__filename, '../services')
const PORT = 3000

async function init() {
  await bootstrap()

  const routing = new Routing({ Service: AppService, corsEnabled: true })

  const requestListener = await routing.init(pathToServices)

  http.createServer(requestListener).listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
  })
}

init().catch(e => {
  console.error(e.stack)

  process.exit(-1)
})