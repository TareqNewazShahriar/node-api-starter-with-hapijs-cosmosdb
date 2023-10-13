const ERROR_TYPES = {
   Database: 'Database', 
   Network: 'Network',
   Server: 'Server'
}

function ApiResponse(success, statusCode, data) {
   this.success = success
   this.statusCode = statusCode
   this.data = data
   this.error
}

function ErrorObject(message, errorField, errorType, error) {
   this.message = message
   this.errorfield = errorField // Name of the field/property/db-field that causes the error.
   this.errorType = errorType // Enum. Only in case of 500 error: Database / Network / Server.
   if(error) {
      this.innerErrorJson = JSON.stringify(error)
   }
}

function create(statusCode, data, success = undefined) {
   // Generally this method will be called when the operation is successful.
   // And will assign 'success' field based on statusCode, 
   // unless the 'success' parameter is explicitly passed.
   return new ApiResponse((success !== undefined ? success : statusCode <= 399), statusCode, data) //
}

function createError(statusCode, message, errorfield, errorType, error) {
   let apiResponse = new ApiResponse(false, statusCode)
   try {
      apiResponse.error = new ErrorObject(message, errorfield, errorType, error)
   } 
   catch { }
   
   return apiResponse
}

export default {create, createError, ERROR_TYPES}