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
    }

}

module.exports = AuthControllers;