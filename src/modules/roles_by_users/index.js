const express = require('express')
const router = express.Router()
const { getRolesByUser, addRoleToUser, editRoleToUser } = require('./controller')
const { paginationMiddleware } = require('../../middlewares')

router.get('/:userId', paginationMiddleware, async (req, res) => {
    return await getRolesByUser(req, res)
})

router.post('/', async (req, res) => {
    return await addRoleToUser(req, res)
})

router.put('/:userId', async (req, res) => {
    return await editRoleToUser(req, res)
})


module.exports = router