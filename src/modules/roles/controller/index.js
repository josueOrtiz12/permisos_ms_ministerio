const { INTERNAL_SERVER_ERROR, SUCCESS, BAD_REQUEST } = require('../../../common/constants')
const { createRoleSchema, getRoleSchema, updateRoleSchema, updaterRolePartiallySchema } = require('../schema')
const { getAllRoles, getRoleBy,addNewRole, completeUpdateRole, partialUpdateRole } = require('../service')

async function getRoles(req, res) {
    try {
        const { query: { pageNumber, pageSize } } = req
        const roles = await getAllRoles(pageNumber, pageSize)
        return res.status(SUCCESS).json({ code: 0, data: roles })
    } catch (e) {
        const { message, status } = e
        res.status(status || INTERNAL_SERVER_ERROR).json({ code: 1, message: message })
    }
}

async function getRole(req, res) {
    try {
        const { error } = getRoleSchema.validate(req.params, { abortEarly: false })
        if(error?.details.length > 0) {
            const e = new Error(error?.details.map(({ message }) => message).join(', '))
            e.status = BAD_REQUEST
            throw e
        }

        const { params: { id } } = req
        const role = await getRoleBy('id', id)
        
        if(!role) {
            const error = new Error('Role not found')
            error.status = BAD_REQUEST
            throw error
        }

        return res.status(SUCCESS).json({ code: 0, data: role })
    } catch (e) {
        const { message, status } = e
        res.status(status || INTERNAL_SERVER_ERROR).json({ code: 1, message: message })
    }
}

async function createRole(req, res) {
    try {
        const { error } = createRoleSchema.validate(req.body, { abortEarly: false })
        
        if(error?.details.length > 0) {
            const e = new Error(error?.details.map(({ message }) => message).join(', '))
            e.status = BAD_REQUEST
            throw e
        }

        const { body } = req

        if(await getRoleBy('name', body['name'])) {
            const error = new Error('Role name already exists')
            error.status = BAD_REQUEST
            throw error
        }

        await addNewRole(body)
        res.status(SUCCESS).json({ code: 0, message: 'Role created successfully'}) 
    } catch (e) {
        const { message, status } = e
        res.status(status || INTERNAL_SERVER_ERROR).json({ code: 1, message: message })
    }
}

async function updateRole(req, res) {
    try {
        const { body } = req
        req.body.id = req.params.id
        const { error } = updateRoleSchema.validate(body, { abortEarly: false })
        
        if(error?.details.length > 0) {
            const e = new Error(error?.details.map(({ message }) => message).join(', '))
            e.status = BAD_REQUEST
            throw e
        }

        if(await getRoleBy('name', body['name'])) {
            const error = new Error(`Can't update role name to an existing role name`)
            error.status = BAD_REQUEST
            throw error
        }

        const { id, name, description } = body

        const [ rowsAffected ] = await completeUpdateRole(id, name, description)

        if(!rowsAffected) {
            const error = new Error(`Role with id ${id} not found`)
            error.status = BAD_REQUEST
            throw error
        }

        res.status(SUCCESS).json({ code: 0, data: { rowsAffected: rowsAffected } ,message: 'Role updated successfully'})

    } catch (e) {
        const { message, status } = e
        res.status(status || INTERNAL_SERVER_ERROR).json({ code: 1, message: message })
    }
}

async function updateRolePartially(req, res){
    try {
        req.body.id = req.params.id
        const { error } = updaterRolePartiallySchema.validate(req.body, { abortEarly: false })
        delete req.body.id

        if(error?.details.length > 0) {
            const e = new Error(error?.details.map(({ message }) => message).join(', '))
            e.status = BAD_REQUEST
            throw e
        }

        if(!Object.keys(req.body).length) {
            const error = new Error('No fields to update role')
            error.status = BAD_REQUEST
            throw error
        }

        if(req?.body?.name && !await getRoleBy('name', req?.body?.name)) {
            const error = new Error(`Can't update role name to an existing role name`)
            error.status = BAD_REQUEST
            throw error
        }

        const { body, params: { id } } = req        
        const [ rowsAffected ] = await partialUpdateRole(id, body)

        if(!rowsAffected) {
            const error = new Error(`Role with id ${id} not found`)
            error.status = BAD_REQUEST
            throw error
        }

        res.status(SUCCESS).json({ code: 0, data: { rowsAffected: rowsAffected }, message: 'Role updated successfully'})
    } catch (e) {
        const { message, status } = e
        res.status(status || INTERNAL_SERVER_ERROR).json({ code: 1, message: message })
    }
}

module.exports = {
    getRoles,
    getRole,
    createRole,
    updateRole,
    updateRolePartially
}