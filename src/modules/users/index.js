const express = require('express')
const router = express.Router()
const { getUsers, createUser, updateUser } = require('./controller')
const { paginationMiddleware, venezuelanIdMiddleware } = require('../../middlewares')

router.get('/', paginationMiddleware, async (req, res) => {
    return await getUsers(req, res)
})

router.post('/', venezuelanIdMiddleware, async (req, res) => {
    return await createUser(req, res)
})

router.patch('/:id', venezuelanIdMiddleware, async (req, res) => {
    return await updateUser(req, res)
})

module.exports = router