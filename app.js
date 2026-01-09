const express = require('express')
const app = express();

app.use(express.json())

const AuthRoutes= require('./src/routers/AuthRouters');
const requestlogger = require('./src/middleware/Requestlogger');
const ErrorHandler = require('./src/middleware/ErrorHandler');

app.use(requestlogger)

app.use('/auth',AuthRoutes)

app.use(ErrorHandler)

module.exports = app;