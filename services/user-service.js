require('../helpers/mongodb-connection')
const APIError = require('../errors/api-error')
const User = require('../models/user-model')

async function registerUserService(request){
  try {
    const userExist = await User.findOne({email: request.email.toLowerCase()})
    if(userExist) throw new APIError('DuplicateError' , `${email} is already been registered`)
  
    const user = new User({
        email : request.email, 
        password : request.password,
        name : request.name, 
        platform : 'FS', 
    })
    const saveUser = await user.save()
    return {
      message : 'Registered.',
      data : saveUser
    }
  } catch (error) {
    console.log('error register', error)
    throw new APIError(error.name , error.message)
  }
}

module.exports = {
  registerUserService
}

