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
    console.log(req.user.id)
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
 }


};
module.exports = TenantsControllers;
