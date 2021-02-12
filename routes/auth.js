const express = require('express')
const router = express.Router()
const AuthController = require('../controllers/auth-controller')

router.post('/signin', AuthController.signInHandler)
router.post('/signup', AuthController.signUpHandler)
router.post('/verify-code', AuthController.confirmRegistationHandler)

module.exports = router