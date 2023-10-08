import Hapi from '@hapi/hapi'
import routes from './routes.js'

const init = async () => {
   const server = Hapi.server({
      port: 3070,
      host: 'localhost'
   })

   for(const route in routes)
      server.route(route)

   await server.start()
   console.log('Server running on %s', server.info.uri)
}

process.on('unhandledRejection', (err) => {
   console.log(err)
   process.exit(1)
})

init()
