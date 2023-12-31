const express = require('express');
const router = express.Router();
const taskModel = require('../model/TaskModel');
const userModel = require('../model/UserModel');
const taskService = require('../task/task_controller');
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const logger = require('../logger/logger.js');

router.use(cookieParser());
router.use(async (req, res, next) => {
    const token = req.cookies.jwt;

  if (token) {
      try {
          const decodedValue = await jwt.verify(token, process.env.JWT_SECRET);

          res.locals.user = decodedValue
          logger.info('You are authenticated!')
          next()
      } catch (error) {
        logger.error('You are not authenticated!')
          res.redirect('/login')
      }
  } else {
      res.redirect('/login')
  }
})


router.get('/', async (req, res) => {
    const user_id = res.locals.user.id;
    
     const response = await taskService.getTasks(user_id);
  
    res.render('task', { 
      user: res.locals.user, 
      tasks: response.data.tasks
    });
  
   logger.info({ user: res.locals.user });
  logger.info(response);
  });

  router.get('/task/create', (req, res) => {
    res.render('taskcreate')
  } )



module.exports = router;


























