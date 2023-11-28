const express = require('express')
const router = express.Router()
const app = express()

router.use('/users', require('../modules/users'))
router.use('/roles', require('../modules/roles'))
router.use('/resources', require('../modules/resources'))
router.use('/roles/users', require('../modules/roles_by_users'))
router.use('/permissions', require('../modules/permissions'))

router.use('/auth' ,  require('../modules/auth'))

module.exports = router