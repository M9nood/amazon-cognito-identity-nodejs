const { expressHandler } = require('./express-handler')

async function getUserHandler(request) {
  return {
    message : 'Get User',
    data : {
      email : 'nattawoot@email'
    }
  }
}

module.exports = {
  getUserHandler : expressHandler({
    handler : getUserHandler
  })
}