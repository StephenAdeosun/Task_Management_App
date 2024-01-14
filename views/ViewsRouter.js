// viewrouter.js
const express = require("express");
const userServices = require("../users/users.services.js");
const cookieParser = require("cookie-parser");
const TaskModel = require("../model/TaskModel.js");
const taskService = require("../task/task_controller");
const taskRouter = require("../task/task_router");
const jwt = require("jsonwebtoken");
const app = require("../api.js");
require("dotenv").config();
const router = express.Router();
const logger = require("../logger/logger.js");
router.use(cookieParser());
router.use('/tasks', taskRouter)



router.get("/", (req, res) => {
  logger.info("Home page rendered");
  res.render("home");
});
router.get("/signup/", (req, res) => {
  logger.info("Signup page rendered");
  res.render("signup",  { user: req.user }); })  ;

router.get("/login/", (req, res) => {
  logger.info("Login page rendered"); 
  res.render("login");
 });

router.post("/signup/", async (req, res) => {
  try {
    const response = await userServices.Signup({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
    });
   logger.info(response);

    if (response.success) {
        logger.info("User created successfully");
        res.redirect("login");
    } else {
      logger.error("User not created");
      const message = response.message;
        res.render("signup", { message, user: req.user })   
    }
} catch (error) {
  logger.error(error);
  res.status(500).json({
    success: false,
    message: error.message,
  });
}
});


router.post("/login/", async (req, res) => {
  try{
  const response = await userServices.Login({
    email: req.body.email,
    password: req.body.password,
  }); 
  logger.info(response);  

  if (response.success ) {
    logger.info("User logged in successfully"); 
    res.cookie("jwt", response.data.token, {maxAge: 1000 * 60 * 60 * 24});
    res.redirect("/tasks");
  } else {
    logger.error("User not logged in");
    const message = response.message;
    res.render("login", { message, user: req.user })
  }
} catch (error) {
  logger.error(error);
  res.status(500).json({
    success: false,
    message: error.message,
  });
}
});


router.use(async (req, res, next) => {
      const token = req.cookies.jwt;

    if (token) {
      logger.info("You are authenticated!");
        try {
            const decodedValue = await jwt.verify(token, process.env.JWT_SECRET);

            res.locals.user = decodedValue
            next()
        } catch (error) {
            res.redirect('/views/login')
        }
    } else {
        res.redirect('/views/login')
    }
})

router.get('/logout/', (req, res) => {
   logger.info("You are logged out!");  
    res.clearCookie('jwt');
    res.redirect('/');
})


router.get('/task', async (req, res) => {
  const user_id = res.locals.user.id;

  const response = await taskService.getTasks(user_id);
  logger.info(response);
  res.render('task', { 
    user: res.locals.user, 
    tasks: response.data.tasks
  });

  console.log({ user: res.locals.user });
  console.log(response);
});



























router.get('/task/completed/', async (req, res) => {
  const user_id = res.locals.user.id;

  const response = await taskService.getCompletedTasks(user_id);

  res.render('task', { 
    user: res.locals.user, 
    tasks: response.data.tasks
  });

  console.log({ user: req.user });
  console.log(response);
})
router.get('/task/pending/', async (req, res) => {
  const user_id = res.locals.user.id;

  const response = await taskService.getPendingTasks(user_id);

  res.render('task', { 
    user: res.locals.user, 
    tasks: response.data.tasks
  });

  console.log({ user: req.user });
  console.log(response);
})
 
router.get('/task/create/', (req, res) => {
  res.render('taskcreate')
} )

router.post('/task/create/', async (req, res) => {
  console.log({ body : req.body })
  req.body.user_id = res.locals.user.id;
  console.log({ body : req.body.user_id })
  const response = await taskService.createTask(req.body);


  if (response.code === 200) {
      res.redirect('/task')
  } else {
      res.render('taskcreate', { error: response.message })
  }
})








module.exports = router;
