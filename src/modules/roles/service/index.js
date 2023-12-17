const { Op } = require('sequelize')
const db = require('../../../models')
const { INTERNAL_SERVER_ERROR, NOT_FOUND } = require('../../../common/constants')

async function getAllRoles(pageNumber, pageSize, filters={}) {
    try {
        const roles = await db.permission.findAll({
            include: [
                {
                    model: db.role,
                    as: 'role',
                    where: !filters.role ? {} : {
                        ['name']: {
                            [Op.substring]: filters.role || '%%'
                        }
                    },
                    exclude: ['createdAt', 'updatedAt']
                },
                {
                    model: db.resource,
                    as: 'resource',
                    where: !filters.resource ? {} : {
                        ['name']: {
                            [Op.substring]: filters.resource || '%%'
                        }
                    
                    },
                    exclude: ['createdAt', 'updatedAt']
                }
            ],
            required: true,
            skip: (pageNumber - 1) * pageSize,
            limit: pageSize,
        })
        
        if(!roles.length) {
            const error = new Error('Roles not found')
            error.status = NOT_FOUND
            throw error
        }
        
        return roles
    } catch (e) {
        const error = new Error(e.message)
        error.status = INTERNAL_SERVER_ERROR   
        throw error
    }
}

async function getRoleBy(param, value, attributes=['id', 'name', 'description']){ 
    try {
        const role = await db.role.findOne({ where: { [param]: value }, attributes: attributes })
        return role
    } catch (e) {
        const error = new Error(e.message)
        error.status = INTERNAL_SERVER_ERROR
        throw error
    }

}

async function addNewRole(attributes) {
    try {
        return await db.role.create(attributes)
    } catch (e) {
        const error = new Error(e.message)
        error.status = INTERNAL_SERVER_ERROR
        throw error
    }
}

async function completeUpdateRole(id, name, description) {
    try {
        return await db.role.update({ name: name, description: description }, { where: { id: { [Op.eq]: id } } })
    } catch (e) {
        const error = new Error(e.message)
        error.status = INTERNAL_SERVER_ERROR
        throw error
    }
}

async function partialUpdateRole(id, properties) {
    try {
        return await db.role.update(properties, { where: { id: { [Op.eq]: id } } })
    } catch (e) {
        const error = new Error(e.message)
        error.status = INTERNAL_SERVER_ERROR
        throw error
    }
}   


module.exports = {
    getAllRoles,
    getRoleBy,
    addNewRole,
    completeUpdateRole,
    partialUpdateRole
}