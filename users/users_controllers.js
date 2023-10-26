const fs = require('fs')
const UserSchema = require('../model/UserModel')
const jwt = require('jsonwebtoken')
require('dotenv').config()


const CreateUser = async (req, res) => {
    try {
        const userFromReq = req.body

        const existingUser = await UserSchema.findOne({ email: userFromReq.email })
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'User already exists',
            })
        }



        const user = await UserSchema.create({
            name: userFromReq.name,
            email: userFromReq.email,
            contact: userFromReq.contact,
            password: userFromReq.password,
            phone_number: userFromReq.phone_number,
            gender: userFromReq.gender
        })

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' })

        if (user) {
            return res.status(201).json({
                success: true,
                message: 'User created successfully',
                data: { user, token }
            })
        }

    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}


const LoginUser = async (req, res) => {
    try{
    const userFromReq = req.body
    const user = await UserSchema.findOne({ email: userFromReq.email })
    if (!user){
        return res.status(404).json({
            success: false,
            message: 'User not found'
        })
    }
    const validPassword = await user.validatePassword(userFromReq.password)
    if (!validPassword){
        return res.status(400).json({
            success: false,
            message: 'Invalid password'
        })
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' })
    return res.status(200).json({
        success: true,
        message: 'User logged in successfully',
        data: { user, token }
    })
}
catch (error) {
    res.status(500).json({
        success: false,
        message: error.message,
    })
}
}


// const createUser = (req, res) => {
//     const userData = fs.readFileSync('./users/users.json')
//     const userDataJson = JSON.parse(userData)
//     const user = req.body

//     user.api_key = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
//     if (user.username === 'stephen') {
//         user.role = 'admin'
//     }
//     else {
//         user.role = 'user'
//     }

//     userDataJson.push(user)

//     fs.writeFileSync('./users/users.json', JSON.stringify(userDataJson, null, 4), (err) => {
//         if (err) {
//             res.status(500).send(err)
//         }
//     })
//     res.status(201).send(`User added with name: ${user.username}`)
// }




module.exports = {
    LoginUser,
    CreateUser
}