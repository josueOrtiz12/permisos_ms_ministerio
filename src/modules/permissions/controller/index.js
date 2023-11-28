const { addPermissionsSchema, editPermissionsSchema } = require('../schema')
const { getPermissionsByRoleId, addPermissionsToRole, editPermissionsToRole } = require('../service')
const { getRoleBy } = require('../../roles/service')
const { getResourceBy } = require('../../resources/service')
const { INTERNAL_SERVER_ERROR, SUCCESS, BAD_REQUEST } = require('../../../common/constants')

async function getPermissionsByRole(req, res) {
    try {
        const { query: { pageNumber, pageSize }, params: { roleId } } = req
        res.status(SUCCESS).json({code: 0, data: await getPermissionsByRoleId(pageNumber, pageSize, roleId)})
    } catch (e) {
        const { message, status } = e
        res.status(status || INTERNAL_SERVER_ERROR).json({ code: 1, message: message })
    }
}

async function addPermissions(req, res) {
    try {
        const { body } = req
        const { error } = addPermissionsSchema.validate(req.body, { abortEarly: false })
        
        if (error) {
            const { details } = error
            const message = details.map(i => i.message).join(',')
            throw { message, status: BAD_REQUEST }
        }

        const { roleId, resourceId } = body

        if(!await getResourceBy('id', resourceId)) {
            throw { message: 'Resource not found', status: BAD_REQUEST }
        }

        if(!await getRoleBy('id', roleId)) {
            throw { message: 'Role not found', status: BAD_REQUEST }
        }
        
        await addPermissionsToRole(roleId, resourceId)
        res.status(SUCCESS).json({code: 0, message: 'Permission added successfully'})
    } catch (e) {
        const { message, status } = e
        res.status(status || INTERNAL_SERVER_ERROR).json({ code: 1, message: message })
    }
}

async function editPermissions(req, res) {
    try {
        const { body, params } = req
        body.roleId = params?.roleId
        
        const { error } = editPermissionsSchema.validate(body, { abortEarly: false })
        if (error) {
            const { details } = error
            const message = details.map(i => i.message).join(',')
            throw { message, status: BAD_REQUEST }
        }
        delete body.roleId

        const { resourceId } = body
        const { roleId } = params

        if(!await getRoleBy('id', roleId)) {
            throw { message: 'Role not found', status: BAD_REQUEST }
        }

        if(!await getResourceBy('id', resourceId)) {
            throw { message: 'Resource not found', status: BAD_REQUEST }
        }

        const permissionsByRole = await getPermissionsByRoleId(1, 10, roleId)

        if(!permissionsByRole.length) {
            throw { message: 'This role doesnt have any resource assigned', status: BAD_REQUEST }
        }

        const [ record ] = permissionsByRole
        const { dataValues: { resource: { dataValues: { id } } } } = record

        if(parseInt(id) !== parseInt(resourceId)) {
            throw { message: 'This role have already this resource assigned', status: BAD_REQUEST }
        }

        const [ rowsAffected ] = await editPermissionsToRole(roleId, body)

        if(!rowsAffected) {
            throw { message: 'Permissions werent updated', status: BAD_REQUEST }
        }

        res.status(SUCCESS).json({code: 0, data: { rowsAffected: rowsAffected }, message: 'Permissions updated successfully' })
    } catch (e) {
        const { message, status } = e
        res.status(status || INTERNAL_SERVER_ERROR).json({ code: 1, message: message })
    }
}

module.exports = {
    addPermissions,
    getPermissionsByRole,
    editPermissions
}