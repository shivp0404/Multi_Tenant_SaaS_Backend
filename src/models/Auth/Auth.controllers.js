const ApiResponse = require('../../utils/ApiResponse');
const AuthServices = require('./Auth.services')

const AuthControllers ={
    register:async(req,res)=>{
        try{
        const payloads = req.body;
        const result = await AuthServices.register(payloads);
        console.log (result)
        return res.status(201).json({success:true,message:result.message})
        }
        catch(e){
            res.status(500).json({success:false,Error:e.message})
            console.log(e.message)
        }
    },
    login:async(req,res)=>{
        const payloads = req.body;
        const result = await AuthServices.login(payloads);
        
        res.cookie("RefreshToken",result.RefreshToken,{
            httpOnly:true,
            secure:false,
            sameSite:"Lax",
            // Expires:"30m"
        })
        return res.status(200).json(ApiResponse.success("Login Successfull",{name:result.name,accesstoken:result.AccessToken}))
    }

}

module.exports = AuthControllers;