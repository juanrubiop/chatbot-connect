//
const { sequelize } = require('../db');
const { Op } = require("sequelize");
const { BotLogDescription } = require('../model/BotLogDescription');


const getConversationsPerDay = async (req, res) => {
    // retrieve data
    console.log(req.dateFromToFilter)
    const conversations = await BotLogDescription.findAll({
        attributes: [
            [ sequelize.fn('date_format', sequelize.col('created_at'), '%Y-%m-%d'), 'dateDay' ],
            [ sequelize.fn('count', sequelize.fn('distinct', sequelize.col('conversation_id'))), 'n_conversations' ]
        ],
        where: req.dateFromToFilter,
        group: ['dateDay']
    });
    // send response
    return res.status(200).json({
        data: {
            conversationsPerDay: conversations
        },
        success: true
    });
}


const getMessagesPerDay = async (req, res) => {
    // retrieve data
    const messages = await BotLogDescription.findAll({
        attributes: [
            [ sequelize.fn('date_format', sequelize.col('created_at'), '%Y-%m-%d'), 'dateDay' ],
            [ sequelize.fn('count', sequelize.col('conversation_id')), 'n_messages' ]
        ],
        where: req.dateFromToFilter,
        group: ['dateDay']
    });
    // send response
    return res.status(200).json({
        data: {
            messagesPerDay: messages
        },
        success: true
    });
}


const getMessagesPerDayByTimeZone = async (req, res) => {
    // retrieve data
    const messages = await BotLogDescription.findAll({
        attributes: [
            [ sequelize.fn('date_format', sequelize.col('created_at'), '%Y-%m-%d'), 'dateDay' ],
            [ sequelize.col('local_timezone'), 'local_timezone' ],
            [ sequelize.fn('count', sequelize.col('conversation_id')), 'n_messages' ]
        ],
        where: req.dateFromToFilter,
        group: ['dateDay', 'local_timezone']
    });
    // send response
    return res.status(200).json({
        data: {
            messagesPerDay: messages
        },
        success: true
    });
}

const getMessagesPerMonth = async (req, res) => {
    // retrieve data
    const messages = await BotLogDescription.findAll({
        attributes: [
            [ sequelize.fn('date_format', sequelize.col('created_at'), '%Y-%m'), 'dateMonth' ],
            [ sequelize.fn('count', sequelize.col('created_at')), 'n_messages' ]
        ],
        where: req.dateFromToFilter,
        group: ['dateMonth']
    });
    // send response
    return res.status(200).json({
        data: {
            messagesPerDay: messages
        },
        success: true
    });
}

const getMessagesPerHour = async (req, res) => {
    // retrieve data
    const messages = await BotLogDescription.findAll({
        attributes: [
            [ sequelize.fn('hour', sequelize.col('created_at')), 'hour' ],
            [ sequelize.fn('count', sequelize.col('created_at')), 'n_messages' ]
        ],
        where: req.dateFromToFilter,
        group: ['hour']
    });
    // send response
    return res.status(200).json({
        data: {
            messagesPerHour: messages
        },
        success: true
    });
}


const getAverageMessagesPerConversation = async (req, res) => {
    // retrieve data
    const messages = await BotLogDescription.findAll({
        attributes: [
            [ sequelize.fn('date_format', sequelize.col('created_at'), '%Y-%m-%d'), 'dateDay' ],
            [ sequelize.literal('count(created_at) / count(distinct conversation_id)'), 'avg_msg_conv']
        ],
        where: req.dateFromToFilter,
        group: ['dateDay']
    });
    // send response
    return res.status(200).json({
        data: {
            averageMessagesPerConversation: messages
        },
        success: true
    });
}

const getAverageConversationDurationPerDay = async (req, res) => {
    // retrieve data
    const durations = await BotLogDescription.findAll({
        attributes: [
            [ sequelize.fn('date_format', sequelize.col('created_at'), '%Y-%m-%d'), 'dateDay'],
            [ sequelize.col('conversation_id'), 'conversationId'],
            [ sequelize.literal('round((max(local_timestamp) - min(local_timestamp)) / 60, 2)'), 'diff'],
        ],
        where: req.dateFromToFilter,
        group: ['dateDay', 'conversationId']
    }).then(conversationDurations => {
        // based on the specific durations of each conversation per day,
        // reduce to the average of all durations grouped by the date.
        const groupedByDate = conversationDurations.reduce((result, item) => {
          if (!result[item.dataValues.dateDay]) {
            result[item.dataValues.dateDay] = [];
          }
          result[item.dataValues.dateDay].push(item.dataValues.diff);
          return result;
        }, {});
        // map each conversationDuration average to each dateDay
        // by reducing (adding) all durations and dividing by number of conversations
        const averageDurations = Object.keys(groupedByDate).map(dateDay => {
          const durations = groupedByDate[dateDay];
          const average = durations.reduce((sum, value) => sum + parseFloat(value), 0) / durations.length;
          return { dateDay, averageDurationInMins: average };
        });
        return averageDurations;
    });
    return res.status(200).json({
        data: {
            averageConversationDuration: durations
        },
        success: true
    });
}

module.exports = {
    getConversationsPerDay,
    getMessagesPerHour,
    getMessagesPerDay,
    getMessagesPerDayByTimeZone,
    getMessagesPerMonth,
    getAverageMessagesPerConversation,
    getAverageConversationDurationPerDay
}
