const express = require('express')
const inventoryRouter = require('./router/inventory_route.js');
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
app.use('/views', viewRouter);

// inventory
app.use('/items', inventoryRouter);

// user creation
app.use('/', usersRouter);
app.use('/', taskRouter)




app.post('/students', async (req, res) => {
const body = req.body
const student = await UserModel.create(body)
res.status(201).json(student)

})

app.get('/students', async (req, res) => {
    const students = await UserModel.find()
    res.status(200).json(students)
})
// 404


// app.get('/', (req, res) => {
//     return res.status(200).json({ message: 'success', status: true })
// })



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