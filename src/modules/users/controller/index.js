const { SUCCESS, BAD_REQUEST, NOT_FOUND } = require('../../../common/constants')
const { getAllUsers, getUserBy, addNewUser, completeUpdateUser } = require('../service') 
const { hashCompare, hashString } = require('../../../utils/crypto')

async function getUsers(req, res) {
    try {
        const { query: { pageNumber, pageSize } } = req
        const users = await getAllUsers(pageNumber, pageSize)
        return res.status(SUCCESS).json({ code: 0, data: users })
    } catch (e) {
        const { message, status } = e         
        res.status(status).json({ code: 1, message: message })
    }
}

async function createUser(req, res) {
    try {
        const { body: { id, username, password } } = req
        
        if(await getUserBy('id', id)) {
            const error = new Error('Id already exists')
            error.status = BAD_REQUEST
            throw error
        }

        if(await getUserBy('username', username)) {
            const error = new Error('Username already exists')
            error.status = BAD_REQUEST
            throw error
        }

        await addNewUser(id, username, hashString(password))
        res.status(SUCCESS).json({ code: 0, message: 'User created successfully' })

    } catch (e) {
        const { message, status } = e         
        res.status(status).json({ code: 1, message: message })
    }
}

async function updateUser(req, res) {
    try {
        const { params: { id }, body: { username, password } } = req

        if(await getUserBy('username', username)) {
            const error = new Error('Username already exists')
            error.status = BAD_REQUEST
            throw error
        }
        
        const [ rowsAffected ] = await completeUpdateUser(id, username, hashString(password))

        if(!rowsAffected) {
            const error = new Error('Id not found')
            error.status = NOT_FOUND
            throw error
        }

        res.status(SUCCESS).json({ code: 0, data: { rowsAffected: rowsAffected }, message: 'User updated successfully' })
    } catch (e) {
        const { message, status } = e         
        res.status(status).json({ code: 1, message: message })
    }
}


module.exports = {
    getUsers,
    createUser,
    updateUser
}