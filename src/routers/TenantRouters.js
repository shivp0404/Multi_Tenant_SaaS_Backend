const express = require("express")
const router = express.Router()
const Authenticate = require("../middleware/Authenticate")
const TenantsControllers = require("../models/tenant/tenantController")
router.use(Authenticate)

router.post('/create',TenantsControllers.createTenant);
router.get('/me',TenantsControllers.mytenants);
router.post('/:id/invite',TenantsControllers.invite);
router.get('/invitations',TenantsControllers.invitations)
module.exports = router