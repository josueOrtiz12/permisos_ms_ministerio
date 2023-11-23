module.exports = (DataTypes, sequelize) => {
    const RolesByUsers = sequelize.define('rolesByUsers', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncerement: true,
            unique: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: { tableName: 'users'  },
                key: 'id',
            },
        },
        roleId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: { tableName: 'roles' },
                key: 'id',
            },
        },
    }, {
        timestamps: true,
        tableName: 'rolesByUsers',
    })

    return RolesByUsers
}