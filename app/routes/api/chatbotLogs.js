const router = require("express").Router()
const logController = require("../../controllers/chatbotLogs")

router.post("/collect-logs", async (req, res) => {
    await logController.retrieveBotLog(req, res)
})

router.get("/getChatbotLogs", async (req, res) => {
    await logController.getChatbotLogs(req, res)
})

module.exports = router;
