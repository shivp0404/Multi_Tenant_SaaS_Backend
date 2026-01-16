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

findbyrole:async(tenantid,name)=>{
  const result = await pool.query(tenantQueries.findbyrole,[tenantid,name])
  return result.rows[0].id || null;
},
inviteUser:async(userId,tenantId,RoleId,)=>{
const res = await pool.query(tenantQueries.inviteUser, [userId, tenantId,RoleId]);
return res.rows[0] || null;
},
getInvitation:async(userid)=>{
  const res = await pool.query(tenantQueries.getInvitation,[userid])
  return res.rows[0] || null
},

AcceptInvitation:async(id)=>{
  const res = await pool.query(tenantQueries.AcceptInvitation,[id])
  return res.rows[0] || null
},
RejectInvitation:async(id)=>{
  const res = await pool.query(tenantQueries.RejectInvitation,[id])
  return res.rows[0] || null
}

     
};

module.exports = tenantRepositories;
