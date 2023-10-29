const express = require('express')
const usersRouter = require('./users/users_route.js');
const {connect} = require('./db/index')
const UserModel = require('./model/UserModel');
const viewRouter = require('./views/ViewsRouter.js');
const taskRouter = require('./task/task_router.js')
// create an express application
connect()
const app = express()

//port
const port = 8000;

// middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.set('view engine','ejs')
app.use('/', viewRouter);


// user creation
app.use('/', usersRouter);
app.use('/', taskRouter)



app.get('*', (req, res) => {
    return res.status(404).json({
        data: null,
        error: 'Route not found'
    })
})



app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`)
    }
)

module.exports = app;