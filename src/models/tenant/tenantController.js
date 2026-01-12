const tenantService = require("./tenantService");
const ApiResponse = require("../../utils/ApiResponse");
const TenantsControllers = {
  createTenant: async (req, res) => {
    const response = await tenantService.tenantRegister(
      req.user.id,
      req.body.name
    );

    res
      .status(201)
      .json(ApiResponse.success("Tenant Created", response.accessToken));
  },
};
module.exports = TenantsControllers;
