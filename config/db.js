const {Pool} = require("pg");

require('dotenv').config()
const pool = new Pool({
connectionString:process.env.Database_URL,
max:10,
idleTimeoutMillis:30000,
connect_timeoutMillis:2000
})

pool.on("connect",()=>{
    console.log("Database Connected")
})

pool.on("error",()=>{
    console.log("Unable to Connect Database")
})

module.exports = pool
