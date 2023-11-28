const { Op } = require('sequelize')
const db = require('../../../models')
const { INTERNAL_SERVER_ERROR } = require('../../../common/constants')

async function getAllResources(pageNumber, pageSize, attributes = ['id', 'name', 'description']) {
    try {
        const resources = await db.resource.findAll({
            skip: (pageNumber - 1) * pageSize,
            limit: pageSize,
            attributes: attributes
        })

        if(!resources.length) {
            const error = new Error('Resources not found')
            error.status = NOT_FOUND
            throw error
        }
        
        return resources;        
    } catch (e) {
        const error = new Error(e.message)
        error.status = INTERNAL_SERVER_ERROR   
        throw error
    }   
}

async function getResourceBy(param, value, attributes = ['id', 'name', 'description']) {
    try {
        const resource = await db.resource.findOne({ where: { [param]: value }, attributes: attributes })
        return resource 
    } catch (e) {
        const error = new Error(e.message)
        error.status = INTERNAL_SERVER_ERROR
        throw error
    }
}

async function addNewResource(name, description) {
    try {
        return await db.resource.create({ name, description })
    } catch (e) {
        const error = new Error(e.message)
        error.status = INTERNAL_SERVER_ERROR
        throw error
    }
}

async function updateResourceComplete(id, name, description) {
    try {
        return await db.resource.update({ name, description }, { where: { id: { [Op.eq]: id } } })
    } catch (e) {
        const error = new Error(e.message)
        error.status = INTERNAL_SERVER_ERROR
        throw error
    }
}

async function editResourcePartial(id, properties) {
    try {
        return await db.resource.update(properties, { where: { id: { [Op.eq]: id } } })
    } catch (e) {
        const error = new Error(e.message)
        error.status = INTERNAL_SERVER_ERROR
        throw error
    }
}

module.exports = {
    getAllResources,
    getResourceBy,
    addNewResource,
    updateResourceComplete,
    editResourcePartial
}