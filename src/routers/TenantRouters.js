const express = require("express")
const router = express.Router()
const Authenticate = require("../middleware/Authenticate")
const TenantsControllers = require("../models/tenant/tenantController")
const Authorization = require("../middleware/can")
router.use(Authenticate)

router.post('/create',TenantsControllers.createTenant);
router.get('/me',TenantsControllers.mytenants);
router.post('/:id/invite',Authorization('tenant.invite'),TenantsControllers.invite);
router.get('/invitations',TenantsControllers.invitations)
router.post('/invitations/:id/accept',TenantsControllers.AcceptInvitations)
router.post('/invitations/:id/reject',TenantsControllers.RejectInvitations)

module.exports = router