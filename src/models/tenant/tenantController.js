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


};
module.exports = TenantsControllers;
