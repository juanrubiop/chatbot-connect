const axios = require("axios")
const { BotLog } = require('../model/BotLog')
const { BotLogDescription } = require('../model/BotLogDescription')

let url = process.env.URL_PVA_DIRECTLINE
let token = process.env.CHATBOT_CONNECT_TOKEN


// const conversationId="1dWQrTaBDrW8vyBwPj7RaI-us"

const retrieveBotLog = async (req, res) => {
    const conversationId = req.body.conversationId
    const uri = url + '/' + conversationId + '/activities'
    try {
        const directline = await axios.get(uri, { headers: { Authorization: token }})
        const activities = directline.data.activities
        const conversationLog = await BotLog.create({
            conversation_id: conversationId,
            activities: activities
        });
        const logMapping = activities
                            .filter( (x) => x.text || x.name )
                            .map( (x) => { return {
                                activity_id: x.id ? x.id : null,
                                text: x.text ? x.text : null,
                                type: x.type ? x.type : null,
                                event_name: x.name ? x.name : null,
                                local_timestamp: x.localTimestamp ? x.localTimestamp : null,
                                local_timezone: x.localTimezone ? x.localTimezone : null,
                                channelId: x.channel ? x.channel : null,
                                from_id: x.from.id ? x.from.id : null,
                                from_name: x.from.name ? x.from.name : null,
                                conversation_id: conversationId,
                                botlog_id: conversationLog.id
                                }}
                            );
        try {
            const logDescription = await BotLogDescription.bulkCreate(
                logMapping
            );
        }
        catch (error) {
            console.log(error)
            return res.status(500).json({
                success: false,
                message: 'Internal Server Error during database connection.'
            })
        }
        return res.status(200).json({
            message: `conversation ${req.body.conversationId} successfully retrieved.`,
            directline: directline.data.activities
        });
    }
    catch(error) {
        res.status(500).json({ message: error });
    }
}

const getChatbotLogs = async (req, res) => {
    const skip = req.query.skip ? parseInt(req.query.skip) : null
    const limit = req.query.limit ? parseInt(req.query.limit) : null
    const logs = await BotLog.findAll({
        offset: skip,
        limit: limit,
        order: [['created_at', 'desc']]
    })
    res.status(200).json({
        logs: logs,
        success: true,
        message: "Botlogs retrieved successfully."
    })
}


module.exports = {
    retrieveBotLog,
    getChatbotLogs
}
