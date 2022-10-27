const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const User = require("../models/user");
const { ErrorResponse, success, error } = require("../services/response");
const jwt = require("jsonwebtoken");
const {
  jwt: { expiry, secret },
} = require("../services/vars");

// register user

router.post("/", async (req, res, next) => {
  const { userEmail, facebookId, googleId, userName } = req.body;
  const userPicture = req.body.picture;
  try {
    // res.status(200).json(!userPicture.data.is_silhouette ? userPicture.data.url : "");
    const cloudUser = await User.findOne({ user_email: userEmail });

    if (cloudUser) {
      const {
        _id,
        login_count,
        user_email,
        user_name,
        facebook_id,
        google_id,
        picture,
      } = cloudUser;

      await User.updateOne(
        { _id },
        {
          $set: {
            _id,
            facebook_id: facebookId,
            google_id: googleId,
            login_count: login_count + 1,
            user_name: userName,
            picture: !userPicture.data.is_silhouette
              ? userPicture.data.url
              : "",
          },
        }
      );

      const token = jwt.sign(
        {
          id: _id,
          userEmail: user_email,
          userName: user_name,
          facebook_id,
          google_id,
          picture: !userPicture.data.is_silhouette ? userPicture.data.url : "",
        },
        secret
      );

      success(
        res,
        {
          token,
          loginCount: login_count + 1,
          userName: user_name,
          picture: !userPicture.data.is_silhouette ? userPicture.data.url : "",
        },
        200
      );
    }

    if (!cloudUser) {
      const createdUser = await User.create({
        _id: mongoose.Types.ObjectId(),
        user_email: userEmail,
        user_name: userName,
        login_count: 1,
        facebook_id: facebookId,
        google_id: googleId,
        picture: !userPicture.data.is_silhouette ? userPicture.data.url : "",
      });

      let { _id, facebook_id, google_id, user_email, user_name, picture } =
        createdUser;

      const token = jwt.sign(
        {
          id: _id,
          userEmail: user_email,
          userName: user_name,
          facebook_id,
          google_id,
          picture,
        },
        secret
      );

      success(
        res,
        {
          token,
          loginCount: 1,
          userName: user_name,
          picture,
        },
        200
      );
    }
  } catch (err) {
    error(res, err, 404);
  }
});

// get all users

router.get("/", async (req, res, next) => {
  try {
    const allusers = await User.find();
    const totalCount = await User.count();
    success(res, { users: allusers, totalCount }, 200);
  } catch (err) {
    error(res, err, 404);
  }
});

// delete all users

router.delete("/delete-all", async (req, res, next) => {
  try {
    await User.deleteMany();
    success(res, { message: "All users deleted permanentaly" }, 200);
  } catch (err) {
    error(res, err, 404);
  }
});

module.exports = router;
