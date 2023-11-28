const express = require('express')
const router = express.Router()
const { paginationMiddleware } = require('../../middlewares')
const { getPermissionsByRole, addPermissions, editPermissions } = require('./controller')

router.get('/:roleId', paginationMiddleware, async (req, res) => {
    return await getPermissionsByRole(req, res)
})

router.post('/', async (req, res) => {
    return await addPermissions(req, res)
})

router.put('/:roleId', async (req, res) => {
    return await editPermissions(req, res)
})   

module.exports = router