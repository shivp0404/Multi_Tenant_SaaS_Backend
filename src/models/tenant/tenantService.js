const AppError = require("../../utils/AppError");
const jwtServices = require("../../utils/jwt");
const tenantRepositories = require("./tenantRepositories");
const pool = require("../../../config/db");
const AuthRepositories = require("../Auth/Auth.repositories")

const tenantService = {
  tenantRegister: async (userId, tenantName) => {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      if (!userId) throw new AppError("User id missing", 400);
      if (!tenantName || !tenantName.trim()) {
        throw new AppError("Tenant name is required", 400);
      }

      const tenantId = await tenantRepositories.createTenant(
        client,
        tenantName.trim(),
        userId
      );

      if (!tenantId) throw new AppError("Tenant not created", 500);

      const roles = ["Admin", "Manager", "Member"];
      const roleIds = {};

      for (const role of roles) {
        const roleId = await tenantRepositories.assignRole(
          client,
          tenantId,
          role
        );
        if (!roleId) throw new AppError(`Role ${role} failed`, 500);
        roleIds[role] = roleId;
      }

      const membership = await tenantRepositories.membership(
        client,
        userId,
        tenantId,
        roleIds.Admin,
        "active"
      );

      if (!membership) throw new AppError("Membership creation failed", 500);

      await client.query("COMMIT");

      const accessToken = await jwtServices.generateAccessToken({
        id:userId
      });

      return {tenantId:tenantId, AccessToken: accessToken };
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  },

  mytenants: async (id)=>{
    const userid = id
    if(!userid) throw new AppError("Id didn't Recieved",400)
    const tenants = await tenantRepositories.mytenants(userid)
   if(!tenants) throw new AppError('Tenants not Recieved ',500)
    return tenants
  }
  ,
  inviteUser: async (tenantId, email, roleName) => {
  
  const user = await AuthRepositories.findbyemail(email);
  if (!user) throw new AppError("User not found", 404);
 
  const role = await tenantRepositories.findbyrole(tenantId, roleName);
  
  if (!role) throw new AppError("Role not found", 400);

  const invite =  await tenantRepositories.inviteUser(user.id, tenantId, role);
  if(invite.rowsCount === 0) throw new AppError("Invitation not created",500)

  return invite
},
allinvitation: async(userid)=>{
  const id = userid;
  const invitations = await tenantRepositories.getInvitation(id)
  return invitations
},


};

module.exports = tenantService;
