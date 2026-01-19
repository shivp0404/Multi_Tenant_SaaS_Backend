const express = require('express')
const router = express.Router()
const BusinessControllers = require('../models/Business/Business.controllers')
const Authenticate = require("../middleware/Authenticate")
router.use(Authenticate)

router.post('/:id/createtask',BusinessControllers.createTask)


module.exports = router