const express = require('express')
const router = express.Router()
const { getRoles, createRole, getRole, updateRole, updateRolePartially } = require('./controller')
const { paginationMiddleware } = require('../../middlewares')


router.get('/', paginationMiddleware, async (req, res) => {
    return await getRoles(req, res)
})

router.post('/', async (req, res) => {
    return await createRole(req, res)
})

router.get('/:id', async (req, res) => {
    return await getRole(req, res)
})

router.patch('/:id', async (req, res) => {
    return await updateRole(req, res)
}) 

router.put('/:id', async (req, res) => {
    return await updateRolePartially(req, res)
})




module.exports = router