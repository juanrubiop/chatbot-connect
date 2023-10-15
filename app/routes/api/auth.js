const router = require("express").Router()
const { validateToken, validateAuthorization } = require('../../middleware/auth')
const authController = require("../../controllers/auth")

router.get("/token/generate", async (req, res) => {
    await authController.generateToken(req, res)
})

router.post('/login', async (req, res) => {
    await authController.login(req, res)
})

module.exports = router;
