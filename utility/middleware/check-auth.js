const HttpError = require('../constant/http-error');
const jwt = require('jsonwebtoken');

module.exports = (req,res,next) => {
    let token;
    try{
        token = req.headers.authorization.split(' ')[1];
        if(!token){
            throw new Error('Authentication failed');
        }
        const decodedToken = jwt.verify(token,process.env.JWT_SECRET_KEY);
        req.userData = {userId:decodedToken.userId, role: decodedToken.role};
        next();
    }
    catch(err){
        return next(new HttpError('Authentication failed',401));
    }

};