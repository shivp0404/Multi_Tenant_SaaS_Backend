const express = require("express")
const router = express.Router()
const Authenticate = require("../middleware/Authenticate")
const TenantsControllers = require("../models/tenant/tenantController")
router.use(Authenticate)

router.post('/create',TenantsControllers.createTenant);

module.exports = router