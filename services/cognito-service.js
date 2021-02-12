const AmazonCognitoIdentity = require('amazon-cognito-identity-js')
const poolData = {
   UserPoolId: process.env.COGNITO_USER_POOL_ID,
   ClientId: process.env.COGNITO_CLIENT_ID
}

const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData)

async function signIn (body, callback) {
  var userName = body.email
  var password = body.password
  var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
       Username: userName,
       Password: password
   });
   var userData = {
       Username: userName,
       Pool: userPool
   }
   var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData)
   await cognitoUser.authenticateUser(authenticationDetails, {
       onSuccess: function (result) {
          let idToken = result.getIdToken().getJwtToken()
          let refreshToken = result.getRefreshToken().getToken()
          let user = result.getIdToken().payload
          callback({
            idToken : idToken,
            refreshToken : refreshToken,
            email : user.email
          });
       },
       onFailure: (function (err) {
          callback(err);
      })
  })
}

function signUp(body, callback){
  var attributeList = []
  var userName = body.email
  var password = body.password
  
  attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"custom:platform", Value:"FS"}));

  userPool.signUp(userName, password, attributeList, null, function(err, result){
      if(err){
        callback(err)
      }
      cognitoUser = result.user
      callback({
        userName : cognitoUser.getUsername()
      })
  });
}

function confirmRegistration(body, callback){
  var userName = body.email
  var code = body.code
  
  var userData = {
      Username: userName,
      Pool: userPool
  }
  var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData)

  cognitoUser.confirmRegistration(code, true, function(err, result) {
    if (err) callback(err)
    console.log('call result: ' , result)
    callback({
      userName : userName
    })
  })
}

module.exports = {
  signIn,
  signUp,
  confirmRegistration
}