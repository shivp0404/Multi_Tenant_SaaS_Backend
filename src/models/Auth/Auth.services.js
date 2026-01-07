const AuthRepositories = require('./Auth.repositories')
const bcryptSevices = require('../../utils/bcrypt')

const AuthServices = {
    register:async(payloads)=>{
        const data = payloads
        if(!data.email) throw new Error("Email is not defined");
        if(!data.name) throw new Error("Name is not defined");
        if(!data.password) throw new Error("Password is not defined");
        
        const existed =  await AuthRepositories.findbyemail(data.email)
        
        if(existed) throw new Error("Email is already existed");

        const hashedpassword = await bcryptSevices.hashPassword(data.password)
        if(!hashedpassword) throw new Error ("Password is not hashed")
        
        const user = await AuthRepositories.createuser(data.name,data.email,hashedpassword)
        if(!user) throw new Error("user is not created")

        return{
            message:"User Registered successfully",
            }
    },
}

module.exports = AuthServices