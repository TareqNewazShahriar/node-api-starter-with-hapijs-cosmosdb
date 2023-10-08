const routes = [
   {
      method: 'GET',
      path: '/',
      handler: (/*req, res*/) => {
         return `App is up and running. Node ${process.version}`
      }
   },
   {
      method: 'POST',
      path: '/api/note/create',
      handler: async (req, res) => {
         const requestData = req.payload
         console.log(requestData)
         return res.response(requestData)
      }
   }
]

export default routes