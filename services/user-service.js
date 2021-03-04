const APIError = require('../errors/api-error')
const User = require('../models/user-model')
const UserData = require('../data/user-data')
const SessionData = require('../data/session-data')
const redis = require('../helpers/redis')

async function registerUserService(request){
  try {
    const userExist = await UserData.getUserByEmail(request.email.toLowerCase())
    if(userExist) throw new APIError('DuplicateError' , `${email} is already been registered`)
    let user = await UserData.createUser({
      email : request.email, 
      password : request.password,
      name : request.name, 
      platform : 'FS', 
    }).then(res => res.data)
    return {
      message : 'Registered.',
      data : user
    }
  } catch (error) {
    console.log('error register', error)
    throw new APIError(error.name , error.message)
  }
}

async function createUserSessionService(request){
  try {
    let session = await SessionData.createSession(request).then(res => res.data)
    redis.set('idToken_'+request.id_token, JSON.stringify(request))
    return {
      message : 'Created user session.',
      data : session
    }
  } catch (error) {
    console.log('error created user session', error)
    throw new APIError(error.name , error.message)
  }
}

module.exports = {
  registerUserService,
  createUserSessionService
}

