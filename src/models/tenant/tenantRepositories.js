const tenantQueries = require("./tenantQueries");
const { getPool } = require("../../../config/db");

const tenantRepositories = {
  createTenant: async (client, name, userId) => {
    const result = await client.query(tenantQueries.createTenant, [
      name,
      userId,
    ]);
    return result.rows;
  },

  assignRole: async (client, tenantId, role) => {
    const result = await client.query(
      tenantQueries.assignDefaultRoleforTenants,
      [tenantId, role],
    );
    return result.rows;
  },

  membership: async (client, userId, tenantId, roleId, status = null) => {
    const result = await client.query(tenantQueries.membership, [
      userId,
      tenantId,
      roleId,
      status,
    ]);
    return result.rows;
  },

  mytenants: async (userid) => {
    const pool = getPool();
    const result = await pool.query(tenantQueries.mytenants, [userid]);
    return result.rows;
  },
  findbyrole: async (tenantid, name) => {
    const pool = getPool();
    const result = await pool.query(tenantQueries.findbyrole, [tenantid, name]);
    return result.rows;
  },

  inviteUser: async (userId, tenantId, RoleId) => {
    const pool = getPool();
    const res = await pool.query(tenantQueries.inviteUser, [
      userId,
      tenantId,
      RoleId,
    ]);
    return res.rows;
  },

  getInvitation: async (userid) => {
    const pool = getPool();
    const res = await pool.query(tenantQueries.getInvitation, [userid]);
    return res.rows;
  },

  AcceptInvitation: async (id) => {
    const pool = getPool();
    return await pool.query(tenantQueries.AcceptInvitation, [id]);
  },
  RejectInvitation: async (id) => {
    const pool = getPool();
    return await pool.query(tenantQueries.RejectInvitation, [id]);
  },
  TenantProfile: async (id) => {
    const pool = getPool();
    return await pool.query(tenantQueries.TenantProfile, [id]);
  },
  User: async (tenant_id,user_id) => {

    const pool = getPool();
    return await pool.query(tenantQueries.User,[user_id,tenant_id]);
  },
  CreatePermission:async(client,name)=>{
    return await client.query(tenantQueries.createPermission,[name]);
  },
  assignPermissionToRole:async(client,role_id,permission_id)=>{
    return await client.query(tenantQueries.assignPermissionToRole,[role_id,permission_id])
  },
  getPermission:async(client)=>{
    return await client.query(tenantQueries.getPermission)
  }
};

module.exports = tenantRepositories;
