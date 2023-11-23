const { Op } = require('sequelize')
const db = require('../../../models')
const { INTERNAL_SERVER_ERROR } = require('../../../common/constants')

async function getAllRoles(pageNumber, pageSize, attributes = ['id', 'name']) {
    try {
        const roles = await db.role.findAll({
            skip: (pageNumber - 1) * pageSize,
            limit: pageSize,
            attributes: attributes
        })
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

async function partialUpdateRole(id, attributes) {
    try {
        return await db.role.update(attributes, { where: { id: { [Op.eq]: id } } })
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