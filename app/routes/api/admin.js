const router = require("express").Router()
const { validateToken, validateAuthorization } = require('../../middleware/auth')
const adminController = require("../../controllers/admin")


router.get('/user/:id', validateToken, validateAuthorization, async (req, res) => {
    await adminController.getUser(req, res);
})

router.get('/roles/list', validateToken, validateAuthorization, async (req, res) => {
    await adminController.getRoles(req, res);
})

router.post('/user/create', validateToken, validateAuthorization, async (req, res) => {
    await adminController.createUser(req, res);
})

router.post('/user/delete', validateToken, validateAuthorization, async (req, res) => {
    await adminController.deleteUser(req, res);
})

router.post('/user/deactivate', validateToken, validateAuthorization, async (req, res) => {
    await adminController.deactivateUser(req, res);
})

router.post('/user/activate', validateToken, validateAuthorization, async (req, res) => {
    await adminController.activateUser(req, res);
})

router.get('/users/list', validateToken, validateAuthorization, async (req, res) => {
    await adminController.listUsers(req, res);
})

module.exports = router;
