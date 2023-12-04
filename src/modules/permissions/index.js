const express = require('express')
const router = express.Router()
const { paginationMiddleware, verifyTokenMiddleware } = require('../../middlewares')
const { getPermissionsByRole, addPermissions, editPermissions } = require('./controller')

router.get('/:roleId', [verifyTokenMiddleware , paginationMiddleware], async (req, res) => {
    return await getPermissionsByRole(req, res)
})

router.post('/', verifyTokenMiddleware, async (req, res) => {
    return await addPermissions(req, res)
})

router.put('/:roleId', verifyTokenMiddleware ,async (req, res) => {
    return await editPermissions(req, res)
})   

module.exports = router