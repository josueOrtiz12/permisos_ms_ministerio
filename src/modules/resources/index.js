const express = require('express')
const router = express.Router()
const { paginationMiddleware, verifyTokenMiddleware } = require('../../middlewares')
const { getResources, getResourceById, createResource, updateResource, editResource,  } = require('./controller')

router.get('/', [verifyTokenMiddleware , paginationMiddleware], async (req, res) => {
    return await getResources(req, res)
})

router.get('/:id', verifyTokenMiddleware ,async (req, res) => {
    return await getResourceById(req, res)
})

router.post('/', verifyTokenMiddleware , async (req, res) => {
    return await createResource(req, res)
})

router.patch('/:id',verifyTokenMiddleware , async (req, res) => {
    return await updateResource(req, res)
})

router.put('/:id',verifyTokenMiddleware , async (req, res) => {
    return await editResource(req, res)
})

module.exports = router