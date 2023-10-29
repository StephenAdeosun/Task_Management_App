const TaskModel = require('../model/TaskModel')
const logger = require('../logger/logger.js');



const createTask = async (task) => {

  const taskFromRequest = task;

  const newTask = new TaskModel();

  newTask.title = taskFromRequest.title;
  newTask.description = taskFromRequest.description;
  newTask.state = taskFromRequest.state;
  newTask.user_id = taskFromRequest.user_id;
  const savedTask = await newTask.save();

  if (!savedTask) {
    logger.error('Task not created')
    return {
      code: 500,
      success: false,
      message: 'Task not created'
    }
  }

  logger.info('Task created successfully')
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

  if (!tasks) {
    logger.error('Tasks not found')
    return {
      code: 404,
      success: false,
      message: 'Tasks not found'
    };
  }

  logger.info('Tasks fetched successfully')
  return {
    code: 200,
    success: true,
    message: 'Tasks fetched successfully',
    data: {
      tasks
    }
  };
}

const deleteTask = (req, res) => {
  const id = req.params.id
  TaskModel.findByIdAndRemove(id)
    .then(book => {
      if (!book) {
        logger.error('Task not found')
        return res.status(404).send({
          message: "Task not found with id " + id
        });
      }
      logger.info('Task deleted successfully')
      res.redirect("/task")
    }).catch(err => {
      logger.error('Task not deleted', err)
      res.status(500).send(err)
    })
}

// get tasks that state=completed
const getCompletedTasks = async (user_id) => {
  const tasks = await TaskModel.find({ user_id, state: 'completed' || 'Completed' });
  if (!tasks) {
    logger.error('Tasks not found')
    return {
      code: 404,
      success: false,
      message: 'Tasks not found'
    };
  }

  return {
    code: 200,
    success: true,
    message: 'Tasks fetched successfully',
    data: {
      tasks
    }
  };
}
// get tasks that state=pending
const getPendingTasks = async (user_id) => {
  const tasks = await TaskModel.find({ user_id, state: 'pending' || 'Pending' });
  if (!tasks) {
    logger.error('Tasks not found')
    return {
      code: 404,
      success: false,
      message: 'Tasks not found'
    };
  }

  logger.info('Tasks fetched successfully')
  return {
    code: 200,
    success: true,
    message: 'Tasks fetched successfully',
    data: {
      tasks
    }
  };
}


module.exports = {
  createTask, getTasks, deleteTask, getCompletedTasks,
  getPendingTasks
}