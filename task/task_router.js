const controller = require('./task_controller')
const express = require('express')
const router = express.Router()
// const { validateToken } = require('../auth/auth_middleware')




router.post('/create', controller.createTask)

module.exports = router