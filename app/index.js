const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv").config()
const api = require("./routes/api")
const app = express()

//const Auth0Config = require("../util/auth0/config")

app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.raw())

app.use("/api", api)

app.get("/", async (req, res) => {
    res.send("template api")
})


module.exports =  app 