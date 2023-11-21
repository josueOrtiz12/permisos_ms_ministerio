const express = require('express')
const router = express.Router()
const app = express()

router.use('/users', require('../modules/users'))

module.exports = router