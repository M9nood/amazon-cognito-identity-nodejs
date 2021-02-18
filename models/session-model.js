const mongoose = require('mongoose')
const Schema = mongoose.Schema
const SessionShema = new Schema({
  id_token: {
    type: String,
    required: true,
  },
  refresh_token: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
  },
  exp: {
    type: String,
    required: true,
  },
  create_date: { 
    type: Date, 
    default: Date.now
  },
  revoke_flag: {
    type: Number,
    required: true,
  }
}) 

const Session = mongoose.model('session', SessionShema)
module.exports = Session