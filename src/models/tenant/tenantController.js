const tenantService = require("./tenantService");
const ApiResponse = require("../../utils/ApiResponse");
const AppError = require("../../utils/AppError");
const TenantsControllers = {
  createTenant: async (req, res) => {
    const response = await tenantService.tenantRegister(
      req.user.id,
      req.body.name
    );

    res
      .status(201)
      .json(ApiResponse.success("Tenant Created",response));
  },
  mytenants:async(req,res)=>{
    
    const response =  await tenantService.mytenants(
      req.user.id
    )
    res.status(200).json(ApiResponse.success("Get my Tenants",response))

    }
  ,
 invite:async(req,res)=>{
  const{email,role} = req.body
  const tenantId = req.params.id
  const response = await tenantService.inviteUser(tenantId,email,role);
  res.status(200).json(ApiResponse.success("Send Invitation",response))
 },

 invitations:async(req,res)=>{
  const id = req.user.id
  const response = await tenantService.allinvitation(id)
  res.status(200).json(ApiResponse.success("All Invitation",response))
 },

 AcceptInvitations: async(req,res)=>{
  const invitationid = req.params.id;
  const response = await tenantService.AcceptInvitation(invitationid)
  res.status(200).json(ApiResponse.success("Invitation Accepted",response));
 },
 
 RejectInvitations: async(req,res)=>{
  const invitationid = req.params.id;
  const response = await tenantService.RejectInvitation(invitationid)
  res.status(200).json(ApiResponse.success("Invitation Rejected",response));
 }
 




};
module.exports = TenantsControllers;
