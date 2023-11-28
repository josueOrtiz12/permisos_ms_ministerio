module.exports = (DataTypes, sequelize) => {
    const Permission = sequelize.define('permission', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            unique: true,
            allowNull: false,
        },
        roleId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: { tableName: 'roles'  },
                key: 'id',
            },
        },
        resourceId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: { tableName: 'resources' },
                key: 'id',
            },
        },
        execute: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: false,
        },
        read: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: false,
        },
        write: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: false,
        },
    }, {
        timestamps: true,
        tableName: 'permissions',
    })



    return Permission
}