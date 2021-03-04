const APIError = require('../errors/api-error')
const Session = require('../models/session-model')

async function createSession(data){
  try{
    const session = new Session(data)
    const saveSession = await session.save()
    return {
      message : 'Session created.',
      data : saveSession
    }
  }catch (error) {
    console.log('error create session', error)
    throw new APIError(null , 'error create session')
  }
}

async function revokeIdToken(idToken){
  await Session.updateOne({ id_token: idToken}, { revoke_flag : 1 })
}

async function refreshTokenSession(refreshToken){
  await Session.updateOne({ refresh_token: refreshToken}, { revoke_flag : 1 })
}



module.exports = {
  createSession,
  revokeIdToken,
  refreshTokenSession
}