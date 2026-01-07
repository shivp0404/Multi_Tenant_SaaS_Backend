const express = require('express')
const router = express.Router()
const AuthControllers = require('../models/Auth/Auth.controllers')
router.post('/register',AuthControllers.register)

module.exports = router