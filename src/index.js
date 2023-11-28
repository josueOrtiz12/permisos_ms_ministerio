const express = require('express')
const log = require('npmlog')
const cors = require('cors')
require('dotenv').config()
const sequelizeClient = require('./utils/sequelize')
const models = require('./models')

const routes = require('./routes')
const { env: { APP_PORT } } = process
const app = express()
const port = APP_PORT || 3000


app.use(cors())
app.use(express.json())
app.use('/api/v1', routes)

app.listen(port, async () => {
    log.info(`Permissions API listening at http://localhost:${port}`, 'Bootstraping')
    let connection = null 
    try {
        log.info('Connecting to database ...', 'Bootstraping')
        connection = await sequelizeClient.authenticate()
    } catch (e) {
        log.error(`Unable to connect to the database: ${e}`, 'Bootstraping')
    } finally {
        if(connection) await sequelizeClient.close()
        log.info('Connection closed', 'Bootstraping')
    }
})  