const AppError = require("../../utils/AppError");
const jwtServices = require("../../utils/jwt");
const tenantRepositories = require("./tenantRepositories");
const { getPool } = require("../../../config/db");
const AuthRepositories = require("../Auth/Auth.repositories");
const {generateAccessToken,generateRefreshToken} = require("../../utils/jwt")

const tenantService = {
  // tenantRegister: async (userId, tenantName) => {
  //   const pool = getPool();
  //   const client = await pool.connect();

  //   try {
  //     await client.query("BEGIN");

  //     if (!userId) throw new AppError("User id missing", 400);
  //     if (!tenantName || !tenantName.trim()) {
  //       throw new AppError("Tenant name is required", 400);
  //     }

  //     const tenant = await tenantRepositories.createTenant(
  //       client,
  //       tenantName.trim(),
  //       userId,
  //     );

  //     if (tenant.length === 0) throw new AppError("Tenant not created", 500);
  //     const tenantId = tenant[0].id;

  //     const roles = ["Admin", "Manager", "Member"];
  //     const roleIds = {};

  //     for (const role of roles) {
  //       const roleId = await tenantRepositories.assignRole(
  //         client,
  //         tenantId,
  //         role,
  //       );
  //       if (roleId.length === 0) throw new AppError(`Role ${role} failed`, 500);
  //       roleIds[role] = roleId[0].id;
  //     }

  //     const membership = await tenantRepositories.membership(
  //       client,
  //       userId,
  //       tenantId,
  //       roleIds.Admin,
  //       "active",
  //     );

  //     if (membership.length === 0)
  //       throw new AppError("Membership creation failed", 500);

  //     await client.query("COMMIT");

  //     const accessToken = await jwtServices.generateAccessToken({
  //       id: userId,
  //     });

  //     return { tenantId: tenantId, AccessToken: accessToken };
  //   } catch (err) {
  //     await client.query("ROLLBACK");
  //     throw err;
  //   } finally {
  //     client.release();
  //   }
  // },

tenantRegister: async (userId, tenantName) => {
  const pool = getPool();
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    if (!userId) throw new AppError("User id missing", 400);
    if (!tenantName || !tenantName.trim()) {
      throw new AppError("Tenant name is required", 400);
    }

    // 1. Create Tenant
    const tenant = await tenantRepositories.createTenant(
      client,
      tenantName.trim(),
      userId,
    );

    if (tenant.length === 0) throw new AppError("Tenant not created", 500);
    const tenantId = tenant[0].id;

    // 2. Create Roles
    const roles = ["Admin", "Manager", "Member"];
    const roleIds = {};

    for (const role of roles) {
      const roleId = await tenantRepositories.assignRole(
        client,
        tenantId,
        role,
      );
      if (roleId.length === 0) throw new AppError(`Role ${role} failed`, 500);
      roleIds[role] = roleId[0].id;
    }



    // 3.1 Seed permissions (safe for all tenants)
const defaultPermissions = [
  "tenant:create",
    "tenant:read",
    "tenant:update",
    "tenant:delete",
    "user:invite",
    "user:read_all",
    "user:update",
    "user:delete",
];

    for (const perm of defaultPermissions) {
      await tenantRepositories.CreatePermission(client, perm);
    }

    // 3.2 Fetch all permissions
    const permissions = await tenantRepositories.getPermission(client);

    if (!permissions || permissions.rows.length === 0) {
      throw new AppError("Permissions not found", 500);
    }

const rolePermissionMap = {
  Admin: [
    "tenant:create",
    "tenant:read",
    "tenant:update",
    "tenant:delete",
    "user:invite",
    "user:read_all",
    "user:update",
    "user:delete",
  ],

  Manager: [
    "tenant:create",
    "tenant:read",
    "user:invite",
    "user:read_all",
    "user:update",
    "user:delete"
  ],

  Member: [
    "tenant:read",
  ],
};
    // 3.3 Map permissions to roles
for (const role of roles) {
  const roleId = roleIds[role];
  const allowedPermissionNames = rolePermissionMap[role];

  const allowedPermissions = permissions.rows.filter(p =>
    allowedPermissionNames.includes(p.name)
  );

  for (const perm of allowedPermissions) {
    await tenantRepositories.assignPermissionToRole(
      client,
      roleId,
      perm.id
    );
  }
}

    // ===========================
    // 4. Membership
    // ===========================
    const membership = await tenantRepositories.membership(
      client,
      userId,
      tenantId,
      roleIds.Admin,
      "active",
    );

    if (membership.length === 0)
      throw new AppError("Membership creation failed", 500);

    await client.query("COMMIT");

    const accessToken = await jwtServices.generateAccessToken({
      id: userId,
    });

    return { tenantId: tenantId, AccessToken: accessToken };

  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
},

  mytenants: async (id) => {
    const userid = id;
    if (!userid) throw new AppError("Id didn't Recieved", 400);
    const tenants = await tenantRepositories.mytenants(userid);
    return tenants;
  },

  inviteUser: async (tenantId, email, roleName) => {
    if (!tenantId || !email || !roleName)
      throw new AppError("Payload is missing", 404);

    const user = await AuthRepositories.findbyemail(email);
    if (!user) throw new AppError("User not found", 404);

    const role = await tenantRepositories.findbyrole(tenantId, roleName);

    if (role.length === 0) throw new AppError("Role not found", 404);

    const invite = await tenantRepositories.inviteUser(
      user.id,
      tenantId,
      role[0].id,
    );

    if (invite.length === 0) throw new AppError("Invitation not send");

    return invite[0].id;
  },

  allinvitation: async (userid) => {
    const id = userid;

    if (!userid) throw new AppError("Id not found", 400);
    const invitations = await tenantRepositories.getInvitation(id);

    return invitations;
  },

  AcceptInvitation: async (id) => {
    const invitationid = id;
    if (!id) throw new AppError("Id not found", 400);
    return await tenantRepositories.AcceptInvitation(invitationid);
  },

  RejectInvitation: async (id) => {
    const invitationid = id;
    if (!id) throw new AppError("Id not found", 400);
    return await tenantRepositories.RejectInvitation(invitationid);
  },

  GetTenant: async(id)=>{
    const tenantId = id;
    if(!id) throw new AppError("Id not found",400);
    return  await tenantRepositories.TenantProfile(tenantId)
    
  },
  
  GetUser: async(tenant_id,user_id)=>{
    return await tenantRepositories.User(tenant_id,user_id)
  }
};

module.exports = tenantService;
