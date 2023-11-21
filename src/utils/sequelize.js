const { Sequelize } = require('sequelize')
const { env: { DB_DIALECT, DB_HOST, DB_NAME, DB_USER, DB_PASSWORD  }  } = process

module.exports =  new Sequelize(`${DB_DIALECT}://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`)