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
            method: 'POST',
            path: '/api/todo/create',
            handler: (req, res) => {
               const requestData = req.payload
               return this._dbService.create(ContainerNames.items, requestData)
                  .then(r =>
                     res.response(r).code(r.statusCode)
                  )
                  .catch(e => 
                     res.response(e).code(e.statusCode)
                  )
            }
         },
         {
            method: 'PUT',
            path: '/api/todo/{id}',
            handler: (req, res) => {
               // todo: validation with joi
               const requestData = req.payload
               return this._dbService.update(ContainerNames.items, req.params.id, requestData)
                  .then(() =>
                     res.response().code(204)
                  )
                  .catch(e => 
                     res.response(e).code(e.statusCode)
                  )
            }
         },
         {
            method: 'DELETE',
            path: '/api/todo/{id}',
            handler: (req, res) => {
               // todo: validation with joi
               return this._dbService.delete(ContainerNames.items, req.params.id)
                  .then(() =>
                     res.response().code(204)
                  )
                  .catch(e => 
                     res.response(e).code(e.statusCode)
                  )
            }
         },
         {
            method: 'GET',
            path: '/api/todo/get/{id}',
            handler: (req, res) => {
               return this._dbService.get(ContainerNames.items, req.params.id)
                  .then(r =>
                     res.response(r).code(r.statusCode)
                  )
                  .catch(e =>
                     res.response(e).code(e.statusCode)
                  )
            }
         },
         {
            method: 'GET',
            path: '/api/todo/getall/pending',
            handler: (req, res) => {
               return this._dbService.query(ContainerNames.items, { name: '@completed', value: false })
                  .then(r => {
                     return res.response(r).code(r.statusCode)
                  })
                  .catch(e => {
                     return res.response(e).code(e.statusCode)
                  })
            }
         }
      ]
   }
}

export default apiController