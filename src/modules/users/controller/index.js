const { SUCCESS, BAD_REQUEST, NOT_FOUND, INTERNAL_SERVER_ERROR } = require('../../../common/constants')
const { createUserSchema, updateUserSchema, replaceUserAttributesSchema } = require('../schema')
const { getAllUsers, getUserBy, addNewUser, completeUpdateUser, editUserPartial } = require('../service') 
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

async function getUserById(req, res){
    try {
        const { params: { id } } = req

        const user = await getUserBy('id', id);

        if(!user) {
            const error = new Error('Id not found')
            error.status = NOT_FOUND
            throw error
        }

        res.status(SUCCESS).json({ code: 0, data: user })
        
    } catch (e) {
        const { message, status } = e         
        res.status(status).json({ code: 1, message: message })
    }
}
 
async function createUser(req, res) {
    try {
        const { error } = createUserSchema.validate(req.body, { abortEarly: false })
        if(error?.details.length > 0) {
            const e = new Error(error?.details.map(({ message }) => message).join(', '))
            e.status = BAD_REQUEST
            throw e
        }
        
        const { body: { username, password } } = req
        
        if(await getUserBy('username', username)) {
            const error = new Error('Username already exists')
            error.status = BAD_REQUEST
            throw error
        }

        await addNewUser(username, hashString(password))
        res.status(SUCCESS).json({ code: 0, message: 'User created successfully' })

    } catch (e) {
        const { message, status } = e         
        res.status(status || INTERNAL_SERVER_ERROR).json({ code: 1, message: message })
    }
}

async function updateUser(req, res) {
    try {
        const { error } = updateUserSchema.validate(req.body, { abortEarly: false })
        if(error?.details.length > 0) {
            const e = new Error(error?.details.map(({ message }) => message).join(', '))
            e.status = BAD_REQUEST
            throw e
        }

        const { params: { id }, body: { username, password } } = req

        if(req?.body?.name && await getUserBy('username', username)) {
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
        res.status(status || INTERNAL_SERVER_ERROR).json({ code: 1, message: message })
    }
}

async function replaceUserAttributes(req, res) {
    try {
        const { error } = replaceUserAttributesSchema.validate(req.body, { abortEarly: false })
        if(error?.details.length > 0) {
            const e = new Error(error?.details.map(({ message }) => message).join(', '))
            e.status = BAD_REQUEST
            throw e
        }
        const { params: { id }, body } = req
        const [ rowsAffected ] = await editUserPartial(id, body)
        
        if(!rowsAffected) {
            const error = new Error('Id not found')
            error.status = NOT_FOUND
            throw error
        }
        
        
        res.status(SUCCESS).json({ code: 0, data: { rowsAffected } ,message: 'User partially updated successfully' })
    } catch (e) {
        console.log(e);
        const { message, status } = e         
        res.status(status || INTERNAL_SERVER_ERROR).json({ code: 1, message: message })
    }
}

module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    replaceUserAttributes
}