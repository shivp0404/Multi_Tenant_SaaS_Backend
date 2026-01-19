const BusineesService = require("./Business.service")
const ApiResponse = require("../../utils/ApiResponse")
const BusinessControllers ={
    createTask: async(req,res)=>{
        const data = req.body;
        const tenantId = req.params.id;
        const userId = req.user.id
        const response = await BusineesService.createTask(tenantId,userId,data);
        res.status(201).json(ApiResponse.success("Task created",response))
    }
}
module.exports = BusinessControllers