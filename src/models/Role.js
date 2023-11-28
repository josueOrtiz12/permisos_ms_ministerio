module.exports = (DataTypes, sequelize) => {
    const Role = sequelize.define('role', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            unique: true,
            allowNull: false,
        },
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