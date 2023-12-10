const Joi = require('joi')

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
    level: Joi.number().integer(),
    url: Joi.string(),
    icon: Joi.string(),
})

module.exports = {
    addPermissionsSchema,
    editPermissionsSchema
}