const { INTERNAL_SERVER_ERROR, SUCCESS, BAD_REQUEST } = require('../../../common/constants')
const { addNewRoleToUserSchema, editRoleToUserSchema } = require('../schema')
const { getRolesByUserId, addNewRoleToUser, editRoleByUserId } = require('../service')
const { getRoleBy } = require('../../roles/service')
const { getUserBy } = require('../../users/service')

async function getRolesByUser(req, res) {
    try {
        const { query: { pageNumber, pageSize }, params: { userId } } = req
        res.status(SUCCESS).json({code: 0, data: await getRolesByUserId(pageNumber, pageSize, userId)})
    } catch (e) {
        const { message, status } = e
        res.status(status || INTERNAL_SERVER_ERROR).json({ code: 1, message: message })
    }
}

async function addRoleToUser(req, res) {
    try {
        const { body } = req
        const { error } = addNewRoleToUserSchema.validate(body, { abortEarly: false })
        
        if(error) {
            const e = new Error(error.details.map(({ message }) => message).join(', '))
            e.status = BAD_REQUEST
            throw e
        }

        const { userId, roleId } = body

        if(!await getRoleBy('id', roleId) ) {
            const error = new Error('Role not found')
            error.status = BAD_REQUEST
            throw error
        }

        if(!await getUserBy('id', userId)) {
            const error = new Error('User not found')
            error.status = BAD_REQUEST
            throw error
        }

        await addNewRoleToUser(userId, roleId)

        res.status(SUCCESS).json({code: 0, message: 'You have assigned a role to a user' })
    } catch (e) {
        const { message, status } = e
        res.status(status || INTERNAL_SERVER_ERROR).json({ code: 1, message: message })
    }
}

async function editRoleToUser(req, res) {
    try {
        const { params: { userId }, body: { roleId } } = req

        const { error } = editRoleToUserSchema.validate({ userId: userId, roleId: roleId }, { abortEarly: false })
    
        if(error) {
            const e = new Error(error.details.map(({ message }) => message).join(', '))
            e.status = BAD_REQUEST
            throw e
        }

        if(!await getRoleBy('id', roleId) ) {
            const error = new Error('Role not found')
            error.status = BAD_REQUEST
            throw error
        }

        if(!await getUserBy('id', userId)) {
            const error = new Error('User not found')
            error.status = BAD_REQUEST
            throw error
        }

        const rolesByUser = await getRolesByUserId(1, 10, userId)

        if(!rolesByUser.length) {
            const error = new Error('User has no roles')
            error.status = BAD_REQUEST
            throw error
        }
        
        const [ record ] = rolesByUser
        const { dataValues: { role: { dataValues: { id } } } } = record

        if(parseInt(id) === parseInt(roleId)) {
            const error = new Error('User already has this role')
            error.status = BAD_REQUEST
            throw error
        }

        const [ rowsAffected ] = await editRoleByUserId(userId, roleId)

        res.status(SUCCESS).send({code: 0, data: { rowsAffected: rowsAffected } ,message: 'You have assigned a role to a user'})
    } catch (e) {
        const { message, status } = e
        res.status(status || INTERNAL_SERVER_ERROR).json({ code: 1, message: message })
    }
}

module.exports = {
    getRolesByUser,
    addRoleToUser,
    editRoleToUser
}