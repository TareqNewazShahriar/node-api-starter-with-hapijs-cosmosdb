function ApiResponse(success, statusCode, data) {
   this.success = success
   this.statusCode = statusCode
   this.data = data
   this.errorObject
}

function ErrorObject(message, errorField, errorType, error) {
   this.message = message
   this.errorfield = errorField // Name of the field/property/db-field that causes the error.
   this.errorType = errorType // Enum. Only in case of 500 error: Database / Network / Server.
   if(error) {
      this.innerErrorJson = JSON.stringify(error)
   }
}

const ERROR_TYPES = {
   Database: 'Database', 
   Network: 'Network',
   Server: 'Server'
}

function createErrorResponse(statusCode, message, errorfield, errorType, error) {
   let apiResponse = new ApiResponse(false, statusCode)
   try {
      apiResponse.errorObject = new ErrorObject(message, errorfield, errorType, error)
   } 
   catch { }
   
   return apiResponse
}

export {ApiResponse, createErrorResponse, ERROR_TYPES}