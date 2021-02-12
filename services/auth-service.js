const { signIn, signUp, confirmRegistration } = require('./cognito-service')
const APIError = require('../errors/api-error')

async function signInService(request) {
  try {
      const user = await new Promise((resolve, reject) => signIn(request , function(response){
        resolve(response)
      }))
      return {
        message : 'Authorized.',
        data : {
          idToken : user.idToken,
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
      return {
        message : 'Registered.',
        data : {
          userName : user.userName
        }
      }
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


module.exports = {
  signInService,
  signUpService,
  confirmRegistationService
}