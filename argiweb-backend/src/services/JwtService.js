const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config()

const generateAccessToken = (payload) => {
    const access_token = jwt.sign({payload}, process.env.ACCESS_TOKEN, {expiresIn: '30s'})
    return access_token
}

const generateRefreshToken = (payload) => {
    const refresh_token = jwt.sign({payload}, process.env.REFRESH_TOKEN, {expiresIn: '365d'})
    return refresh_token
}

const refreshTokenJwtService = async(token) => {
    return new Promise(async(resolve, reject) => {
        try {
            jwt.verify(token, process.env.REFRESH_TOKEN, (err, user) => {
                if(err){
                    resolve({
                        status: 'ERROR',
                        message: 'The authentication'
                    })
                }
                const {payload} = user
                const access_token = generateAccessToken({
                    id: payload?.id,
                    isAdmin: payload?.isAdmin
                })
                console.log('access-token', access_token);
                resolve({
                    status: 'OK',
                    message: 'SUCCESS',
                    access_token
                });
            });

        }catch(e) {
            reject(e);
        } 
    })
}

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    refreshTokenJwtService
}