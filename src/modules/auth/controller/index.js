const { getUserBy } = require('../../users/service')
const { getRolesByUserId } = require('../../roles_by_users/service')
const { generateToken } = require('../../../utils/jwt')
const { hashString } = require('../../../utils/crypto')
const { INTERNAL_SERVER_ERROR, BAD_REQUEST, SUCCESS } = require('../../../common/constants')


async function login(req, res){
    try {
        const { body: { username, id, password } } = req
        const user = await getUserBy('id', id, ['id', 'username', 'password'])

        if(!user) throw { message: 'User not found', status: BAD_REQUEST }
        if(user?.username !== username) throw { message: 'Username not match', status: BAD_REQUEST } 
        if(hashString(password) !== user?.password) throw { message: 'Password not match', status: BAD_REQUEST }

        const rolesByUser = await getRolesByUserId(1, 10, id)
        const token = generateToken(JSON.stringify(rolesByUser))

        res.status(SUCCESS).json({ code: 0, data: { token: token }, message: 'Login success' })      
    } catch (e) {
        const { message, status } = e         
        res.status(status || INTERNAL_SERVER_ERROR).json({ code: 1, message: message })
    }
}

module.exports = {
    login
}