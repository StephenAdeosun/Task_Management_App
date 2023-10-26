// viewrouter.js
const express = require("express");
const userServices = require("../users/users.services.js");
const cookieParser = require("cookie-parser");
const TaskModel = require("../model/TaskModel.js");
const taskService = require("../task/task_controller");
// const auth = require('../auth/auth_login')
const jwt = require("jsonwebtoken");
require("dotenv").config();
const router = express.Router();

router.use(cookieParser());

router.get("/", (req, res) => {
  res.render("home");
});
router.get("/signup", (req, res) => {
  const message = "";
  res.render("signup",  { user: req.user, message })  ;
});

router.get("/login", (req, res) => { 
  res.render("login");
 });

router.post("/signup", async (req, res) => {
  try {
    const response = await userServices.Signup({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
    });
    console.log(response);

    if (response.success) {
        res.redirect("login");
    } else {
      const message = response.message;
        res.render("signup", { message, user: req.user })   
    }
} catch (error) {
  res.status(500).json({
    success: false,
    message: error.message,
  });
}
});


router.post("/login", async (req, res) => {
  const response = await userServices.Login({
    email: req.body.email,
    password: req.body.password,
  }); 
  console.log(response);

  if (response.success ) {
    res.cookie("jwt", response.data.token, {maxAge: 1000 * 60 * 60 * 24});
    res.redirect("task");
  } else {
    res.render("login");
  }
});


router.use(async (req, res, next) => {
      const token = req.cookies.jwt;

    if (token) {
        try {
            const decodedValue = await jwt.verify(token, process.env.JWT_SECRET);

            res.locals.user = decodedValue
            next()
        } catch (error) {
            res.redirect('/login')
        }
    } else {
        res.redirect('/login')
    }
})

router.get('/logout', (req, res) => {
    // res.cookie('jwt', '', { maxAge: 1 });
    res.clearCookie('jwt');
    res.render('index');
})

router.get('/task', async (req, res) => {
  const user_id = res.locals.user.id;

  const response = await taskService.getTasks(user_id);

  res.render('task', { 
    user: res.locals.user, 
    tasks: response.data.tasks
  });

  console.log({ user: res.locals.user });
  console.log(response);
});




 
router.get('/task/create', (req, res) => {
  res.render('taskcreate')
} )

router.post('/task/create', async (req, res) => {
  console.log({ body : req.body })
  req.body.user_id = res.locals.user.id;
  console.log({ body : req.body.user_id })
  const response = await taskService.createTask(req.body);


  if (response.code === 200) {
      res.redirect('/views/task')
  } else {
      res.render('taskcreate', { error: response.message })
  }
})


// Inside your Express router





// Add an edit route for a specific task
router.get('/views/task/edit/<%= task._id %>', async (req, res) => {
  try {
    const taskId = req.params.taskId;

    // Fetch the task from the database by its _id (taskId)
    const task = await TaskModel.findById(taskId);

    if (!task) {
      // Handle the case where the task with the given _id doesn't exist
      return res.status(404).send('Task not found');
    }

    // Render the edit form with the task data
    res.render('taskedit', { task });
  } catch (error) {
    // Handle any errors that occur during the retrieval of the task
    console.error('Error fetching task for editing:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/views/task/edit/<%= task._id %>', async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const updatedTaskData = {
      title: req.body.title,
      description: req.body.description,
      state: req.body.state,
    };

    // Update the task with the new data
    await TaskModel.findByIdAndUpdate(taskId, updatedTaskData);

    // Redirect to the task list page after editing
    res.redirect('/views/task');
  } catch (error) {
    // Handle errors that may occur during the update process
    console.error('Error updating task:', error);
    res.status(500).send('Internal Server Error');
  }
});


// /

module.exports = router;
