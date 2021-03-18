const rd = require('redis')
const util = require('util')

const client = rd.createClient({
  host: process.env.REDIS_URL,
  port: 6379
})

const getAsync = util.promisify(client.get).bind(client)

module.exports = {  
  client,
  set : (key, value) => client.set(key, value),
  get : async (key) => await getAsync(key)
}