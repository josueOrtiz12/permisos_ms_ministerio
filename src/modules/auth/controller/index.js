const { INTERNAL_SERVER_ERROR, BAD_REQUEST, SUCCESS } = require('../../../common/constants')
const { getUserBy } = require('../../users/service')

async function login(req, res){
    try {
        const { body: { username, id, password } } = req
        const user = await getUserBy('id', id, ['id', 'username', 'password'])
        console.log(user)
        if(!user) throw { message: 'User not found', status: BAD_REQUEST }
        if(user?.username !== username) throw { message: 'Username not match', status: BAD_REQUEST } 

        res.status(SUCCESS).json({ code: 0, message: 'Login success' })
      
    } catch (e) {
        const { message, status } = e         
        res.status(status || INTERNAL_SERVER_ERROR).json({ code: 1, message: message })
    }
}

module.exports = {
    login
}