const express = require("express")
const router = express.Router()
const Authenticate = require("../middleware/Authenticate")
const TenantsControllers = require("../models/tenant/tenantController")
const Authorization = require("../middleware/can")
router.use(Authenticate)

router.post('/create',TenantsControllers.createTenant);
router.get('/me',TenantsControllers.mytenants);
// router.post('/:id/invite',TenantsControllers.invite);
router.post('/:id/invite',Authorization('user:invite'),TenantsControllers.invite);
router.get('/invitations',TenantsControllers.invitations)
router.post('/invitations/:id/accept',TenantsControllers.AcceptInvitations)
router.post('/invitations/:id/reject',TenantsControllers.RejectInvitations)
router.get('/profile/:id',TenantsControllers.GetTenant)
router.get('/role/:id',TenantsControllers.GetUser)

module.exports = router