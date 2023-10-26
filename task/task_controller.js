// task_controller.js
const TaskModel = require ('../model/TaskModel')




const createTask = async (task) => {

  const taskFromRequest = task;

  const newTask = new TaskModel();

  newTask.title = taskFromRequest.title;
  newTask.description = taskFromRequest.description;
  newTask.state = taskFromRequest.state;
  newTask.user_id = taskFromRequest.user_id;
  const savedTask = await newTask.save();

  return {
      code: 200,
      success: true,
      message: 'Task created successfully',
      data: {
          task: savedTask
      }
  }
}  


const getTasks = async (user_id) => {
  const tasks = await TaskModel.find({ user_id });

  return {
    code: 200,
    success: true,
    message: 'Tasks fetched successfully',
    data: {
      tasks
    }
  };
}




  module.exports = {   createTask, getTasks }