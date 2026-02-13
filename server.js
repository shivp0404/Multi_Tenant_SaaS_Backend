const dotenv = require('dotenv')
dotenv.config();
const app = require('./app')
const { initPool } = require("./config/db");


const Port = process.env.PORT || 3000

const StartServer = async() => {
  try {
      const pool = initPool(process.env.Database_URL);

    // Explicit health check
    await pool.query("SELECT 1");
    console.log("DB ready");

    app.listen(Port, () => {
      console.log("Server running on port", Port);
    });
  } catch (err) {
    console.error("Startup failed:", err);
    process.exit(1);
  }
}

StartServer()
