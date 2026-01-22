const BusinessQueries ={
    createTask:`INSERT INTO tasks (tenant_id,title,description,status,priority,assigned_to,created_by)VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING id , title`,
    validateAssignUser:`SELECT * FROM user_tenants WHERE tenant_id =$1 AND user_id=$2`,
    fetchTask:`SELECT * FROM tasks WHERE assigned_to =$1 AND tenant_id=$2`,
    deleteTask:`DELETE FROM tasks WHERE id = $1 AND tenant_id =$2 `

}

module.exports = BusinessQueries