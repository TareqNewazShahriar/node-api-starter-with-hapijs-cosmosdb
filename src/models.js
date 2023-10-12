class ApiResponse {
   data
   statusCode
   errors = []
   success
}

class ErrorData {
   message
   stack
   errorField // Name of the field/property/db-field that causes the error.
   errorType // Database / Network / Server / ...
}
