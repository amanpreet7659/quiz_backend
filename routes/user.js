const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const User = require('../models/user')
const { ErrorResponse, success, error } = require('../services/response')
const jwt = require('jsonwebtoken')
const { jwt: { expiry, secret } } = require('../services/vars')

// register user

router.post("/", async (req, res, next) => {
    console.log("reached here");
    let { userEmail, facebookId, googleId, userName } = req.body
    try {
        const alreadyExsist = await User.findOne({ user_email: userEmail }).count() > 0

        if (alreadyExsist) {

            let { _id, login_count, user_email, user_name, facebook_id, google_id } = await User.findOne({ user_email: userEmail })
            await User.updateOne({ _id }, {
                $set: {
                    _id,
                    facebook_id: facebookId,
                    google_id: googleId,
                    login_count: login_count + 1,
                }
            })
            const token = jwt.sign({ id: _id, userEmail: user_email, userName: user_name }, secret)

            success(res, {
                token,
                loginCount: login_count + 1,
                // userEmail: user_email,
                // userName: user_name
            }, 200)
        }

        if (!alreadyExsist) {
            await User.create({
                _id: mongoose.Types.ObjectId(),
                user_email: userEmail,
                user_name: userName,
                login_count: 1
            })
            let { _id, facebook_id, google_id, user_email, user_name } = await User.findOne({ user_email: userEmail })

            const token = jwt.sign({ id: _id, userEmail: user_email, userName: user_name }, secret)

            success(res, {
                token,
                loginCount: 1,
                // userEmail: user_email,
                // userName: user_name
            }, 200)
        }
    } catch (err) {
        error(res, err, 404)
    }
})

// get all users

router.get("/", async (req, res, next) => {
    try {
        const allusers = await User.find()
        const totalCount = await User.count()
        success(res, { users: allusers, totalCount }, 200)

    } catch (err) {
        error(res, err, 404)
    }
})

// delete all users

router.delete("/delete-all", async (req, res, next) => {
    try {
        await User.deleteMany()
        success(res, { message: "All users deleted permanentaly" }, 200)
    } catch (err) {
        error(res, err, 404)
    }
})

module.exports = router