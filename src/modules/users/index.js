const express = require('express')
const router = express.Router()
const { getUsers, createUser, updateUser, replaceUserAttributes } = require('./controller')
const { paginationMiddleware, venezuelanIdMiddleware } = require('../../middlewares')

router.get('/', paginationMiddleware, async (req, res) => {
    return await getUsers(req, res)
})

router.post('/', async (req, res) => {
    return await createUser(req, res)
})

router.patch('/:id', venezuelanIdMiddleware, async (req, res) => {
    return await updateUser(req, res)
})

router.put('/:id', venezuelanIdMiddleware, async (req, res) => {
    return await replaceUserAttributes(req, res)
})

module.exports = router