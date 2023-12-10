module.exports = (DataTypes, sequelize) => {
    const Resource = sequelize.define('resource', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            unique: true,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        level: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 0,    
        },
        url: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: '/',
        },
        icon: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    }, {
        timestamps: true,
        tableName: 'resources',
    })
    
    return Resource
}