const { sequelize } = require('../db')
const { DataTypes } = require('sequelize');
const { BotLog } = require('../model/BotLog');

const BotLogDescription = sequelize.define('BotLogDescription',{
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    botlog_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    conversation_id: {
        type: DataTypes.STRING
    },
    activity_id: {
        type: DataTypes.STRING
    },
    type: {
        type: DataTypes.STRING
    },
    local_timestamp: {
        type: DataTypes.DATE
    },
    local_timezone: {
        type: DataTypes.STRING
    },
    channel: {
        type: DataTypes.STRING
    },
    from_id: {
        type: DataTypes.STRING
    },
    from_name: {
        type: DataTypes.STRING
    },
    event_name: {
        type: DataTypes.STRING
    },
    text: {
        type: DataTypes.TEXT
    }
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    tableName: 'botlogs_description'
});

BotLogDescription.belongsTo(BotLog, { constraints: false , foreignKey: 'botlog_id'});

sequelize.sync();
// sequelize.sync({ force: true });

module.exports = {
    BotLogDescription
}
