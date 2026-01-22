const BusineesService = require("./Business.service")
const ApiResponse = require("../../utils/ApiResponse")
const BusinessControllers ={
    createTask: async(req,res)=>{
        const data = req.body;
        const tenantId = req.params.id;
        const userId = req.user.id
        const response = await BusineesService.createTask(tenantId,userId,data);
        res.status(201).json(ApiResponse.success("Task created",response))
    },
    fetchTask:async(req,res)=>{
        const tenantId = req.params.id
        const userid = req.user.id
        const response = await BusineesService.fetchTask(userid,tenantId)
        res.status(200).json(ApiResponse.success("All Task",response))
    },
    deleteTask:async(req,res)=>{
        
        const taskid = req.params.id2
        const tenantid = req.params.id1
        const response = await BusineesService.deleteTask(taskid,tenantid)
        res.status(200).json(ApiResponse.success("Task Deleted",response))
    }
}
module.exports = BusinessControllers