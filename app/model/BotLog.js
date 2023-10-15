const { sequelize } = require('../db')
const { DataTypes } = require('sequelize');

const BotLog = sequelize.define('Botlog',{
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    conversation_id: {
        type: DataTypes.STRING,
        unique: true
    },
    activities: {
        type: DataTypes.JSON
    }
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

sequelize.sync();
// sequelize.sync({ force: true });

module.exports = {
    BotLog
}
