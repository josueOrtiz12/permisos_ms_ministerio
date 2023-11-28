const express = require('express')
const router = express.Router()

const { login } = require('./controller');

router.post('/login', async (req , res) => {
    return await login(req, res)
});


module.exports = router