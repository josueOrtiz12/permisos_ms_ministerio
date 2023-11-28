const fs = require('fs')
const path = require('path')
const log = require('npmlog')
const { Sequelize, DataTypes } = require('sequelize')

const { env: { DB_FORCE_SYNC, DB_ALTER_SYNC } } = process
const db = {}

let sequelize = require('../utils/sequelize')

db.sequelize = sequelize
db.Sequelize = Sequelize

db.user = require('./User')(DataTypes, sequelize) 
db.role = require('./Role')(DataTypes, sequelize)
db.resource = require('./Resource')(DataTypes, sequelize)
db.permission = require('./Permission')(DataTypes, sequelize)
db.roleByUser = require('./RoleByUser')(DataTypes, sequelize)

db.roleByUser.belongsTo(db.user, { foreignKey: 'userId' })
db.roleByUser.belongsTo(db.role, { foreignKey: 'roleId' })
db.resource.hasMany(db.permission, { foreignKey: 'resourceId' })
db.role.hasMany(db.permission, { foreignKey: 'roleId' })
db.permission.belongsTo(db.role, { foreignKey: 'roleId' })
db.permission.belongsTo(db.resource, { foreignKey: 'resourceId' })


db.sequelize
  .sync({ 
    force: DB_FORCE_SYNC || false, 
    // alter: DB_ALTER_SYNC || false 
  })
  .then(() => log.info('Database synchronized', 'Bootstraping'))

module.exports = db

