const { Op } = require('sequelize')
const { SUCCESS, BAD_REQUEST, NOT_FOUND, INTERNAL_SERVER_ERROR } = require('../../../common/constants')
const { createUserSchema, updateUserSchema, replaceUserAttributesSchema, schemaRestore } = require('../schema')
const { getAllUsers, getUserBy, addNewUser, completeUpdateUser, editUserPartial, restorePassword } = require('../service') 
const { hashCompare, hashString } = require('../../../utils/crypto')

async function getUsers(req, res) {
    try {
        const { query: { pageNumber, pageSize, username, role } } = req
        const filters = {}
        if(username) {
            filters['username'] = `%${username}%`
        }

        if(role) {
            filters['role'] = `%${role}%`
        }
        
        const users = await getAllUsers(pageNumber, pageSize, ['id', 'createdAt', 'updatedAt'], filters)
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

        if(await getUserBy('username', username)?.username !== username) {
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

        const errors = Object.keys(body).map((key) => {
            if(getUserBy(key, body[key])) return `This property can't be updated: ${key}`
        }, [])

        if(errors.length > 0) {
            const error = new Error(errors.join(', '))
            error.status = BAD_REQUEST
            throw error
        }

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

async function resetPassword(req , res ){
    try {
        const { params: { id }} = req

        const { error } = schemaRestore.validate( {id:id} , { abortEarly: false })
        if(error?.details.length > 0) {
            const e = new Error(error?.details.map(({ message }) => message).join(', '))
            e.status = BAD_REQUEST
            throw e
        }

        const user  = await getUserBy('id' , id)
        console.log(user)

        if(!user){
            return res.status(404).json({message : 'Usuario no encontrado'})
        }

        const [rowsAffected]  = await restorePassword(id, hashString(id));
        if(!rowsAffected) {
            const error = new Error('Id not found')
            error.status = NOT_FOUND
            throw error
        }
        
        res.status(SUCCESS).json({ code: 0, data: { rowsAffected } ,message: 'the usser hash change the password' })

        

    } catch (e) {
        const { message , status} = e
        res.status(status || INTERNAL_SERVER_ERROR).json({ code: 1, message: message })
    }
}


module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    replaceUserAttributes,
    resetPassword
}