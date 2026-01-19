const tenantQueries = require("./tenantQueries");
const pool = require("../../../config/db")

const tenantRepositories = {
  createTenant: async (client, name, userId) => {
    const result = await client.query(
      tenantQueries.createTenant,
      [name, userId]
    );
    return result.rows
  },

  assignRole: async (client, tenantId, role) => {
    const result = await client.query(
      tenantQueries.assignDefaultRoleforTenants,
      [tenantId, role]
    );
    return result.rows 
  },

  membership: async (client, userId, tenantId, roleId, status = null) => {
    const result = await client.query(
      tenantQueries.membership,
      [userId, tenantId, roleId, status]
    );
    return result.rows
  },

  mytenants:async(userid)=>{
    const result = await pool.query(tenantQueries.mytenants,[userid])
    return result.rows 
  }
,

findbyrole:async(tenantid,name)=>{
  const result = await pool.query(tenantQueries.findbyrole,[tenantid,name])
  return result.rows
},

inviteUser:async(userId,tenantId,RoleId,)=>{
const res = await pool.query(tenantQueries.inviteUser, [userId, tenantId,RoleId]);
return res.rows
},

getInvitation:async(userid)=>{
  const res = await pool.query(tenantQueries.getInvitation,[userid])
  return res.rows
},

AcceptInvitation:async(id)=>{
  return await pool.query(tenantQueries.AcceptInvitation,[id])

},
RejectInvitation:async(id)=>{
  return await pool.query(tenantQueries.RejectInvitation,[id])
}

     
};

module.exports = tenantRepositories;
