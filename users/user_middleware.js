const joi = require('joi')
const logger = require('../logger/logger')

const ValidateUserCreation = async (req, res, next) => {
    try {
        const schema = joi.object({
            name: joi.string().required().min(3).messages({
                'string.min': 'Name must be at least 3 characters long',
                'any.required': 'Name is required',
            }),
            password: joi.string().min(6).required().messages({
                'string.min': 'Password must be at least 6 characters long',
                'any.required': 'Password is required',
            }),
            email: joi.string().email().required().messages({
                'string.email': 'Invalid email format',
                'any.required': 'Email is required',
            }),
            contact: joi.string().required(),
            phone_number: joi.string().required(),
            gender: joi.string().valid('male', 'female'),
        })

        logger.info(req.body)
        await schema.validateAsync(req.body, { abortEarly: true })

        next()
    } catch (error) {
        logger.error(error)
        return res.status(422).json({
            message: error.message,
            success: false
        })
    }
}

const ValidateUserLogin = async (req, res, next) => {
    try {
        const schema = joi.object({
            password: joi.string().required(),
            email: joi.string().email().required(),
        })

        logger.info(req.body)
        await schema.validateAsync(req.body, { abortEarly: true })
        next()
    } catch (error) {
        logger.error(error)
        return res.status(422).json({
            message: error.message,
            success: false
        })
    }
}




module.exports = {
    ValidateUserCreation,
    ValidateUserLogin
}
