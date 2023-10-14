import { Containers } from './cosmosdbService.js'

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
            path: '/api/book/create',
            handler: (req, res) => {
               const requestData = req.payload
               return this._dbService.create(Containers.books, requestData)
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
            path: '/api/book/{id}',
            handler: (req, res) => {
               // todo: validation with joi
               const requestData = req.payload
               return this._dbService.update(Containers.books, req.params.id, requestData)
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
            path: '/api/book/{id}',
            handler: (req, res) => {
               // todo: validation with joi
               return this._dbService.delete(Containers.books, req.params.id)
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
            path: '/api/book/get/{id}',
            handler: (req, res) => {
               return this._dbService.get(Containers.books, req.params.id, req.params.id)
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
            path: '/api/book/getall',
            handler: (req, res) => {
               return this._dbService.getAll(Containers.books)
                  .then(r => {
                     return res.response(r).code(r.statusCode)
                  })
                  .catch(e => {
                     return res.response(e).code(e.statusCode)
                  })
            }
         },
         {
            method: 'GET',
            path: '/api/book/search',
            handler: (req, res) => {
               const titleContains = `%${req.query['title']}%` // Caution: cosmos db string operation are case sensitive.

               return this._dbService.query(Containers.books,
                  'select * from c where c.name like @word',
                  [{name: '@word', value: titleContains}])
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