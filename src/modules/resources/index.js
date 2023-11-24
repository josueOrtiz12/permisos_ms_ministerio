const express = require('express')
const router = express.Router()
const { paginationMiddleware } = require('../../middlewares')
const { getResources, getResourceById, createResource, updateResource, editResource } = require('./controller')

router.get('/', paginationMiddleware, async (req, res) => {
    return await getResources(req, res)
})

router.get('/:id', async (req, res) => {
    return await getResourceById(req, res)
})

router.post('/', async (req, res) => {
    return await createResource(req, res)
})

router.patch('/:id', async (req, res) => {
    return await updateResource(req, res)
})

router.put('/:id', async (req, res) => {
    return await editResource(req, res)
})

module.exports = router