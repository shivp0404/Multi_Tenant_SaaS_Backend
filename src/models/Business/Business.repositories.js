const BusinessQueries = require("./Business.queries")
const pool = require("../../../config/db")
const BusinessRepository = {
    createTask: async(tenantid,title,description,status,priority,assigned_to,created_by,updated_by)=>{
        const result = await pool.query(BusinessQueries.createTask,[tenantid,title,description,status,priority,assigned_to,created_by])
        return result.rows
    },
    validateAssignUser: async(tenantid,userid)=>{
        const result = await pool.query(BusinessQueries.validateAssignUser,[tenantid,userid])
        return result.rows
    },
    fetchTask: async(userid,tenantid)=>{
        const result = await pool.query(BusinessQueries.fetchTask,[userid,tenantid])
        return result.rows
    },
    deleteTask: async(taskid,tenantid)=>{
        
         return await pool.query(BusinessQueries.deleteTask,[taskid,tenantid])
    }
}

module.exports = BusinessRepository