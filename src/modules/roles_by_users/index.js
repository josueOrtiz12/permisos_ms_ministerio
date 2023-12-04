const express = require('express')
const router = express.Router()
const { getRolesByUser, addRoleToUser, editRoleToUser } = require('./controller')
const { paginationMiddleware, verifyTokenMiddleware } = require('../../middlewares')

router.get('/:userId', [verifyTokenMiddleware, paginationMiddleware], async (req, res) => {
    return await getRolesByUser(req, res)
})

router.post('/', verifyTokenMiddleware ,async (req, res) => {
    return await addRoleToUser(req, res)
})

router.put('/:userId', verifyTokenMiddleware , async (req, res) => {
    return await editRoleToUser(req, res)
})


module.exports = router