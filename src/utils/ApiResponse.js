const ApiResponse = {
    success: (message="Ok",data={})=>{
        return{success:true,message:message,data:{data}}
    },

    error: (errormessage,errorStatusCode)=>{
        return{success:false,message:errormessage,statuscode:errorStatusCode}
    }
}

module.exports = ApiResponse;