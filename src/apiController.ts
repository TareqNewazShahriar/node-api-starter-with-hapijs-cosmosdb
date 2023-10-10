import { ReqRefDefaults, ServerRoute } from '@hapi/hapi'
import { CosmosdbService, ContainerNames } from './cosmosdbService.js'


class apiController {

   _dbService:CosmosdbService
   routes:ServerRoute<ReqRefDefaults>[]

   constructor(dbService:CosmosdbService) {
      this._dbService = dbService

      this.routes = [
         {
            method: 'GET',
            path: '/',
            handler: (/*req, res*/) => {
               return 'App is up and running.'
            }
         },
         {
            method: 'GET',
            path: '/api/v1/todos/get/{id}',
            handler: (req, res) => {
               console.log('-------')
               this._dbService.getItem(ContainerNames.items, req.params.id)
                  .then(r => {
                     debugger
                     res.response(r)
                  })
                  .catch(error => console.log(error))
            }
         },
         {
            method: 'POST',
            path: '/api/v1/note/create',
            handler: async (req, res) => {
               const requestData = req.payload
               console.log(requestData)
               return res.response(requestData)
            }
         }
      ]
   }
}

export default apiController