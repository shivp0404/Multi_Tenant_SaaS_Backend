const AppError = require("../../utils/AppError");
const jwtServices = require("../../utils/jwt");
const tenantRepositories = require("./tenantRepositories");
const pool = require("../../../config/db");

const tenantService = {
  tenantRegister: async (userId, tenantName) => {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      if (!userId) throw new AppError("User id missing", 400);
      if (!tenantName || !tenantName.trim()) {
        throw new AppError("Tenant name is required", 400);
      }

      const tenantId = await tenantRepositories.createTenant(
        client,
        tenantName.trim(),
        userId
      );

      if (!tenantId) throw new AppError("Tenant not created", 500);

      const roles = ["Admin", "Manager", "Member"];
      const roleIds = {};

      for (const role of roles) {
        const roleId = await tenantRepositories.assignRole(
          client,
          tenantId,
          role
        );
        if (!roleId) throw new AppError(`Role ${role} failed`, 500);
        roleIds[role] = roleId;
      }

      const membership = await tenantRepositories.membership(
        client,
        userId,
        tenantId,
        roleIds.Admin,
        "active"
      );

      if (!membership) throw new AppError("Membership creation failed", 500);

      await client.query("COMMIT");

      const accessToken = await jwtServices.generateAccessToken({
        userId,
        tenantId,
        role: "Admin",
      });

      return { accessToken };
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  },
};

module.exports = tenantService;
