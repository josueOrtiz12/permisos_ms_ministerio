const Joi = require('joi')

const addNewRoleToUserSchema = Joi.object({
    userId: Joi.string().required(),
    roleId: Joi.number().required()
})

const editRoleToUserSchema = Joi.object({
    userId: Joi.string().required(),
    roleId: Joi.number().required()
})

module.exports = {
    addNewRoleToUserSchema,
    editRoleToUserSchema
}