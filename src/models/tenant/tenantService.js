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

      const tenant = await tenantRepositories.createTenant(
        client,
        tenantName.trim(),
        userId
      );
    
      if (tenant.length === 0) throw new AppError("Tenant not created", 500);
      const tenantId = tenant[0].id
  
  
      const roles = ["Admin", "Manager", "Member"];
      const roleIds = {};

      for (const role of roles) {
        const roleId = await tenantRepositories.assignRole(
          client,
          tenantId,
          role
        );
        if (roleId.length === 0) throw new AppError(`Role ${role} failed`, 500);
        roleIds[role] = roleId[0].id;
      }


      const membership = await tenantRepositories.membership(
        client,
        userId,
        tenantId,
        roleIds.Admin,
        "active"
      );
      
      if (membership.length === 0) throw new AppError("Membership creation failed", 500);

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

  return invite
},

allinvitation: async(userid)=>{
  const id = userid;
  if(!userid) throw new AppError("Id not found",400)
  const invitations = await tenantRepositories.getInvitation(id)
  return invitations
},

AcceptInvitation:async(id)=>{
  const invitationid = id;
  if(!id) throw new AppError("Id not found")
  const invitations = await tenantRepositories.AcceptInvitation(invitationid);
  return invitations
},

RejectInvitation:async(id)=>{
  const invitationid = id;
   if(!id) throw new AppError("Id not found")
  const invitations = await tenantRepositories.RejectInvitation(invitationid);
  return invitations
}


};

module.exports = tenantService;
