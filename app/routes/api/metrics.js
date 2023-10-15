const router = require("express").Router()
const { dateFromToFilter } = require("../../middleware/metrics")
const metricsController = require("../../controllers/metrics")


router.get("/getConversationsPerDay" ,dateFromToFilter, async (req, res) => {
    await metricsController.getConversationsPerDay(req, res)
})

router.get("/getMessagesPerDay", dateFromToFilter, async (req, res) => {
    await metricsController.getMessagesPerDay(req, res)
})

router.get("/getMessagesPerDayByTimeZone", dateFromToFilter, async (req, res) => {
    await metricsController.getMessagesPerDayByTimeZone(req, res)
})

router.get("/getMessagesPerMonth", dateFromToFilter, async (req, res) => {
    await metricsController.getMessagesPerMonth(req, res)
})

router.get("/getMessagesPerHour", dateFromToFilter, async (req, res) => {
    await metricsController.getMessagesPerHour(req, res)
})

router.get("/getAverageMessagesPerConversation", dateFromToFilter, async (req, res) => {
    await metricsController.getAverageMessagesPerConversation(req, res)
})

router.get("/getAverageConversationDurationPerDay", dateFromToFilter, async (req, res) => {
    await metricsController.getAverageConversationDurationPerDay(req, res)
})

module.exports = router;
