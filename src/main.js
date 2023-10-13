import Hapi from '@hapi/hapi'
import {CosmosdbService} from './cosmosdbService.js'
import apiController from './apiController.js'

const init = async () => {
   const server = Hapi.server({
      port: 3070,
      host: 'localhost'
   })

   const cosmosdbService = new CosmosdbService()
   await cosmosdbService.init()
   const controller = new apiController(cosmosdbService)
   for(let i = 0; i < controller.routes.length; i++)
      server.route(controller.routes[i])

   await server.start()
   console.log('Server running on %s', server.info.uri)
}

process.on('unhandledRejection', (err) => {
   console.log(err)
   process.exit(1)
})

init()
