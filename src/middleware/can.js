const pool = require("../../config/db");
const AppError = require("../utils/AppError");

const can = (permission) => {
  return async (req, res, next) => {
    const userId = req.user.id;
    const tenantId = req.params.id;

    if (!tenantId) {
      return next(new AppError("Tenant id missing in params", 400));
    }
    
    const query = `
      SELECT 1
      FROM user_tenants ut
      JOIN roles r ON ut.role_id = r.id
      JOIN role_permissions rp ON rp.role_id = r.id
      JOIN permissions p ON rp.permission_id = p.id
      WHERE ut.user_id = $1
        AND ut.tenant_id = $2
        AND ut.status = 'active'
        AND p.name = $3
      LIMIT 1
    `;

    const result = await pool.query(query, [
      userId,
      tenantId,
      permission,
    ]);
    
    if (result.rowCount === 0) {
      return next(new AppError("Forbidden", 403));
    }

    next();
  };
};

module.exports = can;
