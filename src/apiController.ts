function apiController(dbService) {
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
         handler: (res, req) => {
            
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

export default apiController