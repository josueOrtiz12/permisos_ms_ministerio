const Joi = require('joi')
const { editPermissions } = require('../controller')

const addPermissionsSchema = Joi.object({
    roleId: Joi.number().required(),
    resourceId: Joi.number().required(),  
})

editPermissionsSchema = Joi.object({
    execute: Joi.boolean(),
    read: Joi.boolean(),
    write: Joi.boolean(),
    roleId: Joi.number().required(),
    resourceId: Joi.number(),  
})

module.exports = {
    addPermissionsSchema,
    editPermissionsSchema
}