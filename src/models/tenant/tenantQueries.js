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

  mytenants: `SELECT * FROM tenants WHERE createdby = $1`,

  inviteUser: `
    INSERT INTO user_tenants(user_id, tenant_id, role_id, status)
    VALUES($1,$2,$3,'invited')
    ON CONFLICT (user_id, tenant_id) DO NOTHING
    RETURNING id
  `,
  
  findbyrole:`SELECT * FROM roles WHERE tenant_id =$1 AND name=$2`
};

module.exports = tenantQueries;
