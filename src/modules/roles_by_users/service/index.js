const { Op } = require('sequelize')
const db = require('../../../models')
const { INTERNAL_SERVER_ERROR } = require('../../../common/constants')

async function addNewRoleToUser(userId, roleId) {
    try {
        return await db.roleByUser.create({ userId: userId, roleId: roleId})
    } catch (e) {
        const error = new Error(e.message)
        error.status = INTERNAL_SERVER_ERROR
        throw error
    }

}

async function getRolesByUserId(pageNumber = 1, pageSize = 10, userId) {
    try {
        const roles = await db.roleByUser.findAll({
            include: [
                {
                    model: db.role,
                    as: 'role',
                    attributes: ['id','name', 'description']
                },
                {
                    model: db.user,
                    as: 'user',
                    attributes: ['id', 'username']
                }
            ],
            skip: (pageNumber - 1) * pageSize,
            limit: pageSize,
            attributes: ['createdAt', 'updatedAt'],
            where: { userId: { [Op.eq]: userId } },
        })

        return roles
    } catch (e) {
        const error = new Error(e.message)
        error.status = INTERNAL_SERVER_ERROR   
        throw error
    }
}

async function editRoleByUserId(userId, roleId) {
    try {
        return await db.roleByUser.update({ roleId: roleId }, { where: { userId: userId } })
    } catch (e) {
        const error = new Error(e.message)
        error.status = INTERNAL_SERVER_ERROR
        throw error
    }
}

module.exports = {
    getRolesByUserId,
    addNewRoleToUser,
    editRoleByUserId
}