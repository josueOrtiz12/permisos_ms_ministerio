module.exports = (DataTypes, sequelize) => {
    const Role = sequelize.define('role', {
        name: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true,
        }
    }, {
        timestamps: true,
        tableName: 'roles',
    })
    
    return Role
}