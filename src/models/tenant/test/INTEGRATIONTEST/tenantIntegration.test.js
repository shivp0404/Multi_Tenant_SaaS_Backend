const request = require("supertest");
const app = require("../../../../../app"); 
const pool = require("../../../../../config/db");
const jwt = require("jsonwebtoken");
const { v4: uuid } = require("uuid");
require("dotenv").config()

describe("Tenant creation (integration)", () => {
  let token;
  let userId;


beforeEach(async () => {
  const email = `test-${uuid()}@example.com`;
  const name = `test-${uuid()}`;

  const user = await pool.query(
    `INSERT INTO users ('name','email', 'password') VALUES ($1,$2 'hashed') RETURNING id`,
    [name,email]
  );

  userId = user.rows[0].id;
  token = jwt.sign({ id: userId }, process.env.JWT_SECRET);
});


  test("creates tenant with roles and membership", async () => {
    const res = await request(app)
      .post("/tenant/create")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Acme Inc" })
      .expect(201);

    expect(res.body.data.AccessToken).toBeDefined();
    expect(res.body.data.tenantId).toBeDefined()

    const tenants = await pool.query(`SELECT * FROM tenants`);
    expect(tenants.rowCount).toBe(1);

    const roles = await pool.query(`SELECT * FROM roles`);
    expect(roles.rowCount).toBe(3);

    const members = await pool.query(`SELECT * FROM user_tenants`);
    expect(members.rowCount).toBe(1);
    expect(members.rows[0].status).toBe("active");
  });

test("rolls back if role uniqueness constraint fails", async () => {
  // Pre-create Admin role so duplicate insert fails
  const tenant = await pool.query(`
    INSERT INTO tenants (name, createdby)
    VALUES ('Crash Corp', ${userId})
    RETURNING id
  `);

  await pool.query(`
    INSERT INTO roles (tenant_id, name)
    VALUES (${tenant.rows[0].id}, 'Admin')
  `);

  const res = await request(app)
    .post("/tenant/create")
    .set("Authorization", `Bearer ${token}`)
    .send({ name: "Crash Corp" });

  expect(res.status).toBeGreaterThanOrEqual(400);

  const memberships = await pool.query(`SELECT * FROM user_tenants`);
  expect(memberships.rowCount).toBe(0);
});


  test("rejects duplicate tenant names", async () => {
    await request(app)
      .post("/tenant/create")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "UniqueCo" })
      .expect(201);

    const res = await request(app)
      .post("/tenant/create")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "UniqueCo" })
      .expect(400);

    expect(res.body.message).toMatch(/unique/i);
  });
});
