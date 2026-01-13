const express = require('express')
const app = express();
const cookieParser = require('cookie-parser')
app.use(express.json())
app.use(cookieParser())

const AuthRoutes= require('./src/routers/AuthRouters');
const tenantRoutes = require('./src/routers/TenantRouters')
const requestlogger = require('./src/middleware/Requestlogger');
const ErrorHandler = require('./src/middleware/ErrorHandler');

app.use(requestlogger)

app.use('/auth',AuthRoutes)
app.use('/tenant',tenantRoutes)

app.use(ErrorHandler)

module.exports = app;