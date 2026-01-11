
const ApiResponse = require("../utils/ApiResponse");
const jwtServices = require("../utils/jwt");

const Authenticate = async(req,res,next)=>{
const authHeader = req.headers.authorization;

if(!authHeader) return res.status(402).json(ApiResponse.error("Token Missing"))

const token = authHeader.split(" ")[1];

const decoded = await jwtServices.decodeAccessToken(token)

req.user = decoded
next()
}

module.exports = Authenticate