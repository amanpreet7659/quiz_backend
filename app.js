const express = require('express')
const mongoose = require('mongoose')
const app = express()
const router = express.Router()
const AppRoutes = require('./app_routes')
const cors = require('cors')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const { mongo: { uri } } = require('./services/vars')
require('dotenv').config()

mongoose.connect(uri)
    .then(res => {
        console.log(`Mongoose connection established ...`);
    })
    .catch(err => {
        console.log(`Mongoose connection error ${err}`);
    })

const corsOptions = {
    origin: "*",
    credentials: true, //access-control-allow-credentials:true
    optionSuccessStatus: 200,
};

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.header("Access-Control-Allow_Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin,X-Requested-With,Content-Type,Accept,Authorization"
    );
    if (req.method == "OPTIONS") {
        res.header(
            "Access-Control-Allow-Methods",
            "PUT",
            "POST",
            "PATCH",
            "DELETE",
            "GET"
        );
        return res.status(200).json({});
    }
    next();
});

app.options("*", cors({ origin: 'http://localhost:8080', optionsSuccessStatus: 200 }));

app.use(cors({ origin: "http://localhost:8080", optionsSuccessStatus: 200 }))

// api router
app.use('/api/v1', AppRoutes)

module.exports = app