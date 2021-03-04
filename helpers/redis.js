const rd = require('redis')

const client = rd.createClient({
  host: process.env.REDIS_URL,
  port: 6379
})

function set(key, value){
  client.set(key, value)
}

async function get(key){
  const value = await new Promise((resolve, reject) => client.get(key, (err, value) => {
    if(err) resolve(null)
    else resolve(value)
  }))
  return value
}

function getClient(){
  return client
}

module.exports = {
  set,
  get,
  getClient
}