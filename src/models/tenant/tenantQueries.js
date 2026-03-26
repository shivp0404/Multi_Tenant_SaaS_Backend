const tenantQueries = {
  createTenant: `
    INSERT INTO tenants (name, createdby)
    VALUES ($1, $2)
    RETURNING id
  `,

  assignDefaultRoleforTenants: `
    INSERT INTO roles (tenant_id, name)
    VALUES ($1, $2)
    RETURNING id
  `,

  membership: `
    INSERT INTO user_tenants (user_id, tenant_id, role_id, status)
    VALUES ($1, $2, $3, $4)
    RETURNING id
  `,

  mytenants: `SELECT DISTINCT t.*
FROM tenants t
LEFT JOIN user_tenants ut 
    ON t.id = ut.tenant_id
WHERE 
    t.createdby = $1
    OR ut.user_id = $1 AND status='active';`,

  inviteUser: `
    INSERT INTO user_tenants(user_id, tenant_id, role_id, status)
    VALUES($1,$2,$3,'invited')
    ON CONFLICT (user_id, tenant_id) DO NOTHING
    RETURNING id
  `,

  findbyrole: `SELECT * FROM roles WHERE tenant_id =$1 AND name=$2`,
  getInvitation: `SELECT * FROM user_tenants WHERE user_id = $1 AND status = 'invited'`,
  AcceptInvitation: `UPDATE user_tenants SET status ='active' WHERE id = $1`,
  RejectInvitation: `DELETE FROM user_tenants WHERE id = $1`,
  TenantProfile: `SELECT 
    ut.tenant_id,
    u.id AS user_id,
    u.name AS user_name,
    u.email AS user_email,
    r.name AS role_name
FROM user_tenants ut
JOIN users u ON ut.user_id = u.id
JOIN roles r ON ut.role_id = r.id
WHERE ut.tenant_id = $1 AND ut.status ='active'`,

User:`SELECT r.name AS role
FROM user_tenants ut
JOIN roles r ON ut.role_id = r.id
WHERE ut.user_id = $1 
  AND ut.tenant_id = $2;`,

createPermission:`INSERT INTO permissions (name)
VALUES ($1)
ON CONFLICT (name) DO NOTHING
RETURNING *;`,

getPermission:`SELECT * FROM permissions `,

assignPermissionToRole:`INSERT INTO role_permissions (role_id, permission_id)
VALUES ($1, $2) ON CONFLICT DO NOTHING `
};


module.exports = tenantQueries;
