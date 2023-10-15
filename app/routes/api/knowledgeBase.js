const router = require("express").Router()
const documentController = require("../../controllers/knowledgeBase")


router.get("/document-blob/view",async (req,res) => {
    await documentController.viewDocuments(req,res)
})

router.post("/document-blob/edit", async (req,res) => {
    await documentController.editDocumentBlob(req,res)
})

router.post("/document-blob/delete", async (req,res) => {
    await documentController.deleteDocumentBlob(req,res)
})
module.exports = router;