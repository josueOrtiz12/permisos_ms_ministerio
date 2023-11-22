const express = require('express')
const router = express.Router()
const app = express()

router.use('/users', require('../modules/users'))
router.use('/roles', require('../modules/roles'))

module.exports = router