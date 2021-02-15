const mongoose = require('mongoose')
const Schema = mongoose.Schema
const UserShema = new Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true,
  },
  create_date: { 
    type: Date, 
    default: Date.now
  },
  platform: {
    type: String,
    required: true,
  }
}) 

const User = mongoose.model('user', UserShema)
module.exports = User