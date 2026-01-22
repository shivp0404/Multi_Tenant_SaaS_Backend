const express = require('express')
const router = express.Router()
const BusinessControllers = require('../models/Business/Business.controllers')
const Authenticate = require("../middleware/Authenticate")
const Authorization = require("../middleware/can")
router.use(Authenticate)

router.post('/:id/createtask',Authorization('task.create'),BusinessControllers.createTask)
router.get('/:id/tasks',Authorization('task.view'),BusinessControllers.fetchTask)
router.post('/:id1/:id2/deletetask',Authorization('task.view'),BusinessControllers.deleteTask)

module.exports = router