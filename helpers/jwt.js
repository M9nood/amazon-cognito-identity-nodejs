const jwt = require('jsonwebtoken')

function getPayload(token){
  var decodedJwt = jwt.decode(token, {complete: true})
  if(decodedJwt) return decodedJwt.payload
  return null
}

module.exports = {
  getPayload
}