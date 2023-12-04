const Joi = require('joi')
const { VENEZUELAN_ID_REGEX } = require('../../../common/constants')

const loginSchema = Joi.object({
    // id: Joi.string().regex(VENEZUELAN_ID_REGEX).required().messages({
    //     'string.pattern.base': 'invalid Venezuelan ID',
    //     'any.required': 'Id is required'
    // }),
    username : Joi.string().required().messages({
        'any.required': ' Invalid Username' 
    }),
    password: Joi.string().required().messages({
        'any.required': 'Invalid password'
    })    
    
});




module.exports = {
    loginSchema
}