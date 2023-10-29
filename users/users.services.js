const UserSchema = require('../model/UserModel')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const logger = require('../logger/logger')

const Login = async ({email, password}) => {
        const userFromReq = {email, password}
        const user = await UserSchema.findOne({ email: userFromReq.email })
        if (!user){
            logger.error('User not found')
            return {
                message: 'User not found',
                success: false
            }
        }
        const validPassword = await user.validatePassword(userFromReq.password)
        if (!validPassword){
            logger.error('Invalid password or email')
            return{
                message: 'Invalid password or email',
                success: false
            }
        }
    
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1hr' })
        logger.info('User logged in successfully')
        return {
            message: 'User logged in successfully',
            success: true,
            data: { user, token }
        }
    }
  

const Signup = async({name,email,password,}) => {

    const userFromReq = {name,email,password,}

        const existingUser = await UserSchema.findOne({ email: userFromReq.email })
        if (existingUser) {
            logger.error('User already exists')
            return {
                message: 'User already exists',
                success: false,
            }
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
                    logger.info('User created successfully')
                    return {
                        message: 'User Created successfully',
                        success: true,
                        data: { user, token }
                    }
                }
            

        };



module.exports = {
    Login,
    Signup
}
