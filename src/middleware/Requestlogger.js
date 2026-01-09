
const logger = require('../utils/pino')

const {randomUUID} = require("crypto")

const requestlogger = (req,res,next)=>{
 const startTime = Date.now();
 req.requestId = randomUUID();
 res.on("finish",()=>{
    const duration = Date.now() - startTime

    logger.info({
        requestId:req.requestId,
        timestamp:new Date().toISOString(),
        method:req.method,
        url:req.originalUrl,
        statusCode:res.statusCode,
        durationMs:duration,
        ip:req.ip,
        userAgent:req.headers["user-agent"]||null,
        userId:req.user ? req.user.id:null
    },"HTTP REQUEST")
 })
 next()
}

module.exports = requestlogger