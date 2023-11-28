const { Op } = require('sequelize')
const db = require('../../../models')
const { INTERNAL_SERVER_ERROR } = require('../../../common/constants')

async function getPermissionsByRoleId(pageNumber = 1, pageSize = 10, roleId) {
    try {
        return await db.permission.findAll({
            include: [
                {
                    model: db.role,
                    as: 'role',
                    attributes: ['id', 'name', 'description'],
                },
                {
                    model: db.resource,
                    as: 'resource',
                    attributes: ['id', 'name', 'description']
                }
            ],
            skip: (pageNumber - 1) * pageSize,
            limit: pageSize,    
            attributes: ['id', 'execute', 'read', 'write'],
            where: { roleId: { [Op.eq]: roleId } },
        })
    } catch (e) {
        const error = new Error(e.message)
        error.status = INTERNAL_SERVER_ERROR
        throw error
    }
}

async function addPermissionsToRole(roleId, resourceId) {
    try {
        return await db.permission.create({ roleId, resourceId })
    } catch (e) {
        const error = new Error(e.message)
        error.status = INTERNAL_SERVER_ERROR
        throw error
    }
}

async function editPermissionsToRole(roleId, properties) {
    try {
        return await db.permission.update(properties, { where: { roleId } })
    } catch (e) {
        const error = new Error(e.message)
        error.status = INTERNAL_SERVER_ERROR
        throw error
    }
}

module.exports = {
    getPermissionsByRoleId,
    addPermissionsToRole,
    editPermissionsToRole
}