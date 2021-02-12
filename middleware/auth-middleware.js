const jwkToPem = require('jwk-to-pem')
const jwt = require('jsonwebtoken')
const request = require('request')
const APIError = require('../errors/api-error')
const { errorHandler } = require('../controllers/error-controller')

function validateToken(req, res, next){
  var tokenArray = req.headers['authorization'].split(" ")
  var token = tokenArray[1]
  request({
      url: `https://cognito-idp.${process.env.POOL_REGION}.amazonaws.com/${process.env.COGNITO_USER_POOL_ID}/.well-known/jwks.json`,
      json: true
  }, function (error, response, body) {
      try{
        if (!error && response.statusCode === 200) {
            pems = {};
            var keys = body['keys'];
            for(var i = 0; i < keys.length; i++) {
                //Convert each key to PEM
                var key_id = keys[i].kid;
                var modulus = keys[i].n;
                var exponent = keys[i].e;
                var key_type = keys[i].kty;
                var jwk = { kty: key_type, n: modulus, e: exponent};
                var pem = jwkToPem(jwk);
                pems[key_id] = pem;
            }
            //validate the token
            var decodedJwt = jwt.decode(token, {complete: true});
            if (!decodedJwt) {
                throw new APIError('Unauthorized','Not a valid JWT token')
            }

            var kid = decodedJwt.header.kid;
            var pem = pems[kid];
            if (!pem) {
                throw new APIError('Unauthorized','Invalid token')
            }

            console.log('token exp', decodedJwt.payload.exp)
            console.log('current', (new Date().getTime() + 1) / 1000)

            jwt.verify(token, pem, function(err, payload) {
                if(err) {
                    if(decodedJwt.payload.exp < (new Date().getTime() + 1) / 1000) throw new APIError('Unauthorized','Token expired')
                    throw new APIError('Unauthorized','Invalid token')
                } else {
                    next()
                }
            });
        } else {
            throw new APIError(null,'Error token')
        }
     }catch(err){
        errorHandler(err,res)
     }
  });
}

module.exports = {
  validateToken
}