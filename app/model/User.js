const { sequelize } = require('../db');
const { DataTypes } = require('sequelize');
const { createHash } = require('crypto');
const { Role } = require('../model/Role');

const User = sequelize.define('User',{
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        set(value) {
            this.setDataValue('password', createHash('sha256').update(value).digest('base64'));
        }
    },
    role_id: {
        type: DataTypes.INTEGER
    },
    name: {
        type: DataTypes.STRING
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    }
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    paranoid: true,
    deletedAt: 'deleted_at',
    defaultScope: {
        attributes: { exclude: ['password'] },
    },
    scopes: {
        auth: {
            attributes: { },
        }
    }
});

User.belongsTo(Role, { constraints: false , foreignKey: 'role_id'});

sequelize.sync();
// sequelize.sync({ force: true });

const initSuperAdmin = async () => {
    try {
        superadmin = await User.create({
            email: 'superadmin',
            username: 'superadmin',
            password: 'superuserpasswordistecmilenio',
            role_id : 1,
            name: 'superadmin',
            is_active: true
        });
    }
    catch (error) {
        console.log(error);
    }
};

// initSuperAdmin();

module.exports = {
    User
}
