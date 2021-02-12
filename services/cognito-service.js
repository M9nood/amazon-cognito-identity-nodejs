const AmazonCognitoIdentity = require('amazon-cognito-identity-js')
const poolData = {
   UserPoolId: process.env.COGNITO_USER_POOL_ID,
   ClientId: process.env.COGNITO_CLIENT_ID
}

const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData)

async function signIn (body, callback) {
  let userName = body.email
  let password = body.password
  let authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
       Username: userName,
       Password: password
   });
   let userData = {
       Username: userName,
       Pool: userPool
   }
   let cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData)
   await cognitoUser.authenticateUser(authenticationDetails, {
       onSuccess: function (result) {
          let idToken = result.getIdToken().getJwtToken()
          let accessToken = result.getAccessToken().getJwtToken()
          let refreshToken = result.getRefreshToken().getToken()
          let user = result.getIdToken().payload
          callback({
            idToken : idToken,
            accessToken : accessToken,
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
  let attributeList = []
  let userName = body.email
  let password = body.password
  
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
  let userName = body.email
  let code = body.code
  
  let userData = {
      Username: userName,
      Pool: userPool
  }
  let cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData)

  cognitoUser.confirmRegistration(code, true, function(err, result) {
    if (err) callback(err)
    console.log('call result: ' , result)
    callback({
      userName : userName
    })
  })
}

function refreshToken(body, callback) {
  let refreshToken = new AmazonCognitoIdentity.CognitoRefreshToken({RefreshToken: body.refreshToken});
  let userName = body.email

  const userData = {
      Username: userName,
      Pool: userPool
  }

  const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData)

  cognitoUser.refreshSession(refreshToken, (err, session) => {
      if (err) callback(err)
      let user = session.getIdToken().payload
      callback({
        idToken : session.idToken.jwtToken,
        accessToken : session.accessToken.jwtToken,
        refreshToken : session.refreshToken.token,
        email : user.email
      })
  })
}

function signOut(payload) {
  const userData = {
    Username: payload.email,
    Pool: userPool
  }
  const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData)
  cognitoUser.signOut()
}

module.exports = {
  signIn,
  signUp,
  confirmRegistration,
  refreshToken,
  signOut
}