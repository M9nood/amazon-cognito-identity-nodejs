const APIError = require('../errors/api-error')
const User = require('../models/user-model')

async function createUser(data){
  try{
    const user = new User(data)
    const saveUser = await user.save()
    return {
      message : 'User created.',
      data : saveUser
    }
  }catch (error) {
    console.log('error create user', error)
    throw new APIError(null , 'error create user')
  }
}

async function getUserByEmail(email){
  const userExist = await User.findOne({email: email.toLowerCase()})
  return userExist
}

module.exports = {
  createUser,
  getUserByEmail
}