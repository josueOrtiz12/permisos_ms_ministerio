const Joi = require('joi')

const getResourcesByIdSchema = Joi.object({
    id: Joi.number().required()
})

const createResourceSchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required()
})

const updateResourceSchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required()
})

const editResourceSchema = Joi.object({
    name: Joi.string(),
    description: Joi.string()
})

module.exports = {
    getResourcesByIdSchema,
    createResourceSchema,
    updateResourceSchema, 
    editResourceSchema
}