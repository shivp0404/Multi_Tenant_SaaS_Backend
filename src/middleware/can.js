const { getPool } = require("../../config/db");
const AppError = require("../utils/AppError");

const can = (permission) => {
  return async (req, res, next) => {
    try {
      const pool = getPool();

      if (!req.user || !req.user.id) {
        return next(new AppError("Unauthorized", 401));
      }

      const userId = req.user.id;

      const tenantId =
        req.params.id || req.body.tenant_id || req.query.tenantId;
        console.log(userId,tenantId)

      if (!tenantId) {
        return next(new AppError("Tenant id missing", 400));
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
    } catch (err) {
      console.error("Authorization error:", err);
      return next(new AppError("Authorization failed", 500));
    }
  };
};

module.exports = can;