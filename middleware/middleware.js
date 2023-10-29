const jwt = require('jsonwebtoken')
const UserModel = require('../model/UserModel')
const logger = require('../logger/logger')


const BearerTokenAuth = async (req, res, next) => {
   try{
    const authHeader = req.headers.authorization;
    if(!authHeader){
        logger.error('You are not authenticated!')
        return res.status(401).json({ message: 'You are not authenticated!' });
    }
    const token = authHeader.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const user = await UserModel.findOne({ _id: decodedToken._id })

    if(!decodedToken){
        logger.error('You are not authenticated!')
        return res.status(401).json({ message: 'You are not authenticated!' });
    }
    req.user = user;
    logger.info('You are authenticated!')
    next();
} catch(error){
        logger.error('You are not authenticated!')
        return res.status(401).json({ message: 'You are not authenticated!' });
    }
}


module.exports = {BearerTokenAuth}