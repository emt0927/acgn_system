const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    userId: {
        ref: 'admins',
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        index: true
    }, nickname: { type: String, default: '' },
    coverurl: { type: String, default: '' }
}, {
    timestamps: true // updatedAt 时间戳
})
module.exports = mongoose.model('userInfo', userSchema)