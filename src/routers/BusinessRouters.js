const express = require('express')
const router = express.Router()
const BusinessControllers = require('../models/Business/Business.controllers')
const Authenticate = require("../middleware/Authenticate")
const Authorization = require("../middleware/can")
router.use(Authenticate)

router.post('/:id/createtask',Authorization('tenant:create'),BusinessControllers.createTask)
router.get('/:id/tasks',Authorization('tenant:read'),BusinessControllers.fetchTask)
router.post('/:id1/:id2/deletetask',Authorization('task.view'),BusinessControllers.deleteTask)
router.get('/alltask',BusinessControllers.alltask)
router.get('/:id/tenanttask',BusinessControllers.TenantTask)

module.exports = router