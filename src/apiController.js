import { ContainerNames } from './cosmosdbService.js'


class apiController {

   _dbService = null
   routes = []

   constructor(dbService) {
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
            path: '/api/v1/todo/getall/pending',
            handler: (req, res) => {
               return this._dbService.query(ContainerNames.items, { name: '@completed', value: false })
                  .then(r => {
                     return r
                  })
                  .catch(error => {
                     return error
                  })
            }
         },
         {
            method: 'GET',
            path: '/api/v1/todo/get/{id}',
            handler: (req, res) => {
               return this._dbService.get(ContainerNames.items, req.params.id)
                  .then(r =>
                     res.response(r)
                  )
                  .catch(error =>
                     res.response(error).code(500)
                  )
            }
         },
         {
            method: 'POST',
            path: '/api/v1/todo/create',
            handler: (req, res) => {
               const requestData = req.payload
               return this._dbService.create(ContainerNames.items, requestData)
                  .then(r =>
                     res.response(r).code(201)
                  )
                  .catch(error => 
                     res.response(error).code(500)
                  )
            }
         }
      ]
   }
}

export default apiController