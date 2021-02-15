const { signIn, signUp, confirmRegistration, refreshToken, signOut } = require('./cognito-service')
const APIError = require('../errors/api-error')
const { getPayload } = require('../helpers/jwt')
<<<<<<< HEAD
=======
const { registerUserService } = require('../services/user-service')
>>>>>>> feat : refresh token and sign out

async function signInService(request) {
  try {
      const user = await new Promise((resolve, reject) => signIn(request , function(response){
        resolve(response)
      }))
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