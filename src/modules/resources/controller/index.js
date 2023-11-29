const { SUCCESS, BAD_REQUEST, NOT_FOUND, INTERNAL_SERVER_ERROR } = require('../../../common/constants')
const { getResourcesByIdSchema, createResourceSchema, updateResourceSchema, editResourceSchema } = require('../schema')
const { getAllResources, getResourceBy, addNewResource, updateResourceComplete, editResourcePartial } = require('../service')

async function getResources(req, res) {
    try {
        const { query: { pageNumber, pageSize } } = req
        const resources = await getAllResources(pageNumber, pageSize)

        return res.status(SUCCESS).json({ code: 0, data: resources })
    } catch (e) {
        const { message, status } = e         
        res.status(status).json({ code: 1, message: message })
    }
}

async function getResourceById(req, res){
    try {
        const { error } = getResourcesByIdSchema.validate(req.params, { abortEarly: false })
        if(error?.details.length > 0) {
            const e = new Error(error?.details.map(({ message }) => message).join(', '))
            e.status = BAD_REQUEST
            throw e
        }

        const { params: { id } } = req
        const resource = await getResourceBy('id', id);

        if(!resource) {
            const error = new Error('Id not found')
            error.status = NOT_FOUND
            throw error
        }

        res.status(SUCCESS).json({ code: 0, data: resource })
        
    } catch (e) {
        const { message, status } = e         
        res.status(status).json({ code: 1, message: message })
    }
}

async function createResource(req, res) {
    try {
        const { error } = createResourceSchema.validate(req.body, { abortEarly: false })
        if(error?.details.length > 0) {
            const e = new Error(error?.details.map(({ message }) => message).join(', '))
            e.status = BAD_REQUEST
            throw e
        }
        
        const { body: { name, description } } = req
        
        if(await getResourceBy('name', name)) {
            const error = new Error('name of this resource already exists')
            error.status = BAD_REQUEST
            throw error
        }

        await addNewResource(name, description)
        res.status(SUCCESS).json({ code: 0, message: 'Resource created successfully' })
    } catch (e) {
        const { message, status } = e         
        res.status(status || INTERNAL_SERVER_ERROR).json({ code: 1, message: message })
    }
} 

async function updateResource(req, res) {
    try {
        const { error } = updateResourceSchema.validate(req.body, { abortEarly: false })

        if(!Number.isInteger(parseInt(req?.params?.id))) {
            const error = new Error('Id must be a number')
            error.status = BAD_REQUEST
            throw error
        }
        
        if(error?.details.length > 0) {
            const e = new Error(error?.details.map(({ message }) => message).join(', '))
            e.status = BAD_REQUEST
            throw e
        }

        const { params: { id }, body: { name, description } } = req

        if(!await getResourceBy('id', id)) {
            const error = new Error('Id not found')
            error.status = NOT_FOUND
            throw error
        }

        if(name && await getResourceBy('name', name)) {
            const error = new Error('name of this resource already exists')
            error.status = BAD_REQUEST
            throw error
        }

        const [ rowsAffected ] = await updateResourceComplete(id, name, description)

        if(!rowsAffected) {
            const error = new Error('Resource not updated')
            error.status = INTERNAL_SERVER_ERROR
            throw error
        }

        res.status(SUCCESS).json({ code: 0, data: { rowsAffected: rowsAffected },message: 'Resource updated successfully' })
    } catch (e) {
        console.log(e)
        const { message, status } = e
        res.status(status || INTERNAL_SERVER_ERROR).json({ code: 1, message: message })
    }
}

async function editResource(req, res) {
    try {
        req.body.id = req.params.id
        const { error } = editResourceSchema.validate(req.body, { abortEarly: false })
        delete req.query.id
        
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

        const { params: { id }, body } = req

        if(!await getResourceBy('id', id)) {
            const error = new Error('Id not found')
            error.status = NOT_FOUND
            throw error
        }

        if(body?.name && await getResourceBy('name', body?.name)) {
            const error = new Error('name of this resource already exists')
            error.status = BAD_REQUEST
            throw error
        }

        const [ rowsAffected ] = await editResourcePartial(id, body)

        if(!rowsAffected) {
            const error = new Error('Resource not updated')
            error.status = INTERNAL_SERVER_ERROR
            throw error
        }

        res.status(SUCCESS).json({ code: 0, data: { rowsAffected: rowsAffected },message: 'Resource updated successfully' })
    } catch (e) {
        const { message, status } = e
        res.status(status || INTERNAL_SERVER_ERROR).json({ code: 1, message: message })        
    }
}

module.exports = {
    getResources,
    getResourceById, 
    createResource,
    updateResource,
    editResource
}