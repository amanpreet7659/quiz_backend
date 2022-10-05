require('dotenv').config()
const express = require('express')
const MainRoute = require('./src/app')
const { port } = require('./src/services/vars')
const app = express()

app.use(MainRoute)

app.listen(port, (err) => {
    if (!err) {
        console.log(`server listen at http://localhost:${port}/`);
    }
    if (err) {
        console.log(`an error occur &{err}`);
    }
})