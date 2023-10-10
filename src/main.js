import Hapi from '@hapi/hapi'
import routes from './apiController'
import { dbService, ContainerNames } from './cosmosdbService'
import apiController from './apiController'

const init = async () => {
   const server = Hapi.server({
      port: 3070,
      host: 'localhost'
   })

   await dbService.init()
   const controller = new apiController()
   for(const route in controller.routes)
      server.route(route)

   await server.start()
   console.log('Server running on %s', server.info.uri)
}

process.on('unhandledRejection', (err) => {
   console.log(err)
   process.exit(1)
})

init()
