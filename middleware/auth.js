const config=require('../config/config')
const jwt = require("jsonwebtoken");
const {ErrorHandler,statusHandler } = require('../middleware/errorHandling')
const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, config, (err, user) => {
            if (err) {
                //next(err)
                throw new ErrorHandler(403, 'In valid Token')
             
            }

            req.user = user;
           // console.log(user)
            next();
        });
    } else {
        throw new ErrorHandler(401, 'Unauthorized User')
        
    }
};
module.exports=authenticateJWT;
