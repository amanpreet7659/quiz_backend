const express = require('express')
const router = express.Router()
const User = require('./routes/user')

router.use('/user', User)
router.get('/', async (req, res, next) => {
    try {
        res.status(200).json({
            request: 'get request',
            message: "Connected successfully"
        })
    } catch (error) {

    }
})

//Error handling

router.use((req, res, next) => {
    const error = new Error("NOT FOUND");
    error.status = 404;
    next(error);
});

router.use((error, req, res, next) => {
    const err = res.status(error.status || 500);
    err.json({
        error: {
            message: error.message,
        },
    });
});

module.exports = router