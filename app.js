const express = require('express')
const app = express();
const cors = require('cors')
const cookieParser = require('cookie-parser')


app.use(
  cors({
    origin: process.env.FRONTEND_URL, 
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json())
app.use(cookieParser())

const AuthRoutes= require('./src/routers/AuthRouters');
const tenantRoutes = require('./src/routers/TenantRouters')
const BusineesRoutes = require("./src/routers/BusinessRouters")
const requestlogger = require('./src/middleware/Requestlogger');
const ErrorHandler = require('./src/middleware/ErrorHandler');

app.use(requestlogger)

app.use('/auth',AuthRoutes)
app.use('/tenant',tenantRoutes)
app.use('/business',BusineesRoutes)

app.use(ErrorHandler)

module.exports = app;