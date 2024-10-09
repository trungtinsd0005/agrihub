const User = require("../models/UserModel")
const bcrypt = require('bcrypt')
const { generateAccessToken, generateRefreshToken } = require("./JwtService")

const createUser = (newUser) => {
    return new Promise(async(resolve, reject) => {
        const {name, email, password, phone} = newUser
        try {
            const checkUser = await User.findOne({
                email: email
            })
            if(checkUser !== null) {
                resolve({
                    status: 'ERR',
                    message: 'The email is already in use'
                })
            }
            const hash = bcrypt.hashSync(password, 10)
            const createdUser = await User.create({
                email, 
                password: hash,
                phone,
                name
            })
            if(createdUser){
                resolve({
                    status: 'OK',
                    message: 'SUCCESS',
                    data: createdUser
                })

            }
        }catch(e) {
            reject(e);
        } 
    })
}

const createNewUser = (newUser) => {
    return new Promise(async(resolve, reject) => {
        const {name, email, password, phone} = newUser
        try {
            const checkUser = await User.findOne({
                email: email
            })
            if(checkUser !== null) {
                resolve({
                    status: 'ERR',
                    message: 'The email is already in use'
                })
            }
            const hash = bcrypt.hashSync(password, 10)
            const createdUser = await User.create({
                email, 
                password: hash,
                phone,
                name
            })
            if(createdUser){
                resolve({
                    status: 'OK',
                    message: 'SUCCESS',
                    data: createdUser
                })

            }
        }catch(e) {
            reject(e);
        } 
    })
}

const loginUser = (userCredentials) => {
    return new Promise(async(resolve, reject) => {
        const {email, password} = userCredentials
        try {
            const checkUser = await User.findOne({
                email: email
            })
            if(checkUser === null) {
                resolve({
                    status: 'ERR',
                    message: 'The user is not defined'
                })
            }

            const comparePassword = bcrypt.compareSync(password, checkUser.password)
            if(!comparePassword) {
                resolve({
                    status: 'ERR',
                    message: 'User information is incorrect'
                })
            }

            const access_token = generateAccessToken({
                id: checkUser._id,
                isAdmin: checkUser.isAdmin,
            })

            const refresh_token = generateRefreshToken({
                id: checkUser._id,
                isAdmin: checkUser.isAdmin,
            })

            resolve({
                status: 'OK',
                message: 'SUCCESS',
                _id: checkUser._id,
                name: checkUser.name,
                address: checkUser.address,
                access_token,
                refresh_token
            })

        }catch(e) {
            reject(e);
        } 
    })
}

const updateUser = (id, data) => {
    return new Promise(async(resolve, reject) => {
        try {
            const checkUser = await User.findOne({
                _id: id
            })

            if(checkUser === null) {
                resolve({
                    status: 'ERR',
                    message: 'The user is not defined'
                })
            }
            const updatedUser = await User.findByIdAndUpdate(id, data, {new: true})
            console.log('updateUser: ', updatedUser);

            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: updatedUser
            })

        }catch(e) {
            reject(e);
        } 
    })
}

const deleteUser = (id) => {
    return new Promise(async(resolve, reject) => {
        try {
            const checkUser = await User.findOne({
                _id: id
            })

            if(checkUser === null) {
                resolve({
                    status: 'ERR',
                    message: 'The user is not defined'
                })
            }
            await User.findByIdAndDelete(id)
            resolve({
                status: 'OK',
                message: 'Delete user success',
            })

        }catch(e) {
            reject(e);
        } 
    })
}

const getAllUser = () => {
    return new Promise(async(resolve, reject) => {
        try {
            const allUser = await User.find()
            resolve({
                status: 'OK',
                message: 'Get All User SUCCESS',
                data: allUser
            })

        }catch(e) {
            reject(e);
        } 
    })
}

const getDetailsUser = (id) => {
    return new Promise(async(resolve, reject) => {
        try {
            const user = await User.findOne({
                _id: id
            })

            if(user === null) {
                resolve({
                    status: 'ERR',
                    message: 'The user is not defined'
                })
            }
            resolve({
                status: 'OK',
                message: 'Get Detail User SUCCESS',
                data: user
            })

        }catch(e) {
            reject(e);
        } 
    })
}


module.exports = {
    createUser,
    loginUser,
    updateUser,
    deleteUser,
    getAllUser,
    getDetailsUser,
    createNewUser
}