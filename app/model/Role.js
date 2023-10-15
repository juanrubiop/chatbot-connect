const { sequelize } = require('../db')
const { DataTypes } = require('sequelize');

const Role = sequelize.define('Role',{
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    default: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    permissions: {
        type: DataTypes.INTEGER
    }
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    paranoid: true,
    deletedAt: 'deleted_at'
});

sequelize.sync();
// sequelize.sync({ force: true });

const initRoles = async () => {
    try {
        superadmin = await Role.create({
            name: 'superadmin',
            default: false,
            permissions: 2
        });
        supervisor = await Role.create({
            name: 'supervisor',
            default: true,
            permissions: 1
        });
        reader = await Role.create({
            name: 'reader',
            default: false,
            permissions: 0
        });
    }
    catch(error) {
        console.log(error);
    }
};

// initRoles();

module.exports = {
    Role
}
