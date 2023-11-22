const fs = require('fs')
const path = require('path')
const log = require('npmlog')
const { Sequelize, DataTypes } = require('sequelize')

const db = {}

let sequelize = require('../utils/sequelize')

db.sequelize = sequelize
db.Sequelize = Sequelize

db.user = require('./User')(DataTypes, sequelize) 
db.role = require('./Role')(DataTypes, sequelize)

db.sequelize.sync({ alter: true }).then(() => log.info('Database synchronized', 'Bootstraping'))

module.exports = db

