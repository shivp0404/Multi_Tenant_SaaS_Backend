const express = require('express')
const router = express.Router()
const BusinessControllers = require('../models/Business/Business.controllers')
const Authenticate = require("../middleware/Authenticate")
router.use(Authenticate)

router.post('/:id/createtask',BusinessControllers.createTask)
router.get('/:id/tasks',BusinessControllers.fetchTask)
router.post('/:id1/:id2/deletetask',BusinessControllers.deleteTask)

module.exports = router