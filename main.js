'use strict'

import Hapi from '@hapi/hapi'

const init = async () => {
   const server = Hapi.server({
      port: 3000,
      host: 'localhost'
   })

   server.route({
      method: 'GET',
      path: '/',
      handler: (request, h) => {
         return `App is up and running. Node ${process.version}`
      }
   })

   server.route({
      method: 'POST',
      path: '/api/note/create',
      handler: async (request, h) => {
         let requestData = request.payload
         console.log(requestData)
         return h.response(requestData)
      }
   })

   await server.start()
   console.log('Server running on %s', server.info.uri)
}

process.on('unhandledRejection', (err) => {
   console.log(err)
   process.exit(1)
})

init()