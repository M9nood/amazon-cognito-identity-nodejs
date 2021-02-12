const { expressHandler } = require('./express-handler')
const { signInService, signUpService, confirmRegistationService, refreshTokenService, signOutService } = require('../services/auth-service')

async function signInHandler(req) {
  const user = await signInService(req.body)
  return user
}

async function signUpHandler(req) {
  const user = await signUpService(req.body)
  return user
}

async function confirmRegistationHandler(req) {
  const user = await confirmRegistationService(req.body)
  return user
}

async function refreshTokenHandler(req) {
  const user = await refreshTokenService(req.body)
  return user
}

async function signOutHandler(req) {
  const user = await signOutService(req)
  return user
}

module.exports = {
  signInHandler : expressHandler({
    handler : signInHandler
  }),
  signUpHandler : expressHandler({
    handler : signUpHandler
  }),
  confirmRegistationHandler : expressHandler({
    handler : confirmRegistationHandler
  }),
  refreshTokenHandler : expressHandler({
    handler : refreshTokenHandler
  }),
  signOutHandler : expressHandler({
    handler : signOutHandler
  }),
}