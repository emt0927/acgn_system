// 注册表
const mongoose = require('mongoose')
const register = new mongoose.Schema({
    username: String,
    password: String
}, {
    timestamps: true
})
module.exports = mongoose.model('admins', register)