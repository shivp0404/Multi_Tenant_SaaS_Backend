const BusinessRepository = require("./Business.repositories")
const AppError = require("../../utils/AppError")
const AuthRepository = require("../Auth/Auth.repositories");


const BusinessService = {
createTask: async (tenantId, userId, data) => {
  if (!data) {
    throw new AppError("Data not found", 400);
  }

  const { email, title, description, status, priority } = data;

  if (!email) {
    throw new AppError("Assigned user email required", 400);
  }

  
  const assignedUser = await AuthRepository.findbyemail(email)
  if (!assignedUser) {
    throw new AppError("Assigned user not found", 404);
  }

  
  const isUserInTenant = await BusinessRepository.validateAssignUser(
    tenantId,
    assignedUser.id
  );

  if (!isUserInTenant) {
    throw new AppError("User is not registered in tenant", 403);
  }

  
  const task = await BusinessRepository.createTask(
    tenantId,
    title,
    description,
    status,
    priority,
    assignedUser.id,
    userId
  );

  if (!task) {
    throw new AppError("Task was not created", 500);
  }

  return task;
},
fetchTask: async(userid,tenantid)=>{
  if(!userid) throw new AppError("User id not found",400)
  if(!tenantid) throw new AppError("tenant id not found",400)
  const task = await BusinessRepository.fetchTask(userid,tenantid)
 return task
},
deleteTask:async(taskid,tenantid)=>{
  if(!taskid) throw new AppError("task id not found",400)
  if(!tenantid) throw new AppError("Tenant id not found",400)
  const task = await BusinessRepository.deleteTask(taskid,tenantid)

return task;
}


}
module.exports = BusinessService