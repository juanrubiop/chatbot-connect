const app = require('./index.js')
app.listen(process.env.PORT || 80, () => {
    console.log(
        `Listening on port ${process.env.PORT}!\n http://localhost:${process.env.PORT || 80
        }`
    )
})