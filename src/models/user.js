const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user_name: {
        type: String,
        require: true
    },
    user_email: {
        type: String,
    },
    login_count: {
        type: Number,
        default: 1
    },
    facebook_id: {
        type: String
    },
    google_id: {
        type: String
    }
}, { timestamps: true })

module.exports = mongoose.model('users', UserSchema)