const { signIn, signUp, confirmRegistration, refreshToken, signOut } = require('./cognito-service')
const APIError = require('../errors/api-error')
const { getPayload } = require('../helpers/jwt')
const { registerUserService } = require('../services/user-service')
const { createUserSessionService } = require('../services/user-service')
const SessionData = require('../data/session-data')

async function signInService(request) {
  try {
      const user = await new Promise((resolve, reject) => signIn(request , function(response){
        resolve(response)
      }))
      let userPayload = await getPayload(user.idToken)
      let requestSession = {
        id_token : user.idToken,
        refresh_token : user.refreshToken,
        email : user.email,
        exp : userPayload.exp,
        revoke_flag : 0
      } 
      let session = await createUserSessionService(requestSession)
      return {
        message : 'Authorized.',
        data : {
          idToken : user.idToken,
          accessToken : user.accessToken,
          refreshToken : user.refreshToken,
          email : user.email
        }
      }
  } catch (error) {
      console.log('error signing in', error)
      throw new APIError(error.name , error.message)
  }
}

async function signUpService(request) {
  try {
      const user = await new Promise((resolve, reject) => signUp(request , function(response){
        resolve(response)
      }))
      const userRegistered = await registerUserService(request)
      return userRegistered
  } catch (error) {
      console.log('error signup', error)
      throw new APIError(error.name , error.message)
  }
}

async function confirmRegistationService(request) {
  try {
      const user = await new Promise((resolve, reject) => confirmRegistration(request , function(response){
        resolve(response)
      }))
      return {
        message : 'Registation confirmed.',
        data : user
      }
  } catch (error) {
      console.log('error registation confirmed', error)
      throw new APIError(error.name , error.message)
  }
}

async function refreshTokenService(request) {
  try {
      const token = await new Promise((resolve, reject) => refreshToken(request , function(response){
        resolve(response)
      }))
      SessionData.refreshTokenSession(request.refreshToken)
      let userPayload = await getPayload(token.idToken)
      let requestSession = {
        id_token : token.idToken,
        refresh_token : token.refreshToken,
        email : token.email,
        exp : userPayload.exp,
        revoke_flag : 0
      } 
      let session = await createUserSessionService(requestSession)
      return {
        message : 'Refresh token.',
        data : token
      }
  } catch (error) {
      console.log('error refresh token', error)
      throw new APIError(error.name , error.message)
  }
}

async function signOutService(request) {
  try {
    let tokenArray = request.headers['authorization'].split(" ")
    let token = tokenArray[1]
    let payload = getPayload(token)
    await signOut(payload)
    return {
      message : 'Signed out.'
    }
  } catch (error) {
      console.log('error signed out', error)
      throw new APIError(error.name , error.message)
  }
}

module.exports = {
  signInService,
  signUpService,
  confirmRegistationService,
  refreshTokenService,
  signOutService
}