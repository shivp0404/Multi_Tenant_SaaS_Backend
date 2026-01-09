const ApiResponse = require('../utils/ApiResponse')
const logger = require('../utils/pino')
const ErrorHandler = (err,req,res,next)=>{
    if(err.isOperational){
        logger.error({
            requestId:req.requestId,
            method:req.method,
            url:req.originalUrl,
            statusCode:err.statusCode ||500,
            message:err.message,
        },"OperationalError")
        res.status(err.statusCode).json(ApiResponse.error(err.message,err.statusCode))
    }

    
    res.status(500).json(ApiResponse.error(err.message,500))
}

module.exports = ErrorHandler;