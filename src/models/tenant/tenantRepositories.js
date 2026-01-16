const tenantQueries = require("./tenantQueries");
const pool = require("../../../config/db")

const tenantRepositories = {
  createTenant: async (client, name, userId) => {
    const result = await client.query(
      tenantQueries.createTenant,
      [name, userId]
    );
    return result.rows[0]?.id || null;
  },

  assignRole: async (client, tenantId, role) => {
    const result = await client.query(
      tenantQueries.assignDefaultRoleforTenants,
      [tenantId, role]
    );
    return result.rows[0]?.id || null;
  },

  membership: async (client, userId, tenantId, roleId, status = null) => {
    const result = await client.query(
      tenantQueries.membership,
      [userId, tenantId, roleId, status]
    );
    return result.rows[0] || null;
  },

  mytenants:async(userid)=>{
    const result = await pool.query(tenantQueries.mytenants,[userid])
    return result.rows || null;
  }
,


     
};

module.exports = tenantRepositories;
