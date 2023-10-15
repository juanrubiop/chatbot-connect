const router = require("express").Router()

const auth = require("./api/auth")
const admin = require("./api/admin")
const chatbotLogs = require("./api/chatbotLogs")
const knowledgeBase = require("./api/knowledgeBase")
const metrics = require("./api/metrics")

router.use("/auth", auth)
router.use("/admin", admin)
router.use("/chatbot", chatbotLogs)
router.use("/documents", knowledgeBase)
router.use("/metrics", metrics)

module.exports = router
