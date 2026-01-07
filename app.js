const express = require('express')
const app = express();

app.use(express.json())

const AuthRoutes= require('./src/routers/AuthRouters')

app.use('/auth',AuthRoutes)

module.exports = app;