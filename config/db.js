const { Pool } = require("pg");

let pool = null;

function initPool(databaseUrl) {
  if (!databaseUrl) {
    throw new Error("Database_URL is missing");
  }

  if (pool) return pool;

  pool = new Pool({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false },
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });

  pool.on("connect", () => {
    console.log("Database connected");
  });

  pool.on("error", (err) => {
    console.error("Postgres error:", err);
  });

  return pool;
}

function getPool() {
  if (!pool) {
    throw new Error("Database pool not initialized");
  }
  return pool;
}

module.exports = { initPool, getPool };
