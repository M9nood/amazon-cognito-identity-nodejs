const express = require('express')
const router = express.Router()
const UserController = require('../controllers/user-controller')
const AuthMiddleware = require('../middleware/auth-middleware')

router.get('/me', AuthMiddleware.validateToken , UserController.getUserHandler)

module.exports = router