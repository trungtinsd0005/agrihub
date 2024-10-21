const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()

const authMiddleWare = (req, res, next) => {
    const token = req.headers.token.split(' ')[1]
    jwt.verify(token, process.env.ACCESS_TOKEN, function(err, user) {
        if(err){
            return res.status(404).json({
                status: 'ERROR',
                message: 'The authencication'
            })
        }
        const {payload} = user
        if(payload?.isAdmin) {
            next()
        }else {
            return res.status(404).json({
                status: 'ERROR',
                message: 'The authencication'
            })
        }
    });
}

const authUserMiddleWare = (req, res, next) => {
    const token = req.headers.token.split(' ')[1]
    const userId = req.params.id
    jwt.verify(token, process.env.ACCESS_TOKEN, function(err, user) {
        if(err){
            return res.status(404).json({
                status: 'ERROR',
                message: 'The authencication'
            })
        }
        const {payload} = user
        if(payload?.isAdmin || payload?.id === userId) {
            next()
        }else {
            return res.status(404).json({
                status: 'ERROR',
                message: 'The authencication'
            })
        }
    });
}

const protect = (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN); 

        req.user = decoded.payload; 
        console.log('User in protect middleware:', req.user);

        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({ message: 'Token is not valid' });
    }
};

module.exports = {
    authMiddleWare,
    authUserMiddleWare,
    protect
}