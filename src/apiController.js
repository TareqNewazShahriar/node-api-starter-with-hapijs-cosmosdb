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
            path: '/api/v1/todos/get/{id}',
            handler: async (req, res) => {
               console.log('-------')
               
               this._dbService.getItem(ContainerNames.items, req.params.id)
                  .then(r => {
                     res.response(r).code(200)
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