const express = require('express')
const router = express.Router()
const AuthControllers = require('../models/Auth/Auth.controllers')
router.post('/register',AuthControllers.register)
router.post('/login',AuthControllers.login)
router.post('/logout',AuthControllers.logout)

module.exports = router