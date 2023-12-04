const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken');
const { verificarToken } = require('../../middlewares')
const secretKey = process.env.SECRET_KEY;

const { login } = require('./controller');

router.post('/login', async (req , res) => {
    return await login(req, res)
});


module.exports = router