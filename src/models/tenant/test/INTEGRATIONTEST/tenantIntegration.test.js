const request = require("supertest");
const app = require("../../../../../app");
const pool = require("../../../../../config/db");
const jwt = require("jsonwebtoken");
const random = () => Math.random().toString(36).substring(2, 5);
require("dotenv").config();

describe("Tenant creation Integration Test)", () => {
  let token;
  let userId;

  beforeEach(async () => {
    await pool.query("DELETE FROM user_tenants");
    await pool.query("DELETE FROM roles");
    await pool.query("DELETE FROM tenants");
    await pool.query("DELETE FROM users");

    const email = `test-${random()}@example.com`;
    const name = `test-${random()}`;

    const user = await pool.query(
      `INSERT INTO users (name,email,password) VALUES ($1,$2,$3) RETURNING id`,
      [name, email, "Hashed"],
    );

    userId = user.rows[0].id;
    token = jwt.sign({ id: userId }, process.env.ACCESS_TOKEN_SECRET);
  });

  test("creates tenant with roles and membership", async () => {
    const res = await request(app)
      .post("/tenant/create")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Acme Inc" })
      .expect(201);

    expect(res.body.data.AccessToken).toBeDefined();
    expect(res.body.data.tenantId).toBeDefined();

    const tenants = await pool.query(`SELECT * FROM tenants`);
    expect(tenants.rowCount).toBe(1);

    const roles = await pool.query(`SELECT * FROM roles`);
    expect(roles.rowCount).toBe(3);

    const members = await pool.query(`SELECT * FROM user_tenants`);
    expect(members.rowCount).toBe(1);
    expect(members.rows[0].status).toBe("active");
  });

  test("rolls back if role uniqueness constraint fails", async () => {
    const tenant = await pool.query(
      `
    INSERT INTO tenants (name, createdby)
    VALUES ($1, $2)
    RETURNING id
  `,
      ["Crash Corp", userId],
    );

    await pool.query(
      `
    INSERT INTO roles (tenant_id, name)
    VALUES ($1, $2)
  `,
      [tenant.rows[0].id, "Admin"],
    );

    const res = await request(app)
      .post("/tenant/create")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Crash Corp" });

    expect(res.status).toBeGreaterThanOrEqual(500);

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
      .expect(500);

    expect(res.body.message).toMatch(/unique/i);
  });
});

describe("Integration test for fetching all tenants", () => {
  let userId;
  let token;
  beforeEach(async () => {
    await pool.query("DELETE FROM user_tenants");
    await pool.query("DELETE FROM roles");
    await pool.query("DELETE FROM tenants");
    await pool.query("DELETE FROM users");

    const email = `test-${random()}@example.com`;
    const name = `test-${random()}`;

    const user = await pool.query(
      `INSERT INTO users (name,email,password) VALUES ($1,$2,$3) RETURNING id`,
      [name, email, "Hashed"],
    );

    userId = user.rows[0].id;
    token = jwt.sign({ id: userId }, process.env.ACCESS_TOKEN_SECRET);
  });

  test("Successfully fetch all the tenants", async () => {
    await request(app)
      .post("/tenant/create")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "UniqueCo" });

    const res = await request(app)
      .get("/tenant/me")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
    expect(res.body.message).toBe("Get my Tenants");
    expect(res.body.data).toBeDefined();
    expect(res.body.data.length).toBe(1);
  });
  test("Test when no tenant are present", async () => {
    const res = await request(app)
      .get("/tenant/me")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
    expect(res.body.message).toBe("Get my Tenants");
    expect(res.body.data).toBeDefined();
    expect(res.body.data.length).toBe(0);
  });
});



describe("Integration test for fetching all Invitations", () => {
  let userId;
  let token;
  beforeEach(async () => {
    await pool.query("DELETE FROM user_tenants");
    await pool.query("DELETE FROM roles");
    await pool.query("DELETE FROM tenants");
    await pool.query("DELETE FROM users");

    const email = `test-${random()}@example.com`;
    const name = `test-${random()}`;

    const user = await pool.query(
      `INSERT INTO users (name,email,password) VALUES ($1,$2,$3) RETURNING id`,
      [name, email, "Hashed"],
    );

    userId = user.rows[0].id;
    token = jwt.sign({ id: userId }, process.env.ACCESS_TOKEN_SECRET);
  });
  afterAll(async () => {
    await pool.end();
  });

  test("Test when no tenant are present", async () => {
    const res = await request(app)
      .get("/tenant/invitations")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
    expect(res.body.message).toBe("All Invitation");
    expect(res.body.data).toBeDefined();
    expect(res.body.data.length).toBe(0);
  });
});
