const AuthRepositories = require('./Auth.repositories')
const bcryptServices = require('../../utils/bcrypt')
const AppError = require('../../utils/AppError')
const jwtServices = require('../../utils/jwt')

const AuthServices = {
    register:async(payloads)=>{
        const data = payloads
        if(!data.email) throw new Error("Email is not defined");
        if(!data.name) throw new Error("Name is not defined");
        if(!data.password) throw new Error("Password is not defined");
        
        const existed =  await AuthRepositories.findbyemail(data.email)
        
        if(existed) throw new Error("Email is already existed");

        const hashedpassword = await bcryptServices.hashPassword(data.password)
        if(!hashedpassword) throw new Error ("Password is not hashed")
        
        const user = await AuthRepositories.createuser(data.name,data.email,hashedpassword)
        if(!user) throw new Error("user is not created")

        return{
            message:"User Registered successfully",
            }
    },

    login:async(payloads)=>{
        if(!payloads.email) throw new AppError("email is required",400)
        if(!payloads.password) throw new AppError("password is required",400)

        const user = await AuthRepositories.findbyemail(payloads.email);
        if(!user)throw new AppError("User not found",404)
    
        
        const is_verified = await bcryptServices.comparePassword(payloads.password,user.password)
        if(!is_verified) throw new AppError("Password not matched",403)
        
        const data =  {id:user.id,role:user.role,name:user.name}
        const AccessToken = await jwtServices.generateAccessToken(data);
        if(!AccessToken) throw new AppError("Access token is not generated",400)
               
        const RefreshToken = await jwtServices.generateRefreshToken(data);
        if(!RefreshToken) throw new AppError('Refresh token is not generated',400)

        const hashRefreshToken = await bcryptServices.hashRefreshToken(RefreshToken)
        const savetoken = await AuthRepositories.saveRefreshToken(hashRefreshToken,user.id)
        if(savetoken === 0) throw new AppError("Token is not saved")
        
        return{
            name:user.name,
            AccessToken:AccessToken,
            RefreshToken:RefreshToken
        }
        
    }
}

module.exports = AuthServices