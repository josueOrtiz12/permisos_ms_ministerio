const express = require('express')
const router = express.Router()
const { getUsers, createUser, updateUser, replaceUserAttributes, getUserById } = require('./controller')
const { paginationMiddleware, venezuelanIdMiddleware, verifyTokenMiddleware } = require('../../middlewares')

router.get('/', [verifyTokenMiddleware , paginationMiddleware], async (req, res) => {
    return await getUsers(req, res)
})

router.get('/:id', [verifyTokenMiddleware, venezuelanIdMiddleware], async (req, res) => {
    return await getUserById(req, res)
})

router.post('/', async (req, res) => {
    return await createUser(req, res)
})

router.patch('/:id', [verifyTokenMiddleware, venezuelanIdMiddleware], async (req, res) => {
    return await updateUser(req, res)
})

router.put('/:id', [verifyTokenMiddleware , venezuelanIdMiddleware], async (req, res) => {
    return await replaceUserAttributes(req, res)
})

module.exports = router