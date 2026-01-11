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
    },
    logout:async(req,res)=>{
        const refreshToken = req.cookies.RefreshToken;
        const result = await AuthServices.logout(refreshToken)
        res.clearCookie("RefreshToken",{
            httpOnly:true,
            secure:false,
            sameSite:"Lax",
        })

        res.status(200).json(ApiResponse.success(result.message));
    },
    refresh:async(req,res)=>{
        const refreshToken = req.cookies.RefreshToken;
        const result = await AuthServices.refresh(refreshToken);
        
        res.cookie("RefreshToken",result.RefreshToken,{
            httpOnly:true,
            secure:false,
            sameSite:"Lax",
            // Expires:"30m"
        })
        return res.status(200).json(ApiResponse.success("Refresh Successfull",{accesstoken:result.accessToken}))

    }

}

module.exports = AuthControllers;